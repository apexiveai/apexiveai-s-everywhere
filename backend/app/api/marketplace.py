from collections import defaultdict
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.api.deps import CurrentUser
from app.database import get_db
from app.models import (
    MarketplaceOrder,
    MarketplaceOrderItem,
    MarketplaceProduct,
    User,
)
from app.schemas.marketplace import (
    MarketplaceOrderCreate,
    MarketplaceOrderStatusUpdate,
    MarketplaceProductCreate,
)

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])
MARKETPLACE_ROLES = {"TENANT_ADMIN", "SELLER", "BUYER"}
SELLER_ROLES = {"TENANT_ADMIN", "SELLER"}


def require_marketplace_member(user: CurrentUser) -> None:
    if user.role not in MARKETPLACE_ROLES or user.tenant_id is None:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "An active marketplace account is required.",
        )


def product_response(product: MarketplaceProduct, seller_name: str) -> dict[str, object]:
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "category": product.category,
        "price": str(product.price),
        "currency": product.currency,
        "stock": product.stock,
        "seller_id": product.seller_id,
        "seller_name": seller_name,
        "created_at": product.created_at.isoformat(),
    }


def order_response(order: MarketplaceOrder) -> dict[str, object]:
    total = sum(
        (item.unit_price * item.quantity for item in order.items),
        start=Decimal("0.00"),
    )
    return {
        "id": order.id,
        "buyer_id": order.buyer_id,
        "buyer_name": order.buyer.username,
        "seller_id": order.seller_id,
        "seller_name": order.seller.username,
        "delivery_address": order.delivery_address,
        "contact_phone": order.contact_phone,
        "buyer_note": order.buyer_note,
        "status": order.status,
        "total": str(total),
        "currency": order.items[0].currency,
        "items": [
            {
                "product_id": item.product_id,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "unit_price": str(item.unit_price),
                "currency": item.currency,
            }
            for item in order.items
        ],
        "created_at": order.created_at.isoformat(),
    }


