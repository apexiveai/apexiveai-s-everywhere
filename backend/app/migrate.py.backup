
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Final

from sqlalchemy import text
from sqlalchemy.engine import Connection

from app.database import engine


MIGRATION_PATTERN: Final[str] = "[0-9][0-9][0-9]_*.sql"

# PostgreSQL transaction-level advisory lock.
# Prevents two application instances from applying the same migration
# concurrently.
ADVISORY_LOCK_NAMESPACE: Final[int] = 78421
ADVISORY_LOCK_KEY: Final[int] = 20261121


class MigrationError(RuntimeError):
    """Raised when a database migration cannot be applied."""


def split_sql_statements(sql: str) -> list[str]:
    """
    Split PostgreSQL SQL into executable statements.

    Supports:
    - Single-quoted strings
    - Double-quoted identifiers
    - Escaped quotes
    - -- line comments
    - /* block comments */ including nested blocks
    - PostgreSQL dollar-quoted strings
    - Empty/comment-only statements

    Semicolons inside quoted strings and comments are ignored.
    """

    statements: list[str] = []
    buffer: list[str] = []

    i = 0
    length = len(sql)

    in_single_quote = False
    in_double_quote = False
    in_line_comment = False
    block_comment_depth = 0
    dollar_quote_tag: str | None = None

    while i < length:
        char = sql[i]
        next_char = sql[i + 1] if i + 1 < length else ""

        # --------------------------------------------------
        # Line comment
        # --------------------------------------------------
        if in_line_comment:
            if char == "\n":
                in_line_comment = False
                buffer.append("\n")
            i += 1
            continue

        # --------------------------------------------------
        # Block comment (supports nested PostgreSQL comments)
        # --------------------------------------------------
        if block_comment_depth > 0:
            if char == "/" and next_char == "*":
                block_comment_depth += 1
                i += 2
                continue

            if char == "*" and next_char == "/":
                block_comment_depth -= 1
                i += 2
                continue

            if char == "\n":
                buffer.append("\n")

            i += 1
            continue

        # --------------------------------------------------
        # Dollar-quoted string
        # --------------------------------------------------
        if dollar_quote_tag is not None:
            if sql.startswith(dollar_quote_tag, i):
                buffer.append(dollar_quote_tag)
                i += len(dollar_quote_tag)
                dollar_quote_tag = None
                continue

            buffer.append(char)
            i += 1
            continue

        # --------------------------------------------------
        # Single-quoted string
        # --------------------------------------------------
        if in_single_quote:
            buffer.append(char)

            if char == "\\" and i + 1 < length:
                buffer.append(sql[i + 1])
                i += 2
                continue

            if char == "'":
                if next_char == "'":
                    buffer.append(next_char)
                    i += 2
                    continue

                in_single_quote = False

            i += 1
            continue

        # --------------------------------------------------
        # Double-quoted identifier
        # --------------------------------------------------
        if in_double_quote:
            buffer.append(char)

            if char == '"':
                if next_char == '"':
                    buffer.append(next_char)
                    i += 2
                    continue

                in_double_quote = False

            i += 1
            continue

        # --------------------------------------------------
        # Normal SQL parsing
        # --------------------------------------------------

        # Start line comment
        if char == "-" and next_char == "-":
            in_line_comment = True
            i += 2
            continue

        # Start block comment
        if char == "/" and next_char == "*":
            block_comment_depth = 1
            i += 2
            continue

        # Start single-quoted string
        if char == "'":
            in_single_quote = True
            buffer.append(char)
            i += 1
            continue

        # Start double-quoted identifier
        if char == '"':
            in_double_quote = True
            buffer.append(char)
            i += 1
            continue

        # Detect PostgreSQL dollar-quoted strings.
        if char == "$":
            match = re.match(
                r"\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$",
                sql[i:],
            )

            if match:
                dollar_quote_tag = match.group(0)
                buffer.append(dollar_quote_tag)
                i += len(dollar_quote_tag)
                continue

        # Semicolon outside comments and quotes.
        if char == ";":
            statement = "".join(buffer).strip()

            if statement:
                statements.append(statement)

            buffer.clear()
            i += 1
            continue

        buffer.append(char)
        i += 1

    # ------------------------------------------------------
    # Validate unfinished SQL constructs
    # ------------------------------------------------------
    if in_single_quote:
        raise MigrationError("Unterminated SQL single-quoted string.")

    if in_double_quote:
        raise MigrationError("Unterminated SQL quoted identifier.")

    if block_comment_depth > 0:
        raise MigrationError("Unterminated SQL block comment.")

    if dollar_quote_tag is not None:
        raise MigrationError(
            f"Unterminated PostgreSQL dollar-quoted string: "
            f"{dollar_quote_tag}"
        )

    final_statement = "".join(buffer).strip()

    if final_statement:
        statements.append(final_statement)

    return statements


