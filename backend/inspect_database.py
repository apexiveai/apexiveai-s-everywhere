
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise RuntimeError("DATABASE_URL is missing from .env")

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    connect_args={"sslmode": "require"}
)

try:
    with engine.connect() as connection:
        print("\n===================================")
        print("APEXIVEAI COMMUNITY DATABASE CHECK")
        print("===================================")

        print("Database:", connection.execute(
            text("SELECT current_database()")
        ).scalar())

        print("Schema:", connection.execute(
            text("SELECT current_schema()")
        ).scalar())

        inspector = inspect(connection)

        tables = inspector.get_table_names(schema="public")

        print("\nTOTAL TABLES:", len(tables))

        for index, table in enumerate(sorted(tables), 1):
            columns = inspector.get_columns(table, schema="public")
            foreign_keys = inspector.get_foreign_keys(
                table, schema="public"
            )
            indexes = inspector.get_indexes(
                table, schema="public"
            )

            print(f"\n{index}. TABLE: {table}")
            print("   Columns:", len(columns))
            print("   Foreign Keys:", len(foreign_keys))
            print("   Indexes:", len(indexes))

            for column in columns:
                print(
                    f"      - {column['name']}: "
                    f"{column['type']}"
                )

        print("\n===================================")
        print("DATABASE INSPECTION COMPLETED")
        print("===================================")

finally:
    engine.dispose()
