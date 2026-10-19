from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class InvoiceCreate(BaseModel):
    tenant_id: int
    invoice_type: Literal["SOFTWARE_LICENSE", "SUPPORT_MAINTENANCE"]
    currency: Literal["USD", "MMK"]
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    description: str = Field(min_length=3, max_length=2000)
    payment_instructions: str | None = Field(default=None, max_length=2000)
    plan_id: int | None = None
    solution_id: int | None = None
    duration_months: int | None = Field(default=None, ge=1, le=120)
    due_date: date | None = None


class InvoicePaymentReport(BaseModel):
    payment_reference: str = Field(min_length=3, max_length=255)
    payer_name: str = Field(min_length=2, max_length=255)
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    currency: Literal["USD", "MMK"]


class InvoiceReview(BaseModel):
    decision: Literal["PAID", "REJECTED"]
    review_note: str | None = Field(default=None, max_length=2000)

