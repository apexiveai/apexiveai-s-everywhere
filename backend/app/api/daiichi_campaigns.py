import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import SuperAdmin
from app.database import get_db
from app.models.daiichi_campaign import DaiichiCampaign, DaiichiCampaignAudit
from app.schemas.daiichi_campaigns import (
    CampaignApprovalUpdate,
    CampaignCreate,
    CampaignOut,
    CampaignStatusUpdate,
    CampaignUpdate,
)

public_router = APIRouter(prefix="/daiichi/campaigns", tags=["Daiichi Campaigns"])
admin_router = APIRouter(prefix="/admin/daiichi/campaigns", tags=["Admin - Daiichi Campaigns"])


def _now():
    return datetime.now(timezone.utc)


def _audit(db: Session, campaign_id: int, admin, action: str, details: dict | None = None):
    actor_id = getattr(admin, "id", None) if admin is not None else None
    db.add(
        DaiichiCampaignAudit(
            campaign_id=campaign_id,
            actor_user_id=actor_id,
            action=action,
            details=json.dumps(details or {}, ensure_ascii=False, default=str),
        )
    )


@public_router.get("", response_model=list[CampaignOut])
def list_public_campaigns(db: Session = Depends(get_db)):
    now = _now()
    return (
        db.query(DaiichiCampaign)
        .filter(
            DaiichiCampaign.approval_status == "APPROVED",
            DaiichiCampaign.status.in_(["PUBLISHED", "SCHEDULED"]),
            or_(DaiichiCampaign.starts_at.is_(None), DaiichiCampaign.starts_at <= now),
            or_(DaiichiCampaign.ends_at.is_(None), DaiichiCampaign.ends_at > now),
        )
        .order_by(DaiichiCampaign.starts_at.desc().nullslast(), DaiichiCampaign.created_at.desc())
        .all()
    )


@admin_router.get("", response_model=list[CampaignOut])
def list_campaigns(
    admin: SuperAdmin,
    status: str | None = Query(default=None, max_length=20),
    approval_status: str | None = Query(default=None, max_length=20),
    campaign_type: str | None = Query(default=None, max_length=20),
    search: str | None = Query(default=None, max_length=150),
    db: Session = Depends(get_db),
):
    query = db.query(DaiichiCampaign)
    if status:
        query = query.filter(DaiichiCampaign.status == status.upper())
    if approval_status:
        query = query.filter(DaiichiCampaign.approval_status == approval_status.upper())
    if campaign_type:
        query = query.filter(DaiichiCampaign.campaign_type == campaign_type.upper())
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                DaiichiCampaign.title.ilike(term),
                DaiichiCampaign.slug.ilike(term),
                DaiichiCampaign.summary.ilike(term),
            )
        )
    return query.order_by(DaiichiCampaign.updated_at.desc(), DaiichiCampaign.id.desc()).all()


@admin_router.post("", response_model=CampaignOut, status_code=201)
def create_campaign(payload: CampaignCreate, admin: SuperAdmin, db: Session = Depends(get_db)):
    if db.query(DaiichiCampaign).filter(DaiichiCampaign.slug == payload.slug).first():
        raise HTTPException(status_code=409, detail="Campaign slug already exists.")
    campaign = DaiichiCampaign(**payload.model_dump(), created_by=getattr(admin, "id", None))
    db.add(campaign)
    db.flush()
    _audit(db, campaign.id, admin, "CREATED", {"slug": campaign.slug})
    db.commit()
    db.refresh(campaign)
    return campaign


@admin_router.get("/{campaign_id}", response_model=CampaignOut)
def get_campaign(campaign_id: int, admin: SuperAdmin, db: Session = Depends(get_db)):
    campaign = db.query(DaiichiCampaign).filter(DaiichiCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found.")
    return campaign


@admin_router.patch("/{campaign_id}", response_model=CampaignOut)
def update_campaign(
    campaign_id: int,
    payload: CampaignUpdate,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    campaign = db.query(DaiichiCampaign).filter(DaiichiCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found.")
    changes = payload.model_dump(exclude_unset=True)
    if "slug" in changes:
        existing = db.query(DaiichiCampaign).filter(
            DaiichiCampaign.slug == changes["slug"], DaiichiCampaign.id != campaign_id
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="Campaign slug already exists.")
    for key, value in changes.items():
        setattr(campaign, key, value)
    if campaign.starts_at and campaign.ends_at and campaign.ends_at <= campaign.starts_at:
        raise HTTPException(status_code=422, detail="ends_at must be later than starts_at.")
    campaign.updated_at = _now()
    _audit(db, campaign.id, admin, "UPDATED", changes)
    db.commit()
    db.refresh(campaign)
    return campaign


@admin_router.patch("/{campaign_id}/approval", response_model=CampaignOut)
def update_campaign_approval(
    campaign_id: int,
    payload: CampaignApprovalUpdate,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    campaign = db.query(DaiichiCampaign).filter(DaiichiCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found.")
    campaign.approval_status = payload.approval_status
    campaign.approval_note = payload.approval_note
    campaign.approved_by = getattr(admin, "id", None) if payload.approval_status == "APPROVED" else None
    campaign.approved_at = _now() if payload.approval_status == "APPROVED" else None
    campaign.updated_at = _now()
    _audit(db, campaign.id, admin, "APPROVAL_" + payload.approval_status, {"note": payload.approval_note})
    db.commit()
    db.refresh(campaign)
    return campaign


@admin_router.patch("/{campaign_id}/status", response_model=CampaignOut)
def update_campaign_status(
    campaign_id: int,
    payload: CampaignStatusUpdate,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    campaign = db.query(DaiichiCampaign).filter(DaiichiCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found.")
    if payload.status in {"PUBLISHED", "SCHEDULED"} and campaign.approval_status != "APPROVED":
        raise HTTPException(status_code=409, detail="Partner approval is required before publication.")
    campaign.status = payload.status
    campaign.updated_at = _now()
    _audit(db, campaign.id, admin, "STATUS_" + payload.status)
    db.commit()
    db.refresh(campaign)
    return campaign


@admin_router.get("/{campaign_id}/audit")
def get_campaign_audit(campaign_id: int, admin: SuperAdmin, db: Session = Depends(get_db)):
    campaign = db.query(DaiichiCampaign.id).filter(DaiichiCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found.")
    rows = (
        db.query(DaiichiCampaignAudit)
        .filter(DaiichiCampaignAudit.campaign_id == campaign_id)
        .order_by(DaiichiCampaignAudit.created_at.desc(), DaiichiCampaignAudit.id.desc())
        .limit(100)
        .all()
    )
    return [
        {
            "id": row.id,
            "campaign_id": row.campaign_id,
            "actor_user_id": row.actor_user_id,
            "action": row.action,
            "details": row.details,
            "created_at": row.created_at,
        }
        for row in rows
    ]
