
from app.core.config import settings
from app.services.ai.providers.openai_compatible import (
    OpenAICompatibleProvider,
)


def get_ai_provider(
    provider_name: str | None = None,
) -> OpenAICompatibleProvider:

    selected = (
        provider_name or settings.AI_DEFAULT_PROVIDER
    ).lower()

    if selected == "cloud":
        if not settings.AI_CLOUD_BASE_URL:
            raise ValueError(
                "AI_CLOUD_BASE_URL is not configured."
            )

        if not settings.AI_CLOUD_API_KEY:
            raise ValueError(
                "AI_CLOUD_API_KEY is not configured."
            )

        return OpenAICompatibleProvider(
            name="cloud",
            base_url=settings.AI_CLOUD_BASE_URL,
            api_key=settings.AI_CLOUD_API_KEY,
            default_model=settings.AI_CLOUD_MODEL,
        )

    if selected == "local":
        if not settings.AI_LOCAL_BASE_URL:
            raise ValueError(
                "AI_LOCAL_BASE_URL is not configured."
            )

        return OpenAICompatibleProvider(
            name="local",
            base_url=settings.AI_LOCAL_BASE_URL,
            api_key=settings.AI_LOCAL_API_KEY,
            default_model=settings.AI_LOCAL_MODEL,
        )

    raise ValueError(
        "Unsupported AI provider. Use cloud or local."
    )
