from datetime import datetime, timezone

from sqlalchemy import DateTime, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class DaiichiCampaign(Base):
    __tablename__ = "daiichi_campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    campaign_type: Mapped[str] = mapped_column(String(20), nullable=False, default="DAILY", index=True)
    image_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    cta_label: Mapped[str] = mapped_column(String(80), nullable=False, default="Request Information")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="DRAFT", index=True)
    approval_status: Mapped[str] = mapped_column(String(20), nullable=False, default="PENDING", index=True)
    approval_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    created_by: Mapped[int | None] = mapped_column(Integer, nullable=True)
    approved_by: Mapped[int | None] = mapped_column(Integer, nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)


class DaiichiCampaignAudit(Base):
    __tablename__ = "daiichi_campaign_audits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    campaign_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    actor_user_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    action: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now)


Index("ix_daiichi_campaign_publication", DaiichiCampaign.status, DaiichiCampaign.approval_status, DaiichiCampaign.starts_at, DaiichiCampaign.ends_at)
Index("ix_daiichi_campaign_audit_created", DaiichiCampaignAudit.campaign_id, DaiichiCampaignAudit.created_at)
