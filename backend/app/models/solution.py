from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Solution(Base):
    __tablename__ = "solutions"

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

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    api_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    tenant_access = relationship(
        "TenantSolution",
        back_populates="solution",
        cascade="all, delete-orphan",
    )


class TenantSolution(Base):
    __tablename__ = "tenant_solutions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    solution_id: Mapped[int] = mapped_column(
        ForeignKey("solutions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    granted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    granted_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    granted_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    solution = relationship(
        "Solution",
        back_populates="tenant_access",
    )

    tenant = relationship(
        "Tenant",
        back_populates="solution_access",
    )