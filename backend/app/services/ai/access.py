
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models import Tenant, User

optional_oauth = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False,
)

DbSession = Annotated[Session, Depends(get_db)]


def get_optional_ai_user(
    token: Annotated[str | None, Depends(optional_oauth)],
    db: DbSession,
) -> User | None:

    if not token:
        return None

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )

        if payload.get("type") != "access":
            raise ValueError("Invalid token type")

        user_id = int(payload["sub"])

    except (JWTError, ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired credentials.",
        )

    user = db.get(User, user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="Account is inactive or unavailable.",
        )

    if user.role in {"TENANT_ADMIN", "SELLER", "BUYER"}:
        tenant = (
            db.get(Tenant, user.tenant_id)
            if user.tenant_id
            else None
        )

        if not tenant or tenant.status != "ACTIVE":
            raise HTTPException(
                status_code=403,
                detail="Tenant account is not active.",
            )

    return user


OptionalAIUser = Annotated[
    User | None,
    Depends(get_optional_ai_user),
]
