from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.database import get_db
from app.models import User
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse
from app.services.entitlements import require_solution_access
from app.services.audit import record_audit

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
def login(
    data: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
):
    user = db.scalar(
        select(User).where(User.username == data.username)
    )

    # Keep the response generic to avoid disclosing account existence.
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled.",
        )

    if user.role not in {"SUPER_ADMIN", "TENANT_ADMIN"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid account role.",
        )

    if user.role == "TENANT_ADMIN":
        from app.models import Tenant

        tenant = db.get(Tenant, user.tenant_id) if user.tenant_id else None

        if not tenant or tenant.status != "ACTIVE":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tenant account is not active.",
            )

    token = create_access_token(
        user_id=user.id,
        role=user.role,
        tenant_id=user.tenant_id,
    )
    record_audit(
        db,
        actor_id=user.id,
        tenant_id=user.tenant_id,
        action="LOGIN_SUCCEEDED",
        entity_type="user",
        entity_id=user.id,
    )
    db.commit()

    return LoginResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(
    user: Annotated[User, Depends(get_current_user)],
):
    return user


@router.get("/solutions/{solution_code}/access")
def check_solution_access(
    solution_code: str,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if user.role != "TENANT_ADMIN" or user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tenant account required.",
        )
    solution = require_solution_access(db, user.tenant_id, solution_code)
    record_audit(
        db,
        actor_id=user.id,
        tenant_id=user.tenant_id,
        action="PRODUCT_ACCESS_CHECKED",
        entity_type="solution",
        entity_id=solution.id,
    )
    db.commit()
    return {
        "authorized": True,
        "solution_code": solution.code,
        "solution_name": solution.name,
        "url": solution.api_url,
    }