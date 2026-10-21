from datetime import datetime, timezone
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class AuctionCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=4000)
    starting_price: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    currency: Literal["USD", "MMK"]
    ends_at: datetime

    @field_validator("title", "description")
    @classmethod
    def strip_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("This field cannot be blank.")
        return normalized

    @field_validator("ends_at")
    @classmethod
    def normalize_end_time(cls, value: datetime) -> datetime:
        if value.tzinfo is not None:
            return value.astimezone(timezone.utc).replace(tzinfo=None)
        return value


class AuctionBidCreate(BaseModel):
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
