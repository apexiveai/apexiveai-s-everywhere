
from fastapi import APIRouter

from app.core.config import settings
from app.schemas.ai import AIModelResponse

router = APIRouter(
    prefix="/ai/models",
    tags=["AI Models"],
)


@router.get("", response_model=list[AIModelResponse])
def list_models():

    models = []

    if settings.AI_CLOUD_MODEL:
        models.append(
            AIModelResponse(
                id=settings.AI_CLOUD_MODEL,
                provider="cloud",
                name=settings.AI_CLOUD_MODEL,
                available=bool(
                    settings.AI_CLOUD_BASE_URL
                    and settings.AI_CLOUD_API_KEY
                ),
            )
        )

    if settings.AI_LOCAL_MODEL:
        models.append(
            AIModelResponse(
                id=settings.AI_LOCAL_MODEL,
                provider="local",
                name=settings.AI_LOCAL_MODEL,
                available=bool(
                    settings.AI_LOCAL_BASE_URL
                ),
            )
        )

    return models
