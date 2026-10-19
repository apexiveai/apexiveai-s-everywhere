from datetime import date, datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import (
    Tenant,
    Solution,
    TenantSolution,
)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def as_utc(value):
    """Normalize a database datetime for comparison."""
    if value is None:
        return None

    if isinstance(value, date) and not isinstance(value, datetime):
        value = datetime.combine(value, datetime.min.time())

    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value.astimezone(timezone.utc)


def require_solution_access(
    db: Session,
    tenant_id: int,
    solution_code: str,
) -> Solution:
    """
    Deny by default. A SuperAdmin grant is the authorization source of truth.
    Call this from every protected product endpoint.
    """

    tenant = db.query(Tenant).filter(
        Tenant.id == tenant_id
    ).first()

    if not tenant or getattr(tenant, "status", None) != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Company account is inactive.",
        )

    solution = db.query(Solution).filter(
        Solution.code == solution_code
    ).first()

    if not solution or not getattr(solution, "is_active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solution is unavailable.",
        )

    now = utc_now()

    # The tenant must have an explicit grant for this solution.
    grant = db.query(TenantSolution).filter(
        TenantSolution.tenant_id == tenant_id,
        TenantSolution.solution_id == solution.id,
    ).first()

    if not grant or not grant.granted:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your company does not have access to this solution.",
        )

    grant_expiry = as_utc(getattr(grant, "expires_at", None))

    if grant_expiry is not None and grant_expiry < now:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solution access has expired.",
        )

    return solution