from datetime import date, timedelta
from secrets import token_urlsafe
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import SuperAdmin
from app.core.security import hash_password
from app.database import get_db
from app.models import (
    License,
    Solution,
    Subscription,
    SubscriptionPlan,
    Tenant,
    TenantSolution,
    User,
)

router = APIRouter(prefix="/admin", tags=["Super Admin"])


# ---------- Request schemas ----------

class TenantCreate(BaseModel):
    company_name: str = Field(min_length=2, max_length=200)
    tenant_code: str = Field(
        min_length=3, max_length=60, pattern=r"^[A-Za-z0-9_-]+$"
    )
    admin_username: str = Field(min_length=3, max_length=80)
    admin_email: str
    temporary_password: str = Field(min_length=12, max_length=128)
    contact_phone: str | None = None


class TenantStatusUpdate(BaseModel):
    status: Literal["ACTIVE", "SUSPENDED", "INACTIVE"]


class PlanCreate(BaseModel):
    code: str = Field(min_length=2, max_length=60)
    name: str = Field(min_length=2, max_length=120)
    billing_cycle: Literal["MONTHLY", "YEARLY"]
    price_mmk: int = Field(ge=0)
    minimum_months: int = Field(default=1, ge=1, le=120)


class SolutionCreate(BaseModel):
    code: str = Field(min_length=2, max_length=80)
    name: str = Field(min_length=2, max_length=120)
    description: str = ""
    api_url: str | None = None


class SubscriptionAssign(BaseModel):
    plan_id: int
    start_date: date
    end_date: date


class LicenseIssue(BaseModel):
    expires_at: date
    max_users: int = Field(default=5, ge=1, le=100000)
    max_devices: int = Field(default=5, ge=1, le=100000)
    license_type: str = Field(default="SUBSCRIPTION", max_length=50)


class SolutionGrant(BaseModel):
    granted: bool
    expires_at: date | None = None


# ---------- Helpers ----------

def get_tenant_or_404(db: Session, tenant_id: int) -> Tenant:
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(404, "Tenant not found")
    return tenant


def get_solution_or_404(db: Session, solution_id: int) -> Solution:
    solution = db.query(Solution).filter(
        Solution.id == solution_id
    ).first()
    if not solution:
        raise HTTPException(404, "Solution not found")
    return solution


def get_active_tenant_or_400(db: Session, tenant_id: int) -> Tenant:
    tenant = get_tenant_or_404(db, tenant_id)
    if tenant.status != "ACTIVE":
        raise HTTPException(
            409, "Tenant must be ACTIVE before assigning services"
        )
    return tenant


def pagination_result(
    items: list[dict[str, object]],
    total: int,
    page: int,
    page_size: int,
) -> dict[str, object]:
    total_pages = (total + page_size - 1) // page_size
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


# ---------- Overview ----------

