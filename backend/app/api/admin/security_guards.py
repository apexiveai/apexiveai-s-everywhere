from datetime import datetime

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.api.deps import SuperAdmin
from app.database import get_db
from app.models.security_guard import SecurityGuardInquiry


router = APIRouter(
    prefix="/admin/security-guards", tags=["Admin - Security Guard Services"]
)


class SecurityGuardInquiryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    organization: str | None
    phone: str
    email: str | None
    guard_level: str
    personnel_count: int
    inquiry: str | None
    consent_given: bool
    created_at: datetime


@router.get("/inquiries")
def list_security_guard_inquiries(
    admin: SuperAdmin,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> dict:
    query = db.query(SecurityGuardInquiry)
    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total else 0
    items = (
        query.order_by(
            SecurityGuardInquiry.created_at.desc(),
            SecurityGuardInquiry.id.desc(),
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return {
        "items": [
            SecurityGuardInquiryItem.model_validate(item) for item in items
        ],
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
    }
