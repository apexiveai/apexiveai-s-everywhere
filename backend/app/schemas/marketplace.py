from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class MarketplaceProductCreate(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=4000)
    category: str = Field(default="General", min_length=2, max_length=80)
    price: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    currency: Literal["USD", "MMK"]
    stock: int = Field(ge=1, le=10000)

    @field_validator("name", "description", "category")
    @classmethod
    def strip_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("This field cannot be blank.")
        return normalized


class MarketplaceOrderItemCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=100)


class MarketplaceOrderCreate(BaseModel):
    items: list[MarketplaceOrderItemCreate] = Field(min_length=1, max_length=25)
    delivery_address: str = Field(min_length=5, max_length=1000)
    contact_phone: str = Field(min_length=7, max_length=40)
    buyer_note: str | None = Field(default=None, max_length=1000)

    @field_validator("delivery_address", "contact_phone", "buyer_note")
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if not normalized:
            raise ValueError("This field cannot be blank.")
        return normalized


class MarketplaceOrderStatusUpdate(BaseModel):
    status: Literal["CONFIRMED", "COMPLETED", "CANCELLED"]