@router.get("/overview")
def admin_overview(
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    return {
        "tenants": db.query(func.count(Tenant.id)).scalar() or 0,
        "active_tenants": db.query(func.count(Tenant.id)).filter(
            Tenant.status == "ACTIVE"
        ).scalar() or 0,
        "plans": db.query(func.count(SubscriptionPlan.id)).filter(
            SubscriptionPlan.is_active.is_(True)
        ).scalar() or 0,
        "solutions": db.query(func.count(Solution.id)).filter(
            Solution.is_active.is_(True)
        ).scalar() or 0,
        "licenses": db.query(func.count(License.id)).filter(
            License.is_active.is_(True)
        ).scalar() or 0,
    }


# ---------- Tenant management ----------

@router.get("/tenants")
def list_tenants(
    admin: SuperAdmin,
    db: Session = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    query = db.query(Tenant).order_by(Tenant.id.desc())
    total = query.count()
    tenants = query.offset((page - 1) * page_size).limit(page_size).all()
    items = [
        {
            "id": t.id,
            "company_name": t.company_name,
            "tenant_code": t.tenant_code,
            "status": t.status,
            "contact_email": t.contact_email,
            "contact_phone": t.contact_phone,
            "created_at": t.created_at,
        }
        for t in tenants
    ]
    return pagination_result(items, total, page, page_size)


@router.post("/tenants", status_code=status.HTTP_201_CREATED)
def create_tenant(
    payload: TenantCreate,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    username = payload.admin_username.strip()
    email = payload.admin_email.strip().lower()
    code = payload.tenant_code.strip().upper()

    if db.query(Tenant).filter(
        Tenant.tenant_code == code
    ).first():
        raise HTTPException(409, "Tenant code already exists")

    if db.query(User).filter(
        User.username == username
    ).first():
        raise HTTPException(409, "Username already exists")

    if db.query(User).filter(
        User.email == email
    ).first():
        raise HTTPException(409, "Email already exists")

    try:
        tenant = Tenant(
            company_name=payload.company_name.strip(),
            tenant_code=code,
            status="ACTIVE",
            contact_email=email,
            contact_phone=payload.contact_phone,
        )
        db.add(tenant)
        db.flush()

        tenant_admin = User(
            username=username,
            email=email,
            password_hash=hash_password(payload.temporary_password),
            role="TENANT_ADMIN",
            tenant_id=tenant.id,
            is_active=True,
        )
        db.add(tenant_admin)
        db.commit()
        db.refresh(tenant)
        db.refresh(tenant_admin)

        return {
            "message": "Tenant created successfully",
            "tenant": {
                "id": tenant.id,
                "company_name": tenant.company_name,
                "tenant_code": tenant.tenant_code,
                "status": tenant.status,
            },
            "tenant_admin": {
                "id": tenant_admin.id,
                "username": tenant_admin.username,
                "email": tenant_admin.email,
            },
        }
    except Exception:
        db.rollback()
        raise


@router.patch("/tenants/{tenant_id}/status")
def update_tenant_status(
    tenant_id: int,
    payload: TenantStatusUpdate,
    admin: SuperAdmin,
    db: Session = Depends(get_db),
):
    tenant = get_tenant_or_404(db, tenant_id)
    tenant.status = payload.status

    # Immediately disable tenant users when suspended/inactive.
    users = db.query(User).filter(User.tenant_id == tenant_id).all()
    for user in users:
        user.is_active = payload.status == "ACTIVE"

    db.commit()
    return {
        "message": "Tenant status updated",
        "tenant_id": tenant_id,
        "status": tenant.status,
    }


# ---------- Subscription plans ----------

@router.get("/plans")
def list_plans(
    admin: SuperAdmin,
    db: Session = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    query = db.query(SubscriptionPlan).order_by(SubscriptionPlan.id.desc())
    total = query.count()
    plans = query.offset((page - 1) * page_size).limit(page_size).all()
    items = [
        {
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "billing_cycle": p.billing_cycle,
            "price_mmk": p.price_mmk,

            "minimum_months": p.minimum_months,

            "is_active": p.is_active,

        }

        for p in plans

    ]
    return pagination_result(items, total, page, page_size)

@router.post("/plans", status_code=status.HTTP_201_CREATED)

def create_plan(

    payload: PlanCreate,

    admin: SuperAdmin,

    db: Session = Depends(get_db),

):

    code = payload.code.strip().upper()

    if db.query(SubscriptionPlan).filter(

        SubscriptionPlan.code == code

    ).first():

        raise HTTPException(409, "Plan code already exists")

    plan = SubscriptionPlan(

        code=code,

        name=payload.name.strip(),

        billing_cycle=payload.billing_cycle,

        price_mmk=payload.price_mmk,

        minimum_months=payload.minimum_months,

        is_active=True,

    )

    db.add(plan)

    db.commit()

    db.refresh(plan)

    return {

        "id": plan.id,

        "code": plan.code,

        "name": plan.name,

        "billing_cycle": plan.billing_cycle,

        "price_mmk": plan.price_mmk,

        "minimum_months": plan.minimum_months,

        "is_active": plan.is_active,

    }

# ---------- Dynamic solution catalog ----------

@router.get("/solutions")

def list_solutions(

    admin: SuperAdmin,

    db: Session = Depends(get_db),

    page: int = Query(default=1, ge=1),

    page_size: int = Query(default=20, ge=1, le=100),

):

    query = db.query(Solution).order_by(Solution.id.desc())

    total = query.count()

    solutions = query.offset((page - 1) * page_size).limit(page_size).all()

    items = [

        {

            "id": s.id,

            "code": s.code,

            "name": s.name,

            "description": s.description,

            "api_url": s.api_url,

            "is_active": s.is_active,

        }

        for s in solutions
    ]

    return pagination_result(items, total, page, page_size)
@router.post("/solutions", status_code=status.HTTP_201_CREATED)

def create_solution(

    payload: SolutionCreate,

    admin: SuperAdmin,

    db: Session = Depends(get_db),

):

    code = payload.code.strip().upper()

    if db.query(Solution).filter(

        Solution.code == code

    ).first():

        raise HTTPException(409, "Solution code already exists")

    solution = Solution(

        code=code,

        name=payload.name.strip(),

        description=payload.description,

        api_url=payload.api_url,

        is_active=True,

    )

    db.add(solution)

    db.commit()

    db.refresh(solution)

    return {

        "id": solution.id,

        "code": solution.code,

        "name": solution.name,

        "description": solution.description,

        "is_active": solution.is_active,

    }

# ---------- Assign subscription ----------

@router.post("/tenants/{tenant_id}/subscription")

def assign_subscription(

    tenant_id: int,

    payload: SubscriptionAssign,

    admin: SuperAdmin,

    db: Session = Depends(get_db),

):

    get_active_tenant_or_400(db, tenant_id)

    plan = db.query(SubscriptionPlan).filter(

        SubscriptionPlan.id == payload.plan_id,

        SubscriptionPlan.is_active.is_(True),

    ).first()

    if not plan:

        raise HTTPException(404, "Active subscription plan not found")

    if payload.end_date < payload.start_date:

        raise HTTPException(422, "end_date must be on or after start_date")

    subscription = Subscription(

        tenant_id=tenant_id,

        plan_id=plan.id,

        start_date=payload.start_date,

        end_date=payload.end_date,

        status="ACTIVE",

    )

    db.add(subscription)

    db.commit()

    db.refresh(subscription)

    return {

        "message": "Subscription assigned",

        "subscription_id": subscription.id,

        "tenant_id": tenant_id,

        "plan_id": plan.id,

        "start_date": subscription.start_date,

        "end_date": subscription.end_date,

        "status": subscription.status,

    }

# ---------- Issue license ----------

@router.post("/tenants/{tenant_id}/license")

def issue_license(

    tenant_id: int,

    payload: LicenseIssue,

    admin: SuperAdmin,

    db: Session = Depends(get_db),

):

    get_active_tenant_or_400(db, tenant_id)

    if payload.expires_at < date.today():

        raise HTTPException(422, "License expiry must be today or later")

    license_key = "APX-" + token_urlsafe(30)

    license_record = License(

        tenant_id=tenant_id,

        license_key=license_key,

        license_type=payload.license_type,

        expires_at=payload.expires_at,

        max_users=payload.max_users,

        max_devices=payload.max_devices,

        is_active=True,

        created_by=admin.id,

    )

    db.add(license_record)

    db.commit()

    db.refresh(license_record)
    return {

        "message": "License issued",

        "license_id": license_record.id,

        "tenant_id": tenant_id,

        "license_key": license_record.license_key,

        "license_type": license_record.license_type,

        "expires_at": license_record.expires_at,

        "max_users": license_record.max_users,

        "max_devices": license_record.max_devices,

        "is_active": license_record.is_active,

    }

# ---------- Grant/revoke individual solution ----------

@router.put("/tenants/{tenant_id}/solutions/{solution_id}")

def set_solution_access(

    tenant_id: int,

    solution_id: int,

    payload: SolutionGrant,

    admin: SuperAdmin,

    db: Session = Depends(get_db),

):

    get_tenant_or_404(db, tenant_id)

    solution = get_solution_or_404(db, solution_id)

    if not solution.is_active and payload.granted:

        raise HTTPException(409, "This solution is disabled globally")

    access = db.query(TenantSolution).filter(

        TenantSolution.tenant_id == tenant_id,

        TenantSolution.solution_id == solution_id,

    ).first()

    if access is None:

        access = TenantSolution(

            tenant_id=tenant_id,

            solution_id=solution_id,

            granted=payload.granted,

            granted_by=admin.id,

            expires_at=payload.expires_at,

        )

        db.add(access)

    else:

        access.granted = payload.granted

        access.granted_by = admin.id

        access.expires_at = payload.expires_at

    db.commit()

    db.refresh(access)

    return {

        "message": "Solution access updated",

        "tenant_id": tenant_id,

        "solution_id": solution_id,

        "solution_code": solution.code,

        "granted": access.granted,

        "expires_at": access.expires_at,

    }