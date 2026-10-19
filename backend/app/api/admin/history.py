import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import SuperAdmin
from app.database import get_db
from app.models import AuditLog, Tenant, User

router = APIRouter(prefix="/admin", tags=["Super Admin History"])


@router.get("/tenants/{tenant_id}/history")
def tenant_history(
    tenant_id: int,
    admin: SuperAdmin,
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
):
    if not db.get(Tenant, tenant_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tenant not found.")
    query = db.query(AuditLog).filter(AuditLog.tenant_id == tenant_id)
    total = query.count()
    events = (
        query.order_by(AuditLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    actors = {
        actor.id: actor.username
        for actor in db.query(User)
        .filter(User.id.in_([event.actor_id for event in events if event.actor_id]))
        .all()
    }
    return {
        "items": [
            {
                "id": event.id,
                "actor_id": event.actor_id,
                "actor_name": actors.get(event.actor_id, "Deleted user"),
                "tenant_id": event.tenant_id,
                "action": event.action,
                "entity_type": event.entity_type,
                "entity_id": event.entity_id,
                "details": json.loads(event.details) if event.details else None,
                "created_at": event.created_at,
            }
            for event in events
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }
