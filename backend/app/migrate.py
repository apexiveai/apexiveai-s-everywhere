from pathlib import Path

from sqlalchemy import text

from app.database import engine


def main() -> None:
    migration_dir = Path(__file__).resolve().parent.parent / "migrations"
    migrations = sorted(migration_dir.glob("[0-9][0-9][0-9]_*.sql"))

    with engine.begin() as connection:
        connection.execute(
            text(
                "CREATE TABLE IF NOT EXISTS schema_migrations "
                "(version VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
            )
        )
        for migration in migrations:
            version = migration.name
            already_applied = connection.execute(
                text("SELECT 1 FROM schema_migrations WHERE version = :version"),
                {"version": version},
            ).first()
            if already_applied:
                continue

            statements = migration.read_text(encoding="utf-8").split(";")
            for statement in statements:
                if statement.strip():
                    connection.exec_driver_sql(statement)
            connection.execute(
                text("INSERT INTO schema_migrations (version) VALUES (:version)"),
                {"version": version},
            )
            print(f"Applied {version}")


if __name__ == "__main__":
    main()
