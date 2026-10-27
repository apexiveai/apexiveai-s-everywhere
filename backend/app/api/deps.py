from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models import Tenant, User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: DbSession,
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )

        if payload.get("type") != "access":
            raise credentials_error

        user_id = int(payload["sub"])

    except (JWTError, ValueError, KeyError, TypeError):
        raise credentials_error

    user = db.get(User, user_id)

    if not user or not user.is_active:
        raise credentials_error

    if user.role in {"TENANT_ADMIN", "SELLER", "BUYER"}:
        tenant = db.get(Tenant, user.tenant_id) if user.tenant_id else None

        if not tenant or tenant.status != "ACTIVE":
            raise HTTPException(
                status_code=403,
                detail="Tenant account is not active.",
            )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_super_admin(user: CurrentUser) -> User:
    if user.role != "SUPER_ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Super Admin permission required.",
        )

    return user


SuperAdmin = Annotated[User, Depends(require_super_admin)]