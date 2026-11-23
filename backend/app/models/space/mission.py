
from datetime import datetime

from sqlalchemy import (
    BigInteger, Integer, String, Text, DateTime, JSON,
    ForeignKeyConstraint, UniqueConstraint, Index, func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaceMission(Base):
    __tablename__ = "space_missions"

    __table_args__ = (
        ForeignKeyConstraint(
            ["organization_id", "tenant_id"],
            ["space_organizations.id", "space_organizations.tenant_id"],
            ondelete="RESTRICT",
            name="fk_space_mission_org_tenant"
        ),
        UniqueConstraint(
            "tenant_id", "mission_code",
            name="uq_space_mission_tenant_code"
        ),
        UniqueConstraint(
            "id", "tenant_id",
            name="uq_space_mission_id_tenant"
        ),
        Index("ix_space_mission_tenant", "tenant_id"),
        Index("ix_space_mission_org", "organization_id"),
        Index("ix_space_mission_status", "status"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(Integer, nullable=False)
    organization_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    mission_code: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    mission_type: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    objective: Mapped[str | None] = mapped_column(Text)

    priority: Mapped[str] = mapped_column(
        String(30), nullable=False, default="NORMAL"
    )
    status: Mapped[str] = mapped_column(
        String(40), nullable=False, default="DRAFT"
    )

    planned_start_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    planned_end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    actual_start_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    actual_end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

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


class SpaceMissionSatellite(Base):
    __tablename__ = "space_mission_satellites"

    __table_args__ = (
        ForeignKeyConstraint(
            ["mission_id", "tenant_id"],
            ["space_missions.id", "space_missions.tenant_id"],
            ondelete="CASCADE",
        ),
        ForeignKeyConstraint(
            ["satellite_id", "tenant_id"],
            ["space_satellites.id", "space_satellites.tenant_id"],
            ondelete="RESTRICT",
        ),
        UniqueConstraint(
            "mission_id", "satellite_id",
            name="uq_space_mission_satellite"
        ),
        Index("ix_space_assignment_tenant", "tenant_id"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(Integer, nullable=False)
    mission_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    satellite_id: Mapped[int] = mapped_column(BigInteger, nullable=False)

    assignment_role: Mapped[str] = mapped_column(
        String(100), nullable=False, default="PRIMARY"
    )
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class SpaceMissionSchedule(Base):
    __tablename__ = "space_mission_schedules"

    __table_args__ = (
        ForeignKeyConstraint(
            ["mission_id", "tenant_id"],
            ["space_missions.id", "space_missions.tenant_id"],
            ondelete="CASCADE",
        ),
        ForeignKeyConstraint(
            ["ground_station_id", "tenant_id"],
            ["space_ground_stations.id", "space_ground_stations.tenant_id"],
            ondelete="RESTRICT",
        ),
        UniqueConstraint(
            "tenant_id", "schedule_code",
            name="uq_space_schedule_code"
        ),
        Index("ix_space_schedule_mission", "mission_id"),
        Index("ix_space_schedule_tenant_time", "tenant_id", "scheduled_start_at"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(Integer, nullable=False)
    mission_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    ground_station_id: Mapped[int | None] = mapped_column(BigInteger)

    schedule_code: Mapped[str] = mapped_column(String(100), nullable=False)

    scheduled_start_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    scheduled_end_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    schedule_status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="PLANNED"
    )
    notes: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
