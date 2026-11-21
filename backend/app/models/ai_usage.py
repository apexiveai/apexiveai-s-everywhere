
import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AIUsage(Base):
    __tablename__ = "ai_usage"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    conversation_id: Mapped[str | None] = mapped_column(
        ForeignKey(
            "ai_conversations.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    tenant_id: Mapped[int | None] = mapped_column(
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    provider: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    model: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
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

    estimated_cost: Mapped[float] = mapped_column(
        Numeric(12, 6),
        nullable=False,
        default=0,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="COMPLETED",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )
