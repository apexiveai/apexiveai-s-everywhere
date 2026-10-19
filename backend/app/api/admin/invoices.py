from datetime import datetime, time
from secrets import token_hex
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import SuperAdmin
from app.database import get_db
from app.models import Invoice, Solution, SubscriptionPlan, Tenant
from app.schemas.invoices import InvoiceCreate, InvoiceReview
from app.services.invoices import activate_verified_license_invoice
from app.services.audit import create_notification, record_audit

router = APIRouter(prefix="/admin", tags=["Super Admin Invoices"])


def invoice_response(invoice: Invoice) -> dict[str, object]:
    return {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "tenant_id": invoice.tenant_id,
        "tenant_name": invoice.tenant.company_name,
        "invoice_type": invoice.invoice_type,
        "currency": invoice.currency,
        "amount": str(invoice.amount),
        "description": invoice.description,
        "payment_instructions": invoice.payment_instructions,
        "plan_id": invoice.plan_id,
        "solution_id": invoice.solution_id,
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


@router.get("/invoices")
def list_invoices(
    admin: SuperAdmin,
    db: Annotated[Session, Depends(get_db)],
    invoice_status: str | None = Query(default=None, alias="status", max_length=30),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    query = db.query(Invoice)
    if invoice_status:
        query = query.filter(Invoice.status == invoice_status.upper())
    query = query.order_by(Invoice.created_at.desc())
    total = query.count()
    invoices = query.offset((page - 1) * page_size).limit(page_size).all()
    return {
        "items": [invoice_response(invoice) for invoice in invoices],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.post("/invoices", status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    admin: SuperAdmin,
    db: Annotated[Session, Depends(get_db)],
):
    tenant = db.get(Tenant, payload.tenant_id)
    if not tenant or tenant.status != "ACTIVE":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Active tenant not found.")

    plan = None
    solution = None
    if payload.invoice_type == "SOFTWARE_LICENSE":
        if payload.plan_id is None or payload.solution_id is None or payload.duration_months is None:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "License invoices require a plan, product, and term.",
            )
        plan = db.get(SubscriptionPlan, payload.plan_id)
        solution = db.get(Solution, payload.solution_id)
        if not plan or not plan.is_active:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Active plan not found.")
        if not solution or not solution.is_active:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Active product not found.")
        if plan.billing_cycle == "YEARLY" and payload.duration_months % 12 != 0:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                "Yearly plans must be invoiced in whole-year terms.",
            )
    elif any((payload.plan_id, payload.solution_id, payload.duration_months)):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Support & Maintenance invoices must be separate from software licenses.",
        )

    invoice = Invoice(
        invoice_number=f"PENDING-{token_hex(8).upper()}",
        tenant_id=tenant.id,
        invoice_type=payload.invoice_type,
        currency=payload.currency,
        amount=payload.amount,
        description=payload.description.strip(),
        payment_instructions=(
            payload.payment_instructions.strip()
            if payload.payment_instructions
            else None
        ),
        plan_id=plan.id if plan else None,
        solution_id=solution.id if solution else None,
        duration_months=payload.duration_months,
        status="ISSUED",
        due_at=(
            datetime.combine(payload.due_date, time.max)
            if payload.due_date
            else None
        ),
        created_by=admin.id,
    )
    db.add(invoice)
    db.flush()
    invoice.invoice_number = f"APX-{datetime.utcnow():%Y%m}-{invoice.id:06d}"
    record_audit(
        db,
        actor_id=admin.id,
        tenant_id=tenant.id,
        action="INVOICE_ISSUED",
        entity_type="invoice",
        entity_id=invoice.id,
        details={"invoice_type": invoice.invoice_type, "currency": invoice.currency},
    )
    create_notification(
        db,
        tenant_id=tenant.id,
        notification_type="INVOICE_ISSUED",
        title=f"New invoice: {invoice.invoice_number}",
        body=f"A {invoice.invoice_type.replace('_', ' ').lower()} invoice for {invoice.amount} {invoice.currency} is ready in Billing.",
    )
    db.commit()
    db.refresh(invoice)
    return invoice_response(invoice)


@router.patch("/invoices/{invoice_id}/review")
def review_invoice(
    invoice_id: int,
    payload: InvoiceReview,
    admin: SuperAdmin,
    db: Annotated[Session, Depends(get_db)],
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .with_for_update()
        .first()
    )
    if not invoice:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found.")
    if invoice.status != "PAYMENT_REPORTED":
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Only reported bank transfers can be reviewed.",
        )
    if payload.decision == "PAID":
        tenant = db.get(Tenant, invoice.tenant_id)
        if not tenant or tenant.status != "ACTIVE":
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                "Tenant must be active before confirming payment.",
            )

    if payload.decision == "PAID":
        if (
            invoice.payment_reference is None
            or invoice.amount_reported != invoice.amount
            or invoice.currency_reported != invoice.currency
        ):
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                "Reported payment details do not match the invoice.",
            )
        activate_verified_license_invoice(db, invoice, admin.id)
        invoice.status = "PAID"
        invoice.verified_by = admin.id
        invoice.verified_at = datetime.utcnow()
    else:
        invoice.status = "REJECTED"

    invoice.review_note = payload.review_note.strip() if payload.review_note else None
    record_audit(
        db,
        actor_id=admin.id,
        tenant_id=invoice.tenant_id,
        action="INVOICE_PAYMENT_VERIFIED" if payload.decision == "PAID" else "INVOICE_PAYMENT_REJECTED",
        entity_type="invoice",
        entity_id=invoice.id,
        details={"decision": payload.decision},
    )
    create_notification(
        db,
        tenant_id=invoice.tenant_id,
        notification_type=(
            "PAYMENT_VERIFIED" if payload.decision == "PAID" else "PAYMENT_REJECTED"
        ),
        title=f"Payment {payload.decision.lower()}: {invoice.invoice_number}",
        body=(
            "Bank transfer verified. Product access is active if this is a software license invoice."
            if payload.decision == "PAID"
            else "Bank transfer was not verified. Review the invoice note and report the corrected transfer."
        ),
    )
    db.commit()
    db.refresh(invoice)
    return {"message": "Invoice review saved.", "invoice": invoice_response(invoice)}
