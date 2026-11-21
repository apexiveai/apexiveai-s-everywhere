from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ApexiveAI Community"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production"

    API_PREFIX: str = "/api"

    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ISSUER: str = "ApexiveAI"
    JWT_AUDIENCE: str = "apexiveai-solutions"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    FRONTEND_URL: str = "https://www.apexiveai.com"

    CORS_ORIGINS: str = (
        "https://www.apexiveai.com,"
        "https://apexiveai.com,"
        "http://localhost:3000,"
        "http://127.0.0.1:3000"
    )
    CORS_ORIGIN_REGEX: str = (
        r"^https://apexiveai-s-everywhere-[a-z0-9-]+-apexiveais-projects"
        r"\.vercel\.app$"
    )

    REDIS_URL: str = "redis://localhost:6379/0"

    # External ApexiveAI Solutions
    TRADEMARK_CONFLICT_API_URL: str = ""
    APEXIVE_RPA_API_URL: str = ""
    WORKFORCE_AI_API_URL: str = ""
    MNA_AI_API_URL: str = ""

    # License
    LICENSE_SECRET_KEY: str = ""
    LICENSE_ISSUER: str = "ApexiveAI"

        # AI Agent
    AI_ENABLED: bool = True
    AI_DEFAULT_PROVIDER: str = "cloud"

    AI_CLOUD_BASE_URL: str = ""
    AI_CLOUD_API_KEY: str = ""
    AI_CLOUD_MODEL: str = ""

    AI_LOCAL_BASE_URL: str = "http://127.0.0.1:11434/v1"
    AI_LOCAL_API_KEY: str = ""
    AI_LOCAL_MODEL: str = ""

    AI_REQUEST_TIMEOUT: int = 120
    AI_MAX_TOKENS: int = 4096
    AI_TEMPERATURE: float = 0.7

    AI_PUBLIC_ACCESS_ENABLED: bool = True
    AI_TENANT_ACCESS_ENABLED: bool = True

    AI_MAX_MESSAGE_LENGTH: int = 20000
    AI_MAX_HISTORY_MESSAGES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()