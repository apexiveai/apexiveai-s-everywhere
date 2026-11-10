
from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import SuperAdmin
from app.database import get_db
from app.models.daiichi import DaiichiAnalyticsEvent, DaiichiLead


router = APIRouter(prefix="/admin/daiichi", tags=["Admin - Daiichi Life"])

LeadStatus = Literal["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "REJECTED"]


class LeadStatusUpdate(BaseModel):
    status: LeadStatus
    admin_note: str | None = Field(default=None, max_length=3000)


class LeadItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    phone: str
    email: str | None
    inquiry: str | None
    consent_given: bool
    consent_text_version: str
    consent_at: datetime
    status: str
    admin_note: str | None
    source: str
    created_at: datetime
    updated_at: datetime


@router.get("/analytics")
def get_daiichi_analytics(
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    seven_days_ago = now - timedelta(days=7)

    total_leads = db.query(func.count(DaiichiLead.id)).scalar() or 0
    new_leads = (
        db.query(func.count(DaiichiLead.id))
        .filter(DaiichiLead.status == "NEW")
        .scalar()
        or 0
    )
    converted_leads = (
        db.query(func.count(DaiichiLead.id))
        .filter(DaiichiLead.status == "CONVERTED")
        .scalar()
        or 0
    )

    today_views = (
        db.query(func.count(DaiichiAnalyticsEvent.id))
        .filter(
            DaiichiAnalyticsEvent.event_type == "page_view",
            DaiichiAnalyticsEvent.created_at >= today_start,
        )
        .scalar()
        or 0
    )
    today_clicks = (
        db.query(func.count(DaiichiAnalyticsEvent.id))
        .filter(
            DaiichiAnalyticsEvent.event_type == "cta_click",
            DaiichiAnalyticsEvent.created_at >= today_start,
        )
        .scalar()
        or 0
    )
    weekly_views = (
        db.query(func.count(DaiichiAnalyticsEvent.id))
        .filter(
            DaiichiAnalyticsEvent.event_type == "page_view",
            DaiichiAnalyticsEvent.created_at >= seven_days_ago,
        )
        .scalar()
        or 0
    )
    weekly_clicks = (
        db.query(func.count(DaiichiAnalyticsEvent.id))
        .filter(
            DaiichiAnalyticsEvent.event_type == "cta_click",
            DaiichiAnalyticsEvent.created_at >= seven_days_ago,
        )
        .scalar()
        or 0
    )

    conversion_rate = (
        round((converted_leads / total_leads) * 100, 2)
        if total_leads
        else 0.0
    )

    status_counts = {}
    for item_status in (
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "CONVERTED",
        "REJECTED",
    ):
        status_counts[item_status] = (
            db.query(func.count(DaiichiLead.id))
            .filter(DaiichiLead.status == item_status)
            .scalar()
            or 0
        )

    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "converted_leads": converted_leads,
        "conversion_rate": conversion_rate,
        "today_page_views": today_views,
        "today_cta_clicks": today_clicks,
        "weekly_page_views": weekly_views,
        "weekly_cta_clicks": weekly_clicks,
        "status_counts": status_counts,
    }


@router.get("/leads")
def list_daiichi_leads(
    admin: SuperAdmin,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status_filter: LeadStatus | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None, max_length=150),
    db: Session = Depends(get_db),
):
    query = db.query(DaiichiLead)

    if status_filter:
        query = query.filter(DaiichiLead.status == status_filter)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (DaiichiLead.full_name.ilike(term))
            | (DaiichiLead.phone.ilike(term))
            | (DaiichiLead.email.ilike(term))
        )

    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total else 0

    items = (
        query.order_by(DaiichiLead.created_at.desc(), DaiichiLead.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": [LeadItem.model_validate(item) for item in items],
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
    }


@router.get("/leads/{lead_id}", response_model=LeadItem)
def get_daiichi_lead(
    lead_id: int,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    lead = db.query(DaiichiLead).filter(DaiichiLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")
    return lead


@router.patch("/leads/{lead_id}/status", response_model=LeadItem)
def update_daiichi_lead_status(
    lead_id: int,
    payload: LeadStatusUpdate,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    lead = db.query(DaiichiLead).filter(DaiichiLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")

    lead.status = payload.status
    lead.admin_note = payload.admin_note
    lead.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(lead)
    return lead
