from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class License(Base):
    __tablename__ = "licenses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    license_key: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    license_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="SUBSCRIPTION",
    )

    issued_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    max_users: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=5,
    )

    max_devices: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=5,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    tenant = relationship(
        "Tenant",
        back_populates="licenses",
    )