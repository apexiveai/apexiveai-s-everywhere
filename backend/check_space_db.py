
from sqlalchemy import text
from app.database import engine


def main():
    print("=" * 55)
    print("APEXIVEAI SPACE OS - DATABASE AUDIT")
    print("=" * 55)

    with engine.connect() as connection:
        print("DATABASE:", engine.dialect.name)

        migration_table = connection.execute(
            text("""
                SELECT to_regclass(
                    current_schema() || '.schema_migrations'
                )
            """)
        ).scalar()

        print("MIGRATION TABLE:", migration_table)

        if migration_table:
            migration_applied = connection.execute(
                text("""
                    SELECT EXISTS (
                        SELECT 1
                        FROM schema_migrations
                        WHERE version = :version
                    )
                """),
                {"version": "012_space_core_foundation.sql"},
            ).scalar()

            print("SPACE MIGRATION APPLIED:", migration_applied)
        else:
            print("SPACE MIGRATION APPLIED: UNKNOWN")

        tables = connection.execute(
            text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = current_schema()
                  AND table_name LIKE 'space_%'
                ORDER BY table_name
            """)
        ).scalars().all()

        print("\nSPACE TABLES:")
        if tables:
            for table in tables:
                print("  [OK]", table)
        else:
            print("  No Space tables found.")

    print("\nAUDIT COMPLETED.")


if __name__ == "__main__":
    main()
