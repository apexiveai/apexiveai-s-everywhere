
from getpass import getpass

from sqlalchemy import select

from app.core.security import hash_password
from app.database import SessionLocal
from app.models import User


def main() -> None:
    print("APEXIVEAI COMMUNITY - SUPER ADMIN PASSWORD RECOVERY")
    print("Existing system account only. No users will be deleted.")
    print()

    password = getpass("New password (minimum 12 characters): ")
    confirmation = getpass("Confirm new password: ")

    if password != confirmation:
        raise SystemExit("ERROR: Passwords do not match.")

    if len(password) < 12:
        raise SystemExit("ERROR: Password must be at least 12 characters.")

    if len(password.encode("utf-8")) > 72:
        raise SystemExit("ERROR: Password exceeds bcrypt's 72-byte limit.")

    password_hash = hash_password(password)
    del password
    del confirmation

    with SessionLocal.begin() as db:
        user = db.scalar(
            select(User).where(User.username == "system")
        )

        if user is None:
            raise SystemExit(
                "ERROR: Existing system account not found. No account changed."
            )

        user.password_hash = password_hash
        user.role = "SUPER_ADMIN"
        user.is_active = True
        user.tenant_id = None

        db.flush()
        user_id = user.id

    print()
    print("SUCCESS: Existing Super Admin password updated.")
    print(f"User ID: {user_id}")
    print("Username: system")
    print("Role: SUPER_ADMIN")
    print("Active: True")
    print("Password: [hidden]")


if __name__ == "__main__":
    main()
