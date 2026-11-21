
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


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    tenant_id: Mapped[int | None] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    public_session_hash: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="New conversation",
    )

    provider: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="cloud",
    )

    model: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    __table_args__ = (
        Index(
            "ix_ai_conversations_tenant_updated",
            "tenant_id",
            "updated_at",
        ),
    )
