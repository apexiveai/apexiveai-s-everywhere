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

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    FRONTEND_URL: str = "https://www.apexiveai.com"

    CORS_ORIGINS: str = (
        "https://www.apexiveai.com,"
        "https://apexiveai.com"
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