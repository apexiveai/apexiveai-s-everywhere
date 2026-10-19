
from getpass import getpass

from sqlalchemy import func, select, text

from app.core.security import hash_password
from app.database import SessionLocal
from app.models import User


def main() -> None:
    print("APEXIVEAI COMMUNITY - FIRST SUPER ADMIN SETUP")
    print("Password input will be hidden.")
    print()

    username = input("Super Admin username: ").strip()
    email = input("Super Admin email (optional): ").strip().lower() or None

    if not username or len(username) > 100:
        raise SystemExit("ERROR: Username must contain 1-100 characters.")

    password = getpass("Super Admin password (minimum 12 characters): ")
    confirmation = getpass("Confirm password: ")

    if password != confirmation:
        raise SystemExit("ERROR: Passwords do not match.")

    if len(password) < 12:
        raise SystemExit("ERROR: Password must be at least 12 characters.")

    # bcrypt has a 72-byte input limit; check UTF-8 bytes explicitly.
    if len(password.encode("utf-8")) > 72:
        raise SystemExit("ERROR: Password must not exceed 72 UTF-8 bytes.")

    password_hash = hash_password(password)
    del password
    del confirmation

    with SessionLocal.begin() as db:
        # Serialize simultaneous bootstrap attempts on PostgreSQL.
        db.execute(text("SELECT pg_advisory_xact_lock(824731902)"))

        user_count = db.scalar(select(func.count()).select_from(User)) or 0

        if user_count != 0:
            raise SystemExit(
                "REFUSED: users table is not empty. "
                "No account was created."
            )

        admin = User(
            username=username,
            email=email,
            password_hash=password_hash,
            role="SUPER_ADMIN",
            tenant_id=None,
            is_active=True,
        )

        db.add(admin)
        db.flush()

        created_id = admin.id

    print()
    print("SUPER ADMIN CREATED SUCCESSFULLY")
    print(f"User ID: {created_id}")
    print(f"Username: {username}")
    print(f"Role: SUPER_ADMIN")
    print("Tenant ID: None")
    print("Password: [hidden]")
    print("Next step: test the login API.")


if __name__ == "__main__":
    main()
