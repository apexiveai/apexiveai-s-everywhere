from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


CampaignType = Literal["DAILY", "WEEKLY"]
CampaignStatus = Literal["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]
ApprovalStatus = Literal["PENDING", "APPROVED", "REJECTED"]


class CampaignCreate(BaseModel):
    slug: str = Field(min_length=3, max_length=120, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str = Field(min_length=3, max_length=200)
    summary: str = Field(default="", max_length=500)
    description: str = Field(default="", max_length=10000)
    campaign_type: CampaignType = "DAILY"
    image_url: str | None = Field(default=None, max_length=1000)
    cta_label: str = Field(default="Request Information", min_length=2, max_length=80)
    starts_at: datetime | None = None
    ends_at: datetime | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.starts_at and self.ends_at and self.ends_at <= self.starts_at:
            raise ValueError("ends_at must be later than starts_at")
        return self


class CampaignUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=3, max_length=120, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str | None = Field(default=None, min_length=3, max_length=200)
    summary: str | None = Field(default=None, max_length=500)
    description: str | None = Field(default=None, max_length=10000)
    campaign_type: CampaignType | None = None
    image_url: str | None = Field(default=None, max_length=1000)
    cta_label: str | None = Field(default=None, min_length=2, max_length=80)
    starts_at: datetime | None = None
    ends_at: datetime | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.starts_at and self.ends_at and self.ends_at <= self.starts_at:
            raise ValueError("ends_at must be later than starts_at")
        return self


class CampaignStatusUpdate(BaseModel):
    status: CampaignStatus


class CampaignApprovalUpdate(BaseModel):
    approval_status: Literal["APPROVED", "REJECTED"]
    approval_note: str | None = Field(default=None, max_length=3000)


class CampaignOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    summary: str
    description: str
    campaign_type: str
    image_url: str | None
    cta_label: str
    status: str
    approval_status: str
    approval_note: str | None
    starts_at: datetime | None
    ends_at: datetime | None
    created_at: datetime
    updated_at: datetime
    approved_at: datetime | None
