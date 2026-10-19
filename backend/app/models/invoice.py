from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    invoice_number: Mapped[str] = mapped_column(
        String(40), unique=True, nullable=False, index=True
    )
    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    invoice_type: Mapped[str] = mapped_column(String(40), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    payment_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    plan_id: Mapped[int | None] = mapped_column(
        ForeignKey("subscription_plans.id"), nullable=True
    )
    solution_id: Mapped[int | None] = mapped_column(
        ForeignKey("solutions.id"), nullable=True
    )
    duration_months: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(
        String(30), default="ISSUED", nullable=False, index=True
    )
    due_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    payment_reference: Mapped[str | None] = mapped_column(
        String(255), nullable=True, unique=True
    )
    payer_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    amount_reported: Mapped[Decimal | None] = mapped_column(
        Numeric(14, 2), nullable=True
    )
    currency_reported: Mapped[str | None] = mapped_column(String(3), nullable=True)
    payment_reported_at: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True
    )
    review_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    verified_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    tenant = relationship("Tenant")
    plan = relationship("SubscriptionPlan")
    solution = relationship("Solution")
