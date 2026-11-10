
#!/usr/bin/env bash

set -Eeuo pipefail

# ==========================================================
# APEXIVEAI COMMUNITY - DATABASE MIGRATION
# ==========================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT_DIR"

echo "=========================================="
echo "APEXIVEAI DATABASE MIGRATION"
echo "=========================================="

if ! docker compose ps --status running --services | grep -qx api; then
    echo "ERROR: API container is not running."
    exit 1
fi

echo "Checking current migration state..."

docker compose exec -T api alembic current

echo "Applying database migrations..."

docker compose exec -T api alembic upgrade head

echo "Verifying migration state..."

docker compose exec -T api alembic current

echo "Migration completed successfully."

echo "=========================================="