@router.get("/products")
def list_products(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=24, ge=1, le=100),
    search: str | None = Query(default=None, max_length=120),
    category: str | None = Query(default=None, max_length=80),
):
    query = (
        db.query(MarketplaceProduct, User.username)
        .join(User, User.id == MarketplaceProduct.seller_id)
        .filter(
            MarketplaceProduct.is_active.is_(True),
            MarketplaceProduct.stock > 0,
        )
    )
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                MarketplaceProduct.name.ilike(term),
                MarketplaceProduct.description.ilike(term),
            )
        )
    if category and category.strip():
        query = query.filter(MarketplaceProduct.category == category.strip())

    total = query.with_entities(func.count(MarketplaceProduct.id)).scalar() or 0
    rows = (
        query.order_by(
            MarketplaceProduct.created_at.desc(), MarketplaceProduct.id.desc()
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    categories = [
        value
        for (value,) in (
            db.query(MarketplaceProduct.category)
            .filter(
                MarketplaceProduct.is_active.is_(True),
                MarketplaceProduct.stock > 0,
            )
            .distinct()
            .order_by(MarketplaceProduct.category.asc())
            .all()
        )
    ]
    return {
        "items": [
            product_response(product, seller_name) for product, seller_name in rows
        ],
        "categories": categories,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.post("/products", status_code=status.HTTP_201_CREATED)
def create_product(
    payload: MarketplaceProductCreate,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    require_marketplace_member(user)
    if user.role not in SELLER_ROLES:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "A seller account is required to list products.",
        )
    product = MarketplaceProduct(
        seller_id=user.id,
        name=payload.name,
        description=payload.description,
        category=payload.category,
        price=payload.price,
        currency=payload.currency,
        stock=payload.stock,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product_response(product, user.username)


@router.post("/orders", status_code=status.HTTP_201_CREATED)
def create_orders(
    payload: MarketplaceOrderCreate,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    require_marketplace_member(user)
    requested_quantities: dict[int, int] = defaultdict(int)
    for item in payload.items:
        requested_quantities[item.product_id] += item.quantity

    products = (
        db.query(MarketplaceProduct)
        .filter(
            MarketplaceProduct.id.in_(requested_quantities),
            MarketplaceProduct.is_active.is_(True),
        )
        .order_by(MarketplaceProduct.id.asc())
        .with_for_update()
        .all()
    )
    if len(products) != len(requested_quantities):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "One or more products are no longer available.",
        )

    for product in products:
        quantity = requested_quantities[product.id]
        if product.seller_id == user.id:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                "You cannot order your own products.",
            )
        if product.stock < quantity:
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                f"Only {product.stock} units of {product.name} remain.",
            )
    if len({product.currency for product in products}) != 1:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "An order can only contain products in one currency.",
        )

    products_by_id = {product.id: product for product in products}
    grouped_quantities: dict[int, dict[int, int]] = defaultdict(dict)
    for product in products:
        product.stock -= requested_quantities[product.id]
        grouped_quantities[product.seller_id][product.id] = requested_quantities[
            product.id
        ]

    orders: list[MarketplaceOrder] = []
    for seller_id, seller_products in grouped_quantities.items():
        order = MarketplaceOrder(
            buyer_id=user.id,
            seller_id=seller_id,
            delivery_address=payload.delivery_address,
            contact_phone=payload.contact_phone,
            buyer_note=payload.buyer_note,
            status="REQUESTED",
            items=[
                MarketplaceOrderItem(
                    product_id=product_id,
                    product_name=products_by_id[product_id].name,
                    quantity=quantity,
                    unit_price=products_by_id[product_id].price,
                    currency=products_by_id[product_id].currency,
                )
                for product_id, quantity in seller_products.items()
            ],
        )
        db.add(order)
        orders.append(order)

    db.commit()
    for order in orders:
        db.refresh(order)
    return {"items": [order_response(order) for order in orders]}


@router.get("/orders")
def list_orders(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    require_marketplace_member(user)
    orders = (
        db.query(MarketplaceOrder)
        .options(
            joinedload(MarketplaceOrder.items),
            joinedload(MarketplaceOrder.buyer),
            joinedload(MarketplaceOrder.seller),
        )
        .filter(
            or_(
                MarketplaceOrder.buyer_id == user.id,
                MarketplaceOrder.seller_id == user.id,
            )
        )
        .order_by(MarketplaceOrder.created_at.desc(), MarketplaceOrder.id.desc())
        .all()
    )
    return {"items": [order_response(order) for order in orders]}


@router.patch("/orders/{order_id}")
def update_order_status(
    order_id: int,
    payload: MarketplaceOrderStatusUpdate,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    require_marketplace_member(user)
    order = (
        db.query(MarketplaceOrder)
        .filter(MarketplaceOrder.id == order_id)
        .with_for_update()
        .first()
    )
    if not order:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found.")

    is_seller = order.seller_id == user.id
    if order.status == "REQUESTED" and is_seller:
        if payload.status not in {"CONFIRMED", "CANCELLED"}:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "Sellers can confirm or cancel a requested order.",
            )
    elif order.status == "REQUESTED" and order.buyer_id == user.id:
        if payload.status != "CANCELLED":
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                "Buyers can only cancel their own requested order.",
            )
    elif order.status == "CONFIRMED" and is_seller:
        if payload.status != "COMPLETED":
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "A confirmed order can only be marked complete.",
            )
    else:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "This order can no longer be updated.",
        )

    if payload.status == "CANCELLED":
        product_ids = [item.product_id for item in order.items]
        products = (
            db.query(MarketplaceProduct)
            .filter(MarketplaceProduct.id.in_(product_ids))
            .with_for_update()
            .all()
        )
        products_by_id = {product.id: product for product in products}
        for item in order.items:
            product = products_by_id.get(item.product_id)
            if product:
                product.stock += item.quantity

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order_response(order)
