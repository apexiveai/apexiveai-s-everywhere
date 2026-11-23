
from datetime import datetime

from sqlalchemy import (
    BigInteger, Integer, String, DateTime, JSON,
    ForeignKey, Index, func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaceAuditLog(Base):
    __tablename__ = "space_audit_logs"

    __table_args__ = (
        Index(
            "ix_space_audit_tenant_time",
            "tenant_id", "created_at"
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(100))

    ip_address: Mapped[str | None] = mapped_column(String(64))

    details: Mapped[dict] = mapped_column(
        JSON, nullable=False, default=dict
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
