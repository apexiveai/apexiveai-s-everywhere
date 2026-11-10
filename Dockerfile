
# ============================================================
# APEXIVEAI COMMUNITY
# Production Backend API
# Deployment: OwnKube
# Frontend: Vercel
# Runtime: Python 3.12
# ============================================================

FROM python:3.12-slim

# ------------------------------------------------------------
# Application Environment
# ------------------------------------------------------------

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app/backend \
    PORT=8000

# ------------------------------------------------------------
# Application Directory
# ------------------------------------------------------------

WORKDIR /app/backend

# ------------------------------------------------------------
# Install Python Dependencies
# ------------------------------------------------------------

COPY backend/requirements.txt ./requirements.txt

RUN python -m pip install --upgrade pip && \
    python -m pip install -r requirements.txt && \
    rm requirements.txt

# ------------------------------------------------------------
# Copy Backend Source Code
# ------------------------------------------------------------

COPY backend/ ./

# ------------------------------------------------------------
# Application Data Directories
# ------------------------------------------------------------

RUN mkdir -p \
    /app/backend/uploads \
    /app/backend/data

# ------------------------------------------------------------
# Application Port
# ------------------------------------------------------------

EXPOSE 8000

# ------------------------------------------------------------
# Start FastAPI
# ------------------------------------------------------------

CMD ["sh", "-c", "exec python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
