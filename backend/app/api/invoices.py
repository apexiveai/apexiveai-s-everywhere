from datetime import datetime
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser
from app.database import get_db
from app.models import Invoice, Solution, TenantSolution, User
from app.schemas.invoices import InvoicePaymentReport
from app.services.audit import create_notification, record_audit

router = APIRouter(prefix="/invoices", tags=["Tenant Invoices"])


def require_tenant_user(user: CurrentUser) -> int:
    if user.role != "TENANT_ADMIN" or user.tenant_id is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Tenant account required.")
    return user.tenant_id


def invoice_response(invoice: Invoice) -> dict[str, object]:
    return {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "invoice_type": invoice.invoice_type,
        "currency": invoice.currency,
        "amount": str(invoice.amount),
        "description": invoice.description,
        "payment_instructions": invoice.payment_instructions,
        "solution_name": invoice.solution.name if invoice.solution else None,
        "duration_months": invoice.duration_months,
        "status": invoice.status,
        "due_at": invoice.due_at,
        "payment_reference": invoice.payment_reference,
        "payer_name": invoice.payer_name,
        "amount_reported": (
            str(invoice.amount_reported)
            if invoice.amount_reported is not None
            else None
        ),
        "currency_reported": invoice.currency_reported,
        "payment_reported_at": invoice.payment_reported_at,
        "review_note": invoice.review_note,
        "verified_at": invoice.verified_at,
        "created_at": invoice.created_at,
    }


@router.get("")
def list_tenant_invoices(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    tenant_id = require_tenant_user(user)
    invoices = (
        db.query(Invoice)
        .filter(Invoice.tenant_id == tenant_id)
        .order_by(Invoice.created_at.desc())
        .all()
    )
    return {"items": [invoice_response(invoice) for invoice in invoices]}


@router.post("/{invoice_id}/payment-report")
def report_bank_transfer(
    invoice_id: int,
    payload: InvoicePaymentReport,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    tenant_id = require_tenant_user(user)
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id, Invoice.tenant_id == tenant_id)
        .with_for_update()
        .first()
    )
    if not invoice:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found.")
    if invoice.status not in {"ISSUED", "REJECTED"}:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "This invoice is not accepting a payment report.",
        )
    if payload.currency != invoice.currency or payload.amount != Decimal(invoice.amount):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Reported amount and currency must match the invoice.",
        )
    payment_reference = payload.payment_reference.strip().upper()
    duplicate_reference = (
        db.query(Invoice)
        .filter(
            func.upper(Invoice.payment_reference) == payment_reference,
            Invoice.id != invoice.id,
        )
        .first()
    )
    if duplicate_reference:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "This bank reference has already been reported for another invoice.",
        )

    invoice.payment_reference = payment_reference
    invoice.payer_name = payload.payer_name.strip()
    invoice.amount_reported = payload.amount
    invoice.currency_reported = payload.currency
    invoice.payment_reported_at = datetime.utcnow()
    invoice.status = "PAYMENT_REPORTED"
    invoice.review_note = None
    record_audit(
        db,
        actor_id=user.id,
        tenant_id=tenant_id,
        action="BANK_TRANSFER_REPORTED",
        entity_type="invoice",
        entity_id=invoice.id,
        details={"currency": invoice.currency, "amount": str(invoice.amount)},
    )
    admin = (
        db.query(User)
        .filter(User.role == "SUPER_ADMIN", User.is_active.is_(True))
        .first()
    )
    if admin:
        create_notification(
            db,
            recipient_user_id=admin.id,
            notification_type="PAYMENT_REPORTED",
            title=f"Bank transfer reported: {invoice.invoice_number}",
            body=f"A tenant reported payment reference {invoice.payment_reference}. Verify it against the bank statement.",
        )
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "This bank reference has already been reported for another invoice.",
        ) from exc
    db.refresh(invoice)
    return {"message": "Bank transfer reported for SuperAdmin verification.", "invoice": invoice_response(invoice)}


@router.get("/products")
def list_available_products(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    tenant_id = require_tenant_user(user)
    now = datetime.utcnow()
    products = (
        db.query(TenantSolution, Solution)
        .join(Solution, Solution.id == TenantSolution.solution_id)
        .filter(
            TenantSolution.tenant_id == tenant_id,
            TenantSolution.granted.is_(True),
            Solution.is_active.is_(True),
        )
        .all()
    )
    return {
        "items": [
            {
                "code": solution.code,
                "name": solution.name,
                "description": solution.description,
                "url": solution.api_url,
                "expires_at": access.expires_at,
                "active": access.expires_at is None or access.expires_at >= now,
            }
            for access, solution in products
            if access.expires_at is None or access.expires_at >= now
        ]
    }
