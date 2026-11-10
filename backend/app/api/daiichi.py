
import re
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.daiichi import DaiichiAnalyticsEvent, DaiichiLead


router = APIRouter(prefix="/daiichi", tags=["Daiichi Life"])


class DaiichiLeadCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: str = Field(min_length=2, max_length=150)
    phone: str = Field(min_length=6, max_length=40)
    email: str | None = Field(default=None, max_length=254)
    inquiry: str | None = Field(default=None, max_length=3000)
    consent_given: bool
    consent_text_version: str = Field(default="v1", max_length=30)
    website: str | None = Field(default=None, max_length=200)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        cleaned = re.sub(r"[\s()+.-]", "", value)
        if not re.fullmatch(r"[0-9]{6,20}", cleaned):
            raise ValueError("Please enter a valid phone number.")
        return value

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if len(value.strip()) < 2:
            raise ValueError("Please enter your name.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Please enter a valid email address.")
        return value.lower()


class DaiichiLeadCreated(BaseModel):
    id: int
    message: str


class DaiichiEventCreate(BaseModel):
    event_type: Literal["page_view", "cta_click"]
    campaign_key: str = Field(default="main", min_length=1, max_length=80)
    page_path: str = Field(
        default="/partners/daiichi", min_length=1, max_length=250
    )


@router.post(
    "/leads",
    response_model=DaiichiLeadCreated,
    status_code=status.HTTP_201_CREATED,
)
def create_daiichi_lead(
    payload: DaiichiLeadCreate,
    db: Session = Depends(get_db),
):
    if payload.website:
        return DaiichiLeadCreated(
            id=0,
            message="Thank you. Your inquiry has been received.",
        )

    if not payload.consent_given:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent is required before submitting this inquiry.",
        )

    lead = DaiichiLead(
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        inquiry=payload.inquiry,
        consent_given=True,
        consent_text_version=payload.consent_text_version,
        consent_at=datetime.now(timezone.utc),
        status="NEW",
        source="daiichi_partner_page",
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return DaiichiLeadCreated(
        id=lead.id,
        message="Thank you. Your inquiry has been received.",
    )


@router.post("/events", status_code=status.HTTP_202_ACCEPTED)
def create_daiichi_event(
    payload: DaiichiEventCreate,
    db: Session = Depends(get_db),
):
    event = DaiichiAnalyticsEvent(
        event_type=payload.event_type,
        campaign_key=payload.campaign_key,
        page_path=payload.page_path,
    )
    db.add(event)
    db.commit()

    return {"accepted": True}
