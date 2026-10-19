import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser
from app.database import get_db
from app.models import AuditLog

router = APIRouter(prefix="/history", tags=["Tenant History"])


def serialize_event(event: AuditLog) -> dict[str, object]:
    return {
        "id": event.id,
        "actor_id": event.actor_id,
        "tenant_id": event.tenant_id,
        "action": event.action,
        "entity_type": event.entity_type,
        "entity_id": event.entity_id,
        "details": json.loads(event.details) if event.details else None,
        "created_at": event.created_at,
    }


@router.get("")
def tenant_history(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
):
    if user.role != "TENANT_ADMIN" or user.tenant_id is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Tenant account required.")
    query = db.query(AuditLog).filter(AuditLog.tenant_id == user.tenant_id)
    total = query.count()
    events = (
        query.order_by(AuditLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return {
        "items": [serialize_event(event) for event in events],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }
