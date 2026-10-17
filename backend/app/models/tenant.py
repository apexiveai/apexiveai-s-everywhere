from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
class Tenant(Base):
    __tablename__ = "tenants"
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )
    company_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    tenant_code: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="ACTIVE",
        nullable=False,
    )
    contact_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    contact_email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    contact_phone: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
    users = relationship(
        "User",
        back_populates="tenant",
        cascade="all, delete-orphan",
    )
    subscriptions = relationship(
        "Subscription",
        back_populates="tenant",
        cascade="all, delete-orphan",
    )
    licenses = relationship(
        "License",
        back_populates="tenant",
        cascade="all, delete-orphan",
    )
    solution_access = relationship(
        "TenantSolution",
        back_populates="tenant",
        cascade="all, delete-orphan",
    )