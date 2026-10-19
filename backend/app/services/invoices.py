import calendar
from datetime import date, datetime, time, timedelta
from secrets import token_urlsafe

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Invoice, License, Subscription, TenantSolution


def add_months(value: date, months: int) -> date:
    month_index = value.month - 1 + months
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    day = min(value.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)


def activate_verified_license_invoice(
    db: Session,
    invoice: Invoice,
    verified_by: int,
) -> None:
    if invoice.invoice_type != "SOFTWARE_LICENSE":
        return
    if invoice.plan_id is None or invoice.solution_id is None:
        raise HTTPException(409, "License invoice is missing its plan or solution.")
    if invoice.duration_months is None:
        raise HTTPException(409, "License invoice is missing its term.")

    grant = (
        db.query(TenantSolution)
        .filter(
            TenantSolution.tenant_id == invoice.tenant_id,
            TenantSolution.solution_id == invoice.solution_id,
        )
        .first()
    )
    start_date = date.today()
    if grant and grant.granted and grant.expires_at:
        previous_expiry = grant.expires_at.date()
        if previous_expiry >= start_date:
            start_date = previous_expiry + timedelta(days=1)

    end_date = add_months(start_date, invoice.duration_months) - timedelta(days=1)
    starts_at = datetime.combine(start_date, time.min)
    expires_at = datetime.combine(end_date, time.max)

    db.add(
        Subscription(
            tenant_id=invoice.tenant_id,
            plan_id=invoice.plan_id,
            start_date=starts_at,
            end_date=expires_at,
            status="ACTIVE",
        )
    )
    db.add(
        License(
            tenant_id=invoice.tenant_id,
            license_key="APX-" + token_urlsafe(30),
            license_type="SUBSCRIPTION",
            expires_at=expires_at,
            max_users=5,
            max_devices=5,
            is_active=True,
            created_by=verified_by,
        )
    )

    if grant is None:
        grant = TenantSolution(
            tenant_id=invoice.tenant_id,
            solution_id=invoice.solution_id,
        )
        db.add(grant)

    grant.granted = True
    grant.granted_at = datetime.utcnow()
    grant.granted_by = verified_by
    grant.expires_at = expires_at
