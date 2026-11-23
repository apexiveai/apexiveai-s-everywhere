
from datetime import datetime

from sqlalchemy import (
    BigInteger, Integer, String, Text, DateTime,
    Float, JSON, ForeignKeyConstraint, Index, func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaceTelemetry(Base):
    __tablename__ = "space_telemetry"

    __table_args__ = (
        ForeignKeyConstraint(
            ["satellite_id", "tenant_id"],
            ["space_satellites.id", "space_satellites.tenant_id"],
            ondelete="RESTRICT",
            name="fk_space_telemetry_satellite"
        ),
        Index(
            "ix_space_telemetry_satellite_time",
            "satellite_id", "observed_at"
        ),
        Index("ix_space_telemetry_tenant", "tenant_id"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)

    tenant_id: Mapped[int] = mapped_column(Integer, nullable=False)
    satellite_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    telemetry_type: Mapped[str] = mapped_column(String(100), nullable=False)

    observed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    received_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    numeric_value: Mapped[float | None] = mapped_column(Float)
    text_value: Mapped[str | None] = mapped_column(Text)

    unit: Mapped[str | None] = mapped_column(String(50))

    quality: Mapped[str] = mapped_column(
        String(30), nullable=False, default="UNKNOWN"
    )

    source: Mapped[str | None] = mapped_column(String(100))

    metadata_json: Mapped[dict] = mapped_column(
        "metadata", JSON, nullable=False, default=dict
    )
