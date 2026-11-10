
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class DaiichiLead(Base):
    __tablename__ = "daiichi_leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    email: Mapped[str | None] = mapped_column(String(254), nullable=True)
    inquiry: Mapped[str | None] = mapped_column(Text, nullable=True)

    consent_given: Mapped[bool] = mapped_column(Boolean, nullable=False)
    consent_text_version: Mapped[str] = mapped_column(
        String(30), nullable=False, default="v1"
    )
    consent_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="NEW", index=True
    )
    admin_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(
        String(80), nullable=False, default="daiichi_partner_page"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )


class DaiichiLeadStatusHistory(Base):
    __tablename__ = "daiichi_lead_status_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lead_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    actor_user_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    from_status: Mapped[str] = mapped_column(String(20), nullable=False)
    to_status: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )


class DaiichiAnalyticsEvent(Base):
    __tablename__ = "daiichi_analytics_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    event_type: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    campaign_key: Mapped[str] = mapped_column(
        String(80), nullable=False, default="main"
    )
    page_path: Mapped[str] = mapped_column(
        String(250), nullable=False, default="/partners/daiichi"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )


Index("ix_daiichi_leads_created_status", DaiichiLead.created_at, DaiichiLead.status)
Index(
    "ix_daiichi_events_type_created",
    DaiichiAnalyticsEvent.event_type,
    DaiichiAnalyticsEvent.created_at,
)
