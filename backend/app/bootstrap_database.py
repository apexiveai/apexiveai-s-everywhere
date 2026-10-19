
from pathlib import Path

from sqlalchemy import inspect, text

from app.database import Base, engine
import app.models  # noqa: F401 - Register all SQLAlchemy models


BASELINE_MIGRATIONS = (
    "001_create_invoices.sql",
    "002_create_communication_tables.sql",
)


def main() -> None:
    migration_dir = Path(__file__).resolve().parent.parent / "migrations"

    for filename in BASELINE_MIGRATIONS:
        if not (migration_dir / filename).is_file():
            raise RuntimeError(f"Required migration file missing: {filename}")

    expected_tables = set(Base.metadata.tables.keys())
    existing_tables = set(inspect(engine).get_table_names())

    # Do not automatically modify an unexpected or partially initialized DB.
    unexpected_tables = existing_tables - expected_tables - {"schema_migrations"}
    if unexpected_tables:
        raise RuntimeError(
            "Unexpected database tables found; refusing to continue: "
            + ", ".join(sorted(unexpected_tables))
        )

    model_tables_present = existing_tables & expected_tables

    if model_tables_present and model_tables_present != expected_tables:
        missing = expected_tables - model_tables_present
        raise RuntimeError(
            "Partial database schema detected; refusing automatic bootstrap. "
            "Missing model tables: " + ", ".join(sorted(missing))
        )

    # Create tables in SQLAlchemy's foreign-key dependency order.
    Base.metadata.create_all(bind=engine)

    # Mark only the two existing SQL files as baselined.
    # Their tables are represented by the registered SQLAlchemy models.
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

        for filename in BASELINE_MIGRATIONS:
            connection.execute(
                text(
                    """
                    INSERT INTO schema_migrations (version)
                    VALUES (:version)
                    ON CONFLICT (version) DO NOTHING
                    """
                ),
                {"version": filename},
            )

    actual_tables = set(inspect(engine).get_table_names())
    missing_tables = expected_tables - actual_tables

    if missing_tables:
        raise RuntimeError(
            "Bootstrap verification failed. Missing tables: "
            + ", ".join(sorted(missing_tables))
        )

    print("DATABASE BOOTSTRAP: SUCCESS")
    print(f"MODEL TABLES VERIFIED: {len(expected_tables)}")
    print("BASELINED MIGRATIONS:")
    for filename in BASELINE_MIGRATIONS:
        print(f"  {filename}")
    print("DATABASE TABLES:")
    for table in sorted(actual_tables):
        print(f"  {table}")


if __name__ == "__main__":
    main()
