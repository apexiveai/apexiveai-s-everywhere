from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.admin.routes import get_active_tenant_or_400
from app.api.deps import SuperAdmin
from app.core.security import hash_password
from app.database import get_db
from app.models import User
from app.services.audit import record_audit


router = APIRouter(prefix="/admin", tags=["Super Admin"])


class MarketplaceAccountCreate(BaseModel):
    tenant_id: int
    role: Literal["SELLER", "BUYER"]
    username: str = Field(min_length=3, max_length=100)
    email: str = Field(min_length=3, max_length=255)
    temporary_password: str = Field(min_length=12, max_length=128)
    seller_code: str | None = Field(default=None, min_length=2, max_length=100)
    shop_name: str | None = Field(default=None, min_length=2, max_length=255)
    description: str | None = None
    commission_rate: Decimal = Field(default=Decimal("10.00"), ge=0, le=100)
    buyer_code: str | None = Field(default=None, min_length=2, max_length=100)
    display_name: str | None = Field(default=None, min_length=2, max_length=255)


@router.post(
    "/marketplace-accounts",
    status_code=status.HTTP_201_CREATED,
)
def create_marketplace_account(
    payload: MarketplaceAccountCreate,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    tenant = get_active_tenant_or_400(db, payload.tenant_id)
    username = payload.username.strip()
    email = payload.email.strip().lower()

    if db.query(User).filter(User.username == username).first():
        raise HTTPException(409, "Username already exists")

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(409, "Email already exists")

    if payload.role == "SELLER" and (
        not payload.seller_code or not payload.shop_name
    ):
        raise HTTPException(
            status_code=422,
            detail="Seller code and shop name are required for seller accounts.",
        )

    if payload.role == "BUYER" and (
        not payload.buyer_code or not payload.display_name
    ):
        raise HTTPException(
            status_code=422,
            detail="Buyer code and display name are required for buyer accounts.",
        )

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(payload.temporary_password),
        role=payload.role,
        tenant_id=tenant.id,
        is_active=True,
    )
    db.add(user)
    db.flush()

    record_audit(
        db,
        actor_id=admin.id,
        tenant_id=tenant.id,
        action=f"MARKETPLACE_{payload.role}_ACCOUNT_CREATED",
        entity_type="user",
        entity_id=user.id,
        details={"username": username, "role": payload.role},
    )
    db.commit()
    db.refresh(user)

    profile = (
        {
            "seller_code": payload.seller_code,
            "shop_name": payload.shop_name,
            "description": payload.description,
            "commission_rate": payload.commission_rate,
        }
        if payload.role == "SELLER"
        else {
            "buyer_code": payload.buyer_code,
            "display_name": payload.display_name,
        }
    )
    return {
        "message": "Marketplace account created successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "tenant_id": user.tenant_id,
        },
        "marketplace_profile": profile,
    }
