
import hashlib
import hmac
import secrets

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import AIConversation, User


def create_public_session_token() -> str:
    return secrets.token_urlsafe(48)


def hash_public_session(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def verify_conversation_access(
    db: Session,
    conversation_id: str,
    user: User | None,
    public_token: str | None,
) -> AIConversation:

    conversation = db.get(
        AIConversation,
        conversation_id,
    )

    if not conversation or conversation.status != "ACTIVE":
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    if user is not None:
        if conversation.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="Conversation access denied.",
            )

        if conversation.tenant_id != user.tenant_id:
            raise HTTPException(
                status_code=403,
                detail="Tenant access denied.",
            )

        return conversation

    if not settings.AI_PUBLIC_ACCESS_ENABLED:
        raise HTTPException(
            status_code=403,
            detail="Public AI access is disabled.",
        )

    if not public_token or not conversation.public_session_hash:
        raise HTTPException(
            status_code=401,
            detail="Valid AI session token required.",
        )

    supplied_hash = hash_public_session(public_token)

    if not hmac.compare_digest(
        supplied_hash,
        conversation.public_session_hash,
    ):
        raise HTTPException(
            status_code=403,
            detail="Invalid AI session.",
        )

    return conversation
