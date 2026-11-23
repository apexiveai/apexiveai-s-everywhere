
from datetime import datetime

from sqlalchemy import (
    BigInteger, DateTime, ForeignKey, String, Text,
    UniqueConstraint, Index, func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaceOrganization(Base):
    __tablename__ = "space_organizations"

    __table_args__ = (
        UniqueConstraint(
            "id", "tenant_id",
            name="uq_space_org_id_tenant"
        ),
        UniqueConstraint(
            "tenant_id", "organization_code",
            name="uq_space_org_tenant_code"
        ),
        Index("ix_space_org_tenant", "tenant_id"),
        Index("ix_space_org_status", "status"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )

    organization_code: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    organization_type: Mapped[str] = mapped_column(
        String(50), nullable=False, default="PRIVATE"
    )

    country: Mapped[str | None] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)

    contact_email: Mapped[str | None] = mapped_column(String(255))
    contact_phone: Mapped[str | None] = mapped_column(String(100))

    status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="ACTIVE"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