def ensure_migration_table() -> None:
    """Create migration tracking table if it does not exist."""

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    version VARCHAR(255) PRIMARY KEY,
                    applied_at TIMESTAMP NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        )


def migration_already_applied(
    connection: Connection,
    version: str,
) -> bool:
    """Check whether a migration has already been applied."""

    result = connection.execute(
        text(
            """
            SELECT 1
            FROM schema_migrations
            WHERE version = :version
            LIMIT 1
            """
        ),
        {"version": version},
    )

    return result.first() is not None


def acquire_migration_lock(connection: Connection) -> None:
    """Acquire a transaction-scoped PostgreSQL advisory lock."""

    connection.execute(
        text(
            """
            SELECT pg_advisory_xact_lock(
                :namespace,
                :lock_key
            )
            """
        ),
        {
            "namespace": ADVISORY_LOCK_NAMESPACE,
            "lock_key": ADVISORY_LOCK_KEY,
        },
    )


def apply_migration(migration: Path) -> bool:
    """
    Apply one migration atomically.

    Returns:
        True  - migration applied
        False - migration already applied
    """

    version = migration.name

    try:
        sql = migration.read_text(
            encoding="utf-8-sig"
        )

        statements = split_sql_statements(sql)

        if not statements:
            raise MigrationError(
                f"Migration contains no executable SQL: {version}"
            )

        print(f"\nAPPLYING {version}")
        print(f"SQL statements: {len(statements)}")

        # One transaction per migration.
        # Any SQL error rolls back this migration and its tracking record.
        with engine.begin() as connection:

            # Wait for other migration processes, then re-check.
            acquire_migration_lock(connection)

            if migration_already_applied(connection, version):
                print(f"SKIPPED {version}")
                return False

            for index, statement in enumerate(
                statements,
                start=1,
            ):
                try:
                    connection.exec_driver_sql(statement)

                except Exception as exc:
                    raise MigrationError(
                        f"Migration failed: {version}\n"
                        f"Statement: {index}/{len(statements)}\n"
                        f"Database error: {exc}"
                    ) from exc

            connection.execute(
                text(
                    """
                    INSERT INTO schema_migrations (version)
                    VALUES (:version)
                    """
                ),
                {"version": version},
            )

        print(f"APPLIED {version}")
        return True

    except Exception as exc:
        raise MigrationError(
            f"\nDATABASE MIGRATION FAILED\n"
            f"Migration: {version}\n"
            f"Reason: {exc}\n"
            f"The current migration transaction was rolled back."
        ) from exc


def main() -> None:
    """Run all pending SQL migrations in filename order."""

    if engine.dialect.name != "postgresql":
        raise MigrationError(
            "This migration runner requires PostgreSQL. "
            f"Detected database: {engine.dialect.name}"
        )

    migration_dir = (
        Path(__file__).resolve().parent.parent / "migrations"
    )

    if not migration_dir.exists():
        raise MigrationError(
            f"Migration directory does not exist: {migration_dir}"
        )

    migrations = sorted(
        migration_dir.glob(MIGRATION_PATTERN)
    )

    if not migrations:
        raise MigrationError(
            f"No SQL migrations found in {migration_dir}"
        )

    print("=" * 64)
    print("APEXIVEAI COMMUNITY")
    print("DATABASE MIGRATION RUNNER")
    print("=" * 64)
    print(f"Database dialect: {engine.dialect.name}")
    print(f"Migration directory: {migration_dir}")
    print(f"Total migration files: {len(migrations)}")

    ensure_migration_table()

    applied_count = 0
    skipped_count = 0

    try:
        for migration in migrations:
            if apply_migration(migration):
                applied_count += 1
            else:
                skipped_count += 1

    except MigrationError:
        print("\nMIGRATION PROCESS STOPPED.", file=sys.stderr)
        raise

    print("\n" + "=" * 64)
    print("DATABASE MIGRATION: SUCCESS")
    print(f"Applied: {applied_count}")
    print(f"Skipped: {skipped_count}")
    print(f"Total: {len(migrations)}")
    print("=" * 64)


if __name__ == "__main__":
    main()
