from datetime import date, datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import (
    Tenant,
    Subscription,
    License,
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
    Deny by default. Call this from every protected product endpoint.
    Assumes the model fields listed below exist in your current schema.
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

    # Require at least one active subscription covering the current time.
    subscriptions = db.query(Subscription).filter(
        Subscription.tenant_id == tenant_id,
        Subscription.status == "ACTIVE",
    ).all()

    subscription_ok = any(
        (as_utc(getattr(sub, "start_date", None)) is None
         or as_utc(getattr(sub, "start_date", None)) <= now)
        and
        (as_utc(getattr(sub, "end_date", None)) is None
         or as_utc(getattr(sub, "end_date", None)) >= now)
        for sub in subscriptions
    )

    if not subscription_ok:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="An active subscription is required.",
        )

    # Require an active, unexpired tenant license.
    licenses = db.query(License).filter(
        License.tenant_id == tenant_id,
    ).all()

    license_ok = any(
        getattr(item, "is_active", False)
        and (
            as_utc(getattr(item, "expires_at", None)) is None
            or as_utc(getattr(item, "expires_at", None)) >= now
        )
        for item in licenses
    )

    if not license_ok:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="A valid license is required.",
        )

    # The tenant must have an explicit grant for this solution.
    grant = db.query(TenantSolution).filter(
        TenantSolution.tenant_id == tenant_id,
        TenantSolution.solution_id == solution.id,
    ).first()

    if not grant or not getattr(grant, "granted", False):
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