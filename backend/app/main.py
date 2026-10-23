from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.core.config import settings
from app.api.admin.routes import router as admin_router
from app.api.admin.marketplace_accounts import (
    router as marketplace_accounts_router,
)
from app.api.admin.invoices import router as admin_invoices_router
from app.api.catalog import router as catalog_router
from app.api.invoices import router as invoices_router
from app.api.messages import router as messages_router
from app.api.notifications import router as notifications_router
from app.api.history import router as history_router
from app.api.admin.history import router as admin_history_router
from app.api.auctions import router as auctions_router
from app.api.marketplace import router as marketplace_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.CORS_ORIGINS.split(",")
        if origin.strip()
    ],
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix=settings.API_PREFIX,
)
app.include_router(admin_router, prefix="/api")
app.include_router(marketplace_accounts_router, prefix="/api")
app.include_router(admin_invoices_router, prefix="/api")
app.include_router(catalog_router, prefix="/api")
app.include_router(invoices_router, prefix="/api")
app.include_router(messages_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(admin_history_router, prefix="/api")
app.include_router(auctions_router, prefix="/api")
app.include_router(marketplace_router, prefix="/api")

@app.get("/health", include_in_schema=False)
def health():
    return {"status": "ok"}