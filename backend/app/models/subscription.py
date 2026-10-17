from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    code: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    billing_cycle: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    price_mmk: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    minimum_months: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    is_active: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    subscriptions = relationship(
        "Subscription",
        back_populates="plan",
    )


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    plan_id: Mapped[int] = mapped_column(
        ForeignKey("subscription_plans.id"),
        nullable=False,
    )

    start_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    end_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="ACTIVE",
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    tenant = relationship(
        "Tenant",
        back_populates="subscriptions",
    )

    plan = relationship(
        "SubscriptionPlan",
        back_populates="subscriptions",
    )