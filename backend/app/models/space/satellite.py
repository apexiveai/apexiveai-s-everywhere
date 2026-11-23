
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger, Integer, String, Date, DateTime,
    Numeric, Text, JSON, ForeignKeyConstraint,
    UniqueConstraint, Index, func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaceSatellite(Base):
    __tablename__ = "space_satellites"

    __table_args__ = (
        ForeignKeyConstraint(
            ["organization_id", "tenant_id"],
            ["space_organizations.id", "space_organizations.tenant_id"],
            ondelete="RESTRICT",
            name="fk_space_satellite_org_tenant"
        ),
        UniqueConstraint(
            "tenant_id", "satellite_code",
            name="uq_space_satellite_tenant_code"
        ),
        UniqueConstraint(
            "id", "tenant_id",
            name="uq_space_satellite_id_tenant"
        ),
        Index("ix_space_satellite_tenant", "tenant_id"),
        Index("ix_space_satellite_org", "organization_id"),
        Index("ix_space_satellite_status", "operational_status"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(Integer, nullable=False)
    organization_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    satellite_code: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    international_designator: Mapped[str | None] = mapped_column(String(100))
    norad_catalog_id: Mapped[int | None] = mapped_column(Integer)

    satellite_type: Mapped[str | None] = mapped_column(String(80))
    manufacturer: Mapped[str | None] = mapped_column(String(255))

    launch_date: Mapped[date | None] = mapped_column(Date)
    launch_vehicle: Mapped[str | None] = mapped_column(String(255))
    launch_site: Mapped[str | None] = mapped_column(String(255))

    orbit_type: Mapped[str | None] = mapped_column(String(50))
    orbit_altitude_km: Mapped[Decimal | None] = mapped_column(Numeric(12, 3))
    orbit_inclination_deg: Mapped[Decimal | None] = mapped_column(Numeric(9, 5))
    orbital_period_minutes: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))

    operational_status: Mapped[str] = mapped_column(
        String(40), nullable=False, default="PLANNED"
    )

    mission_description: Mapped[str | None] = mapped_column(Text)
    metadata_json: Mapped[dict] = mapped_column(
        "metadata", JSON, nullable=False, default=dict
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
        onupdate=func.now(), nullable=False
    )
