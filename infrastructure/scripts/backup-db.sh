
#!/usr/bin/env bash

set -Eeuo pipefail

# ==========================================================
# APEXIVEAI COMMUNITY - DATABASE BACKUP
# ==========================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

BACKUP_DIR="${BACKUP_DIR:-${ROOT_DIR}/backups}"

RETENTION_DAYS="${RETENTION_DAYS:-30}"

mkdir -p "$BACKUP_DIR"

chmod 700 "$BACKUP_DIR"

umask 077

if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "ERROR: DATABASE_URL is not configured."
    exit 1
fi

TIMESTAMP="$(date -u +%Y%m%d_%H%M%S)"

BACKUP_FILE="${BACKUP_DIR}/apexiveai_community_${TIMESTAMP}.dump"

echo "=========================================="
echo "APEXIVEAI COMMUNITY DATABASE BACKUP"
echo "=========================================="

echo "Starting PostgreSQL backup..."

if ! command -v pg_dump >/dev/null 2>&1; then
    echo "ERROR: pg_dump is not installed."
    exit 1
fi

pg_dump \
    --dbname="$DATABASE_URL" \
    --format=custom \
    --no-owner \
    --no-acl \
    --file="$BACKUP_FILE"

if [[ ! -s "$BACKUP_FILE" ]]; then
    echo "ERROR: Backup file is empty."
    exit 1
fi

echo "Backup completed successfully."

echo "File: $BACKUP_FILE"

# ----------------------------------------------------------
# RETENTION POLICY
# ----------------------------------------------------------

find "$BACKUP_DIR" \
    -type f \
    -name "apexiveai_community_*.dump" \
    -mtime "+${RETENTION_DAYS}" \
    -delete

echo "Old backups cleaned."

echo "=========================================="
