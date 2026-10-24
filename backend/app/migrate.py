from pathlib import Path

from sqlalchemy import text

from app.database import engine


def main() -> None:
    migration_dir = Path(__file__).resolve().parent.parent / "migrations"

    migrations = sorted(
        migration_dir.glob("[0-9][0-9][0-9]_*.sql")
    )

    if not migrations:
        raise RuntimeError(
            f"No SQL migrations found in {migration_dir}"
        )

    with engine.begin() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    version VARCHAR(255) PRIMARY KEY,
                    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        )

        for migration in migrations:
            version = migration.name

            already_applied = connection.execute(
                text(
                    """
                    SELECT 1
                    FROM schema_migrations
                    WHERE version = :version
                    """
                ),
                {"version": version},
            ).first()

            if already_applied:
                print(f"SKIPPED {version}")
                continue

            print(f"APPLYING {version}")

            sql = migration.read_text(
                encoding="utf-8"
            ).strip()

            if not sql:
                raise RuntimeError(
                    f"Migration is empty: {version}"
                )

            statements = [
                statement.strip()
                for statement in sql.split(";")
                if statement.strip()
            ]

            for statement in statements:
                connection.exec_driver_sql(statement)

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

    print("DATABASE MIGRATION: SUCCESS")


if __name__ == "__main__":
    main()