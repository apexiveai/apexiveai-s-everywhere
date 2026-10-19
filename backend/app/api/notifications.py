from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser
from app.database import get_db
from app.models import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def notification_query(db: Session, user):
    if user.role == "SUPER_ADMIN":
        return db.query(Notification).filter(
            Notification.recipient_user_id == user.id
        )
    if user.role == "TENANT_ADMIN" and user.tenant_id is not None:
        return db.query(Notification).filter(
            or_(
                Notification.tenant_id == user.tenant_id,
                Notification.recipient_user_id == user.id,
            )
        )
    raise HTTPException(status.HTTP_403_FORBIDDEN, "Notification access required.")


def notification_response(notification: Notification) -> dict[str, object]:
    return {
        "id": notification.id,
        "type": notification.notification_type,
        "title": notification.title,
        "body": notification.body,
        "is_read": notification.read_at is not None,
        "created_at": notification.created_at,
    }


@router.get("")
def list_notifications(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    notifications = (
        notification_query(db, user)
        .order_by(Notification.created_at.desc())
        .limit(100)
        .all()
    )
    return {
        "items": [notification_response(item) for item in notifications],
        "unread": sum(item.read_at is None for item in notifications),
    }


@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    notification = notification_query(db, user).filter(
        Notification.id == notification_id
    ).first()
    if not notification:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found.")
    if notification.read_at is None:
        notification.read_at = datetime.utcnow()
        db.commit()
    return notification_response(notification)


@router.post("/read-all")
def mark_all_notifications_read(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    notifications = notification_query(db, user).filter(
        Notification.read_at.is_(None)
    ).all()
    now = datetime.utcnow()
    for notification in notifications:
        notification.read_at = now
    db.commit()
    return {"marked_read": len(notifications)}
