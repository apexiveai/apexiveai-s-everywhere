CREATE TABLE IF NOT EXISTS security_guard_inquiries (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    organization VARCHAR(200),
    phone VARCHAR(40) NOT NULL,
    email VARCHAR(254),
    guard_level VARCHAR(1) NOT NULL CHECK (guard_level IN ('A', 'B', 'C', 'D', 'E', 'F')),
    personnel_count INTEGER NOT NULL CHECK (personnel_count BETWEEN 1 AND 500),
    inquiry TEXT,
    consent_given BOOLEAN NOT NULL,
    consent_text_version VARCHAR(30) NOT NULL DEFAULT 'v1',
    consent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_security_guard_inquiries_phone
    ON security_guard_inquiries (phone);

CREATE INDEX IF NOT EXISTS ix_security_guard_inquiries_created_at
    ON security_guard_inquiries (created_at);

CREATE INDEX IF NOT EXISTS ix_security_guard_inquiries_created_id
    ON security_guard_inquiries (created_at, id);
