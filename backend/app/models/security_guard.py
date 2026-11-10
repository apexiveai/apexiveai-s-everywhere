from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class SecurityGuardInquiry(Base):
    __tablename__ = "security_guard_inquiries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    organization: Mapped[str | None] = mapped_column(String(200), nullable=True)
    phone: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    email: Mapped[str | None] = mapped_column(String(254), nullable=True)
    guard_level: Mapped[str] = mapped_column(String(1), nullable=False)
    personnel_count: Mapped[int] = mapped_column(Integer, nullable=False)
    inquiry: Mapped[str | None] = mapped_column(Text, nullable=True)
    consent_given: Mapped[bool] = mapped_column(Boolean, nullable=False)
    consent_text_version: Mapped[str] = mapped_column(
        String(30), nullable=False, default="v1"
    )
    consent_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )


Index(
    "ix_security_guard_inquiries_created_id",
    SecurityGuardInquiry.created_at,
    SecurityGuardInquiry.id,
)
