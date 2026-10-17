from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.core.config import settings
from app.api.admin.routes import router as admin_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

app.include_router(
    auth_router,
    prefix=settings.API_PREFIX,
)
app.include_router(admin_router, prefix="/api")

@app.get("/health", include_in_schema=False)
def health():
    return {"status": "ok"}