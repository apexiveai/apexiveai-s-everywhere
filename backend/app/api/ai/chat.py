
import json
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models import (
    AIConversation,
    AIMessageRecord,
    AIUsage,
)
from app.schemas.ai import ChatRequest
from app.services.ai.access import OptionalAIUser
from app.services.ai.providers.base import (
    AIMessage,
    AIProviderError,
    AIRequest,
)
from app.services.ai.providers.factory import get_ai_provider
from app.services.ai.security import verify_conversation_access

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/ai",
    tags=["AI Chat"],
)


def sse_event(event: str, data: dict) -> str:
    return (
        f"event: {event}\n"
        f"data: {json.dumps(data, ensure_ascii=False)}\n\n"
    )


@router.post("/chat/{conversation_id}")
async def chat(
    conversation_id: str,
    data: ChatRequest,
    user: OptionalAIUser,
    db: Session = Depends(get_db),
    x_ai_session: str | None = Header(default=None),
):
    if not settings.AI_ENABLED:
        raise HTTPException(503, "AI service is disabled.")

    message = data.message.strip()

    if not message:
        raise HTTPException(422, "Message cannot be empty.")

    if len(message) > settings.AI_MAX_MESSAGE_LENGTH:
        raise HTTPException(413, "Message is too long.")

    conversation = verify_conversation_access(
        db,
        conversation_id,
        user,
        x_ai_session,
    )

    provider_name = conversation.provider

    try:
        provider = get_ai_provider(provider_name)
    except ValueError:
        raise HTTPException(503, "AI provider is unavailable.")

    previous_messages = db.scalars(
        select(AIMessageRecord)
        .where(
            AIMessageRecord.conversation_id == conversation.id
        )
        .order_by(AIMessageRecord.created_at.desc())
        .limit(settings.AI_MAX_HISTORY_MESSAGES)
    ).all()

    history = [
        AIMessage(
            role=item.role,
            content=item.content,
        )
        for item in reversed(previous_messages)
        if item.role in {"user", "assistant"}
    ]

    history.append(
        AIMessage(
            role="user",
            content=message,
        )
    )

    user_message = AIMessageRecord(
        conversation_id=conversation.id,
        role="user",
        content=message,
    )

    db.add(user_message)

    if conversation.title == "New conversation":
        conversation.title = message[:80]

    conversation.updated_at = datetime.utcnow()

    db.commit()

    request = AIRequest(
        messages=[
            AIMessage(
                role="system",
                content=(
                    "You are ApexiveAI Intelligence, an enterprise AI "
                    "assistant. Be accurate, useful and professional. "
                    "Support Burmese and English. Do not invent facts, "
                    "sources, tool results or completed actions. "
                    "Clearly state limitations when you cannot verify "
                    "something. Protect user and tenant data."
                ),
            ),
            *history,
        ],
        model=conversation.model,
        temperature=settings.AI_TEMPERATURE,
        max_tokens=settings.AI_MAX_TOKENS,
    )

    async def generate():
        full_response = ""

        try:
            yield sse_event(
                "start",
                {
                    "conversation_id": conversation.id,
                    "provider": provider_name,
                    "model": conversation.model,
                },
            )

            async for chunk in provider.stream(request):
                full_response += chunk

                yield sse_event(
                    "token",
                    {"content": chunk},
                )

            if not full_response.strip():
                raise AIProviderError(
                    "The provider returned an empty response."
                )

            assistant_message = AIMessageRecord(
                conversation_id=conversation.id,
                role="assistant",
                content=full_response,
                provider=provider_name,
                model=conversation.model,
            )

            db.add(assistant_message)

            db.add(
                AIUsage(
                    conversation_id=conversation.id,
                    user_id=conversation.user_id,
                    tenant_id=conversation.tenant_id,
                    provider=provider_name,
                    model=conversation.model,
                    prompt_tokens=0,
                    completion_tokens=0,
                    estimated_cost=0,
                    status="COMPLETED",
                )
            )

            conversation.updated_at = datetime.utcnow()

            db.commit()

            yield sse_event(
                "done",
                {
                    "conversation_id": conversation.id,
                    "message": "Response completed.",
                },
            )

        except Exception as exc:
            db.rollback()
            logger.exception("AI generation failed")


            yield sse_event(
                "error",
                {
                    "message": (
                        "AI generation failed. Please try again."
                    )
                },
            )


        finally:
            await provider.close()

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
