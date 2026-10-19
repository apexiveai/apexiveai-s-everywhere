from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Solution

router = APIRouter(prefix="/catalog", tags=["Public Catalog"])


@router.get("/solutions")
def list_public_solutions(db: Session = Depends(get_db)):
    solutions = (
        db.query(Solution)
        .filter(Solution.is_active.is_(True))
        .order_by(Solution.name.asc())
        .all()
    )
    return {
        "items": [
            {
                "code": solution.code,
                "name": solution.name,
                "description": solution.description,
            }
            for solution in solutions
        ]
    }

