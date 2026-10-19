from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser
from app.database import get_db
from app.models import Message, MessageThread, Tenant, User
from app.schemas.messaging import MessageCreate, ThreadCreate
from app.services.audit import create_notification, record_audit

router = APIRouter(prefix="/messages", tags=["Messaging"])


def can_access_thread(thread: MessageThread, user: User) -> bool:
    if user.role == "SUPER_ADMIN":
        return True
    return user.role == "TENANT_ADMIN" and user.tenant_id in {
        thread.tenant_id,
        thread.recipient_tenant_id,
    }


def thread_summary(thread: MessageThread) -> dict[str, object]:
    last_message = thread.messages[-1] if thread.messages else None
    return {
        "id": thread.id,
        "subject": thread.subject,
        "thread_type": thread.thread_type,
        "tenant_id": thread.tenant_id,
        "recipient_tenant_id": thread.recipient_tenant_id,
        "last_message": last_message.body if last_message else "",
        "last_message_at": last_message.created_at if last_message else thread.created_at,
    }


def notify_other_participant(
    db: Session,
    thread: MessageThread,
    sender: User,
) -> None:
    if sender.role == "SUPER_ADMIN":
        create_notification(
            db,
            tenant_id=thread.tenant_id,
            notification_type="MESSAGE",
            title=f"New SuperAdmin message: {thread.subject}",
            body="Open Messages to read and reply.",
        )
        return

    if thread.thread_type == "SUPER_ADMIN":
        admin = (
            db.query(User)
            .filter(User.role == "SUPER_ADMIN", User.is_active.is_(True))
            .first()
        )
        if admin:
            create_notification(
                db,
                recipient_user_id=admin.id,
                notification_type="MESSAGE",
                title=f"New tenant message: {thread.subject}",
                body="Open Messages to read and reply.",
            )
        return

    recipient_tenant_id = (
        thread.recipient_tenant_id
        if sender.tenant_id == thread.tenant_id
        else thread.tenant_id
    )
    create_notification(
        db,
        tenant_id=recipient_tenant_id,
        notification_type="MESSAGE",
        title=f"New tenant message: {thread.subject}",
        body="Open Messages to read and reply.",
    )


