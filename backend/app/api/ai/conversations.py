
import uuid

from fastapi import APIRouter, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models import AIConversation, AIMessageRecord, User
from app.schemas.ai import (
    ConversationCreate,
    ConversationDetailResponse,
    ConversationResponse,
    MessageResponse,
    PublicConversationResponse,
)
from app.services.ai.access import OptionalAIUser
from app.services.ai.providers.factory import get_ai_provider
from app.services.ai.security import (
    create_public_session_token,
    hash_public_session,
    verify_conversation_access,
)
from fastapi import Depends

router = APIRouter(
    prefix="/ai/conversations",
    tags=["AI Conversations"],
)


def get_model(provider: str) -> str:
    if provider == "cloud":
        return settings.AI_CLOUD_MODEL
    return settings.AI_LOCAL_MODEL


@router.post("", response_model=None)
def create_conversation(
    data: ConversationCreate,
    user: OptionalAIUser,
    db: Session = Depends(get_db),
):
    if not settings.AI_ENABLED:
        raise HTTPException(503, "AI service is disabled.")

    if user is None and not settings.AI_PUBLIC_ACCESS_ENABLED:
        raise HTTPException(403, "Public AI access is disabled.")

    if user is not None and not settings.AI_TENANT_ACCESS_ENABLED:
        raise HTTPException(403, "Authenticated AI access is disabled.")

    if user is not None and user.role != "SUPER_ADMIN" and user.tenant_id is None:
        raise HTTPException(403, "Tenant account required.")

    try:
        provider = get_ai_provider(data.provider)
    except ValueError as exc:
        raise HTTPException(503, str(exc))

    model = get_model(data.provider)

    if not model:
        raise HTTPException(
            503,
            "The selected AI model is not configured.",
        )

    public_token = None

    conversation = AIConversation(
        id=str(uuid.uuid4()),
        user_id=user.id if user else None,
        tenant_id=user.tenant_id if user else None,
        public_session_hash=None,
        title="New conversation",
        provider=data.provider,
        model=model,
        status="ACTIVE",
    )

    if user is None:
        public_token = create_public_session_token()
        conversation.public_session_hash = hash_public_session(
            public_token
        )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    result = ConversationResponse.model_validate(
        conversation,
        from_attributes=True,
    )

    if public_token:
        return PublicConversationResponse(
            **result.model_dump(),
            session_token=public_token,
        )

    return result


@router.get("", response_model=list[ConversationResponse])
def list_conversations(
    user: OptionalAIUser,
    db: Session = Depends(get_db),
):
    if user is None:
        raise HTTPException(
            401,
            "Login required to list conversations.",
        )

    query = select(AIConversation).where(
        AIConversation.user_id == user.id,
        AIConversation.tenant_id == user.tenant_id,
        AIConversation.status == "ACTIVE",
    ).order_by(AIConversation.updated_at.desc()).limit(100)

    return db.scalars(query).all()


@router.get("/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(
    conversation_id: str,
    user: OptionalAIUser,
    db: Session = Depends(get_db),
    x_ai_session: str | None = Header(default=None),
):
    conversation = verify_conversation_access(
        db,
        conversation_id,
        user,
        x_ai_session,
    )

    messages = db.scalars(
        select(AIMessageRecord)
        .where(
            AIMessageRecord.conversation_id == conversation.id
        )
        .order_by(AIMessageRecord.created_at.asc())
        .limit(500)
    ).all()

    return ConversationDetailResponse(
        conversation=ConversationResponse.model_validate(
            conversation,
            from_attributes=True,
        ),
        messages=[
            MessageResponse.model_validate(
                message,
                from_attributes=True,
            )
            for message in messages
        ],
    )


@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    user: OptionalAIUser,
    db: Session = Depends(get_db),
    x_ai_session: str | None = Header(default=None),
):
    conversation = verify_conversation_access(
        db,
        conversation_id,
        user,
        x_ai_session,
    )

    conversation.status = "DELETED"
    db.commit()

    return {"success": True}
