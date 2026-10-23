from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MarketplaceProduct(Base):
    __tablename__ = "marketplace_products"
    __table_args__ = (
        CheckConstraint("price > 0", name="ck_marketplace_products_price"),
        CheckConstraint("stock >= 0", name="ck_marketplace_products_stock"),
        CheckConstraint(
            "currency IN ('USD', 'MMK')", name="ck_marketplace_products_currency"
        ),
        Index("ix_marketplace_products_active_created", "is_active", "created_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    seller_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False, default="General")
    price: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    seller = relationship("User")


class MarketplaceOrder(Base):
    __tablename__ = "marketplace_orders"
    __table_args__ = (
        CheckConstraint(
            "status IN ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')",
            name="ck_marketplace_orders_status",
        ),
        Index("ix_marketplace_orders_buyer_created", "buyer_id", "created_at"),
        Index("ix_marketplace_orders_seller_created", "seller_id", "created_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    buyer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    seller_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    delivery_address: Mapped[str] = mapped_column(Text, nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(40), nullable=False)
    buyer_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="REQUESTED"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
    items: Mapped[list["MarketplaceOrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )


class MarketplaceOrderItem(Base):
    __tablename__ = "marketplace_order_items"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_marketplace_order_items_quantity"),
        CheckConstraint("unit_price > 0", name="ck_marketplace_order_items_unit_price"),
        CheckConstraint(
            "currency IN ('USD', 'MMK')", name="ck_marketplace_order_items_currency"
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("marketplace_orders.id", ondelete="CASCADE"), nullable=False
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey("marketplace_products.id", ondelete="RESTRICT"), nullable=False
    )
    product_name: Mapped[str] = mapped_column(String(120), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)

    order = relationship("MarketplaceOrder", back_populates="items")
