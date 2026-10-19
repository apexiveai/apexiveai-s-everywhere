import json
from datetime import datetime

from sqlalchemy.orm import Session

from app.models import AuditLog, Notification


def record_audit(
    db: Session,
    *,
    actor_id: int | None,
    tenant_id: int | None,
    action: str,
    entity_type: str,
    entity_id: int | str | None = None,
    details: dict[str, object] | None = None,
) -> None:
    db.add(
        AuditLog(
            actor_id=actor_id,
            tenant_id=tenant_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id is not None else None,
            details=json.dumps(details, ensure_ascii=False) if details else None,
            created_at=datetime.utcnow(),
        )
    )


def create_notification(
    db: Session,
    *,
    notification_type: str,
    title: str,
    body: str,
    tenant_id: int | None = None,
    recipient_user_id: int | None = None,
) -> None:
    db.add(
        Notification(
            tenant_id=tenant_id,
            recipient_user_id=recipient_user_id,
            notification_type=notification_type,
            title=title,
            body=body,
        )
    )
