import re
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.security_guard import SecurityGuardInquiry


router = APIRouter(prefix="/security-guards", tags=["Security Guard Services"])


class SecurityGuardInquiryCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: str = Field(min_length=2, max_length=150)
    organization: str | None = Field(default=None, max_length=200)
    phone: str = Field(min_length=6, max_length=40)
    email: str | None = Field(default=None, max_length=254)
    guard_level: Literal["A", "B", "C", "D", "E", "F"]
    personnel_count: int = Field(ge=1, le=500)
    inquiry: str | None = Field(default=None, max_length=3000)
    consent_given: bool
    website: str | None = Field(default=None, max_length=200)

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if len(value.strip()) < 2:
            raise ValueError("Please enter your name.")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        cleaned = re.sub(r"[\s()+.-]", "", value)
        if not re.fullmatch(r"[0-9]{6,20}", cleaned):
            raise ValueError("Please enter a valid phone number.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Please enter a valid email address.")
        return value.lower()


class SecurityGuardInquiryCreated(BaseModel):
    id: int
    message: str


@router.post(
    "/inquiries",
    response_model=SecurityGuardInquiryCreated,
    status_code=status.HTTP_201_CREATED,
)
def create_security_guard_inquiry(
    payload: SecurityGuardInquiryCreate,
    db: Session = Depends(get_db),
) -> SecurityGuardInquiryCreated:
    if payload.website:
        return SecurityGuardInquiryCreated(
            id=0,
            message="Thank you. Your service inquiry has been received.",
        )

    if not payload.consent_given:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consent is required before submitting this inquiry.",
        )

    inquiry = SecurityGuardInquiry(
        full_name=payload.full_name,
        organization=payload.organization,
        phone=payload.phone,
        email=payload.email,
        guard_level=payload.guard_level,
        personnel_count=payload.personnel_count,
        inquiry=payload.inquiry,
        consent_given=True,
        consent_text_version="v1",
        consent_at=datetime.now(timezone.utc),
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    return SecurityGuardInquiryCreated(
        id=inquiry.id,
        message="Thank you. Your service inquiry has been received.",
    )
