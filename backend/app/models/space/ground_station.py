
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger, Integer, String, Text, DateTime, Numeric,
    JSON, ForeignKeyConstraint, UniqueConstraint, Index, func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaceGroundStation(Base):
    __tablename__ = "space_ground_stations"

    __table_args__ = (
        ForeignKeyConstraint(
            ["organization_id", "tenant_id"],
            ["space_organizations.id", "space_organizations.tenant_id"],
            ondelete="RESTRICT",
            name="fk_space_station_org_tenant"
        ),
        UniqueConstraint(
            "tenant_id", "station_code",
            name="uq_space_station_tenant_code"
        ),
        UniqueConstraint(
            "id", "tenant_id",
            name="uq_space_station_id_tenant"
        ),
        Index("ix_space_station_tenant", "tenant_id"),
        Index("ix_space_station_org", "organization_id"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(Integer, nullable=False)
    organization_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    station_code: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    country: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(150))

    latitude: Mapped[Decimal | None] = mapped_column(Numeric(10, 7))
    longitude: Mapped[Decimal | None] = mapped_column(Numeric(10, 7))
    altitude_meters: Mapped[Decimal | None] = mapped_column(Numeric(12, 3))

    antenna_type: Mapped[str | None] = mapped_column(String(100))
    antenna_diameter_meters: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))

    frequency_bands: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

    operational_status: Mapped[str] = mapped_column(
        String(40), nullable=False, default="PLANNED"
    )

    contact_email: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)

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