@router.get("/tenants")
def list_message_recipients(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    if user.role != "TENANT_ADMIN" or user.tenant_id is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Tenant account required.")
    tenants = (
        db.query(Tenant)
        .filter(Tenant.status == "ACTIVE", Tenant.id != user.tenant_id)
        .order_by(Tenant.company_name.asc())
        .all()
    )
    return {
        "items": [
            {"id": tenant.id, "company_name": tenant.company_name}
            for tenant in tenants
        ]
    }


@router.get("/threads")
def list_threads(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    query = db.query(MessageThread)
    if user.role == "TENANT_ADMIN" and user.tenant_id is not None:
        query = query.filter(
            or_(
                MessageThread.tenant_id == user.tenant_id,
                MessageThread.recipient_tenant_id == user.tenant_id,
            )
        )
    elif user.role != "SUPER_ADMIN":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Messaging access required.")
    threads = query.order_by(MessageThread.updated_at.desc()).all()

    for thread in threads:
        for message in thread.messages:
            if message.sender_id != user.id and message.read_at is None:
                message.read_at = datetime.utcnow()
    if threads:
        db.commit()

    return {"items": [thread_summary(thread) for thread in threads]}


@router.post("/threads", status_code=status.HTTP_201_CREATED)
def create_thread(
    payload: ThreadCreate,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    if user.role == "TENANT_ADMIN":
        if user.tenant_id is None:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Tenant account required.")
        if payload.recipient_super_admin:
            tenant_id = user.tenant_id
            recipient_tenant_id = None
            thread_type = "SUPER_ADMIN"
        else:
            if payload.recipient_tenant_id == user.tenant_id:
                raise HTTPException(
                    status.HTTP_422_UNPROCESSABLE_ENTITY, "Choose another tenant."
                )
            recipient = db.get(Tenant, payload.recipient_tenant_id)
            if not recipient or recipient.status != "ACTIVE":
                raise HTTPException(
                    status.HTTP_404_NOT_FOUND, "Active tenant not found."
                )
            tenant_id = user.tenant_id
            recipient_tenant_id = recipient.id
            thread_type = "TENANT"
    elif user.role == "SUPER_ADMIN":
        if payload.recipient_super_admin or payload.recipient_tenant_id is None:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "SuperAdmin messages must have a tenant recipient.",
            )
        recipient = db.get(Tenant, payload.recipient_tenant_id)
        if not recipient:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Tenant not found.")
        tenant_id = recipient.id
        recipient_tenant_id = None
        thread_type = "SUPER_ADMIN"
    else:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Messaging access required.")

    thread = MessageThread(
        tenant_id=tenant_id,
        recipient_tenant_id=recipient_tenant_id,
        thread_type=thread_type,
        subject=payload.subject.strip(),
        created_by=user.id,
    )
    db.add(thread)
    db.flush()
    db.add(Message(thread_id=thread.id, sender_id=user.id, body=payload.body.strip()))
    notify_other_participant(db, thread, user)
    record_audit(
        db,
        actor_id=user.id,
        tenant_id=user.tenant_id or tenant_id,
        action="MESSAGE_THREAD_CREATED",
        entity_type="message_thread",
        entity_id=thread.id,
        details={"thread_type": thread_type},
    )
    if thread_type == "TENANT" and recipient_tenant_id is not None:
        record_audit(
            db,
            actor_id=user.id,
            tenant_id=recipient_tenant_id,
            action="MESSAGE_RECEIVED",
            entity_type="message_thread",
            entity_id=thread.id,
        )
    db.commit()
    db.refresh(thread)
    return thread_summary(thread)


@router.get("/threads/{thread_id}")
def read_thread(
    thread_id: int,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    thread = db.get(MessageThread, thread_id)
    if not thread or not can_access_thread(thread, user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found.")
    messages = sorted(thread.messages, key=lambda item: (item.created_at, item.id))
    for message in messages:
        if message.sender_id != user.id and message.read_at is None:
            message.read_at = datetime.utcnow()
    db.commit()
    return {
        **thread_summary(thread),
        "messages": [
            {
                "id": message.id,
                "sender_id": message.sender_id,
                "sender_name": message.sender.username,
                "body": message.body,
                "created_at": message.created_at,
            }
            for message in messages
        ],
    }


@router.post("/threads/{thread_id}", status_code=status.HTTP_201_CREATED)
def reply_thread(
    thread_id: int,
    payload: MessageCreate,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    thread = db.get(MessageThread, thread_id)
    if not thread or not can_access_thread(thread, user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found.")
    message = Message(
        thread_id=thread.id,
        sender_id=user.id,
        body=payload.body.strip(),
    )
    thread.updated_at = datetime.utcnow()
    db.add(message)
    notify_other_participant(db, thread, user)
    record_audit(
        db,
        actor_id=user.id,
        tenant_id=user.tenant_id or thread.tenant_id,
        action="MESSAGE_SENT",
        entity_type="message_thread",
        entity_id=thread.id,
    )
    if user.role == "SUPER_ADMIN" or thread.thread_type == "SUPER_ADMIN":
        recipient_tenant_id = thread.tenant_id
    else:
        recipient_tenant_id = (
            thread.recipient_tenant_id
            if user.tenant_id == thread.tenant_id
            else thread.tenant_id
        )
    if recipient_tenant_id is not None and recipient_tenant_id != user.tenant_id:
        record_audit(
            db,
            actor_id=user.id,
            tenant_id=recipient_tenant_id,
            action="MESSAGE_RECEIVED",
            entity_type="message_thread",
            entity_id=thread.id,
        )
    db.commit()
    db.refresh(message)
    return {
        "id": message.id,
        "sender_id": message.sender_id,
        "sender_name": user.username,
        "body": message.body,
        "created_at": message.created_at,
    }
