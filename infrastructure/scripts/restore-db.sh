
#!/usr/bin/env bash

set -Eeuo pipefail

# ==========================================================
# APEXIVEAI COMMUNITY - DATABASE RESTORE
# ==========================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "ERROR: DATABASE_URL is not configured."
    exit 1
fi

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 backup-file.dump"
    exit 1
fi

BACKUP_FILE="$1"

if [[ ! -f "$BACKUP_FILE" ]]; then
    echo "ERROR: Backup file not found."
    exit 1
fi

if ! command -v pg_restore >/dev/null 2>&1; then
    echo "ERROR: pg_restore is not installed."
    exit 1
fi

echo "=========================================="
echo "DATABASE RESTORE WARNING"
echo "=========================================="

echo "This operation can replace existing data."
echo "Backup: $BACKUP_FILE"

read -r -p "Type RESTORE to continue: " CONFIRM

if [[ "$CONFIRM" != "RESTORE" ]]; then
    echo "Restore cancelled."
    exit 0
fi

echo "Restoring database..."

pg_restore \
    --dbname="$DATABASE_URL" \
    --clean \
    --if-exists \
    --no-owner \
    --no-acl \
    --exit-on-error \
    "$BACKUP_FILE"

echo "Database restore completed."

echo "Run application health checks before reopening traffic."

echo "=========================================="
