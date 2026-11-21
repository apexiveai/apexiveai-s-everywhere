
import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AIMessageRecord(Base):
    __tablename__ = "ai_messages"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    conversation_id: Mapped[str] = mapped_column(
        ForeignKey(
            "ai_conversations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    provider: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    model: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    prompt_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    completion_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    __table_args__ = (
        Index(
            "ix_ai_messages_conversation_created",
            "conversation_id",
            "created_at",
        ),
    )
