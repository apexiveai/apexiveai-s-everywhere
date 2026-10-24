-- ============================================================
-- 000_reconcile_core_schema.sql
-- ApexiveAI Community
--
-- Purpose:
--   Reconcile the existing Railway PostgreSQL schema with the
--   current SQLAlchemy application models.
--
-- IMPORTANT:
--   This migration DOES NOT drop existing core tables.
--   Existing users / tenants / subscriptions are preserved.
-- ============================================================


-- ============================================================
-- 1. TENANTS
-- Existing:
--   name, slug, created_at
--
-- Current model:
--   company_name, tenant_code, status,
--   contact_name, contact_email, contact_phone,
--   created_at, updated_at
-- ============================================================

ALTER TABLE tenants
    RENAME COLUMN name TO company_name;

ALTER TABLE tenants
    RENAME COLUMN slug TO tenant_code;

ALTER TABLE tenants
    ALTER COLUMN company_name TYPE VARCHAR(255);

ALTER TABLE tenants
    ALTER COLUMN tenant_code TYPE VARCHAR(100);

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE';

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255);

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(100);

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS ix_tenants_tenant_code
    ON tenants(tenant_code);


-- ============================================================
-- 2. USERS
-- Existing:
--   username, email, password_hash, display_name, bio,
--   is_active, is_admin, created_at, email_verified_at, tenant_id
--
-- Current model:
--   username, email, password_hash, role, tenant_id,
--   is_active, created_at, updated_at
--
-- Preserve old display_name/bio/is_admin/email_verified_at.
-- ============================================================

ALTER TABLE users
    ALTER COLUMN username TYPE VARCHAR(100);

ALTER TABLE users
    ALTER COLUMN email DROP NOT NULL;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(30);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE users
SET role =
    CASE
        WHEN is_admin = TRUE THEN 'SUPER_ADMIN'
        ELSE 'TENANT_ADMIN'
    END
WHERE role IS NULL;

ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'TENANT_ADMIN';

ALTER TABLE users
    ALTER COLUMN role SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username
    ON users(username);

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email
    ON users(email);


-- ============================================================
-- 3. USER -> TENANT FOREIGN KEY
-- Current model expects ON DELETE CASCADE.
--
-- Existing FK may use SET NULL.
-- Replace it with CASCADE.
-- ============================================================

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS fk_users_tenant_id;

ALTER TABLE users
    ADD CONSTRAINT fk_users_tenant_id
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE;


-- ============================================================
-- 4. SUBSCRIPTION PLANS
-- Existing:
--   product_key, name, description, monthly_price,
--   currency, billing_cycle, is_active, created_at
--
-- Current model:
--   code, name, billing_cycle, price_mmk,
--   minimum_months, is_active, created_at
-- ============================================================

ALTER TABLE subscription_plans
    RENAME COLUMN product_key TO code;

ALTER TABLE subscription_plans
    RENAME COLUMN monthly_price TO price_mmk;

ALTER TABLE subscription_plans
    ALTER COLUMN code TYPE VARCHAR(100);

ALTER TABLE subscription_plans
    ALTER COLUMN name TYPE VARCHAR(255);

ALTER TABLE subscription_plans
    ALTER COLUMN price_mmk TYPE INTEGER
    USING ROUND(price_mmk)::INTEGER;

ALTER TABLE subscription_plans
    ADD COLUMN IF NOT EXISTS minimum_months INTEGER
        NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS ix_subscription_plans_code
    ON subscription_plans(code);


-- ============================================================
-- 5. SUBSCRIPTIONS
-- Existing:
--   tenant_id, plan_id, status, price, currency,
--   billing_cycle, start_date, current_period_end,
--   cancelled_at, external_subscription_id,
--   created_at, updated_at
--
-- Current model expects:
--   tenant_id, plan_id, start_date, end_date,
--   status, created_at
--
-- Rename current_period_end -> end_date.
-- Keep existing billing/payment columns because they are
-- harmless and may be useful for future billing features.
-- ============================================================

ALTER TABLE subscriptions
    RENAME COLUMN current_period_end TO end_date;

ALTER TABLE subscriptions
    ALTER COLUMN status SET DEFAULT 'ACTIVE';


-- ============================================================
-- 6. SUBSCRIPTION FOREIGN KEYS
-- ============================================================

ALTER TABLE subscriptions
    DROP CONSTRAINT IF EXISTS subscriptions_plan_id_fkey;

ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_plan_id_fkey
    FOREIGN KEY (plan_id)
    REFERENCES subscription_plans(id)
    ON DELETE RESTRICT;

ALTER TABLE subscriptions
    DROP CONSTRAINT IF EXISTS subscriptions_tenant_id_fkey;

ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_tenant_id_fkey
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE;


-- ============================================================
-- 7. SOLUTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS solutions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    api_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_solutions_code
    ON solutions(code);


-- ============================================================
-- 8. TENANT SOLUTION ACCESS
-- ============================================================

CREATE TABLE IF NOT EXISTS tenant_solutions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL
        REFERENCES tenants(id) ON DELETE CASCADE,
    solution_id INTEGER NOT NULL
        REFERENCES solutions(id) ON DELETE CASCADE,
    granted BOOLEAN NOT NULL DEFAULT FALSE,
    granted_at TIMESTAMP WITHOUT TIME ZONE,
    granted_by INTEGER REFERENCES users(id),
    expires_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX IF NOT EXISTS ix_tenant_solutions_tenant_id
    ON tenant_solutions(tenant_id);

CREATE INDEX IF NOT EXISTS ix_tenant_solutions_solution_id
    ON tenant_solutions(solution_id);


-- ============================================================
-- 9. LICENSES
-- ============================================================

CREATE TABLE IF NOT EXISTS licenses (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL
        REFERENCES tenants(id) ON DELETE CASCADE,
    license_key VARCHAR(255) NOT NULL UNIQUE,
    license_type VARCHAR(50) NOT NULL DEFAULT 'SUBSCRIPTION',
    issued_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    max_users INTEGER NOT NULL DEFAULT 5,
    max_devices INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INTEGER NOT NULL
        REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS ix_licenses_tenant_id
    ON licenses(tenant_id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_licenses_license_key
    ON licenses(license_key);


-- ============================================================
-- 10. AUDIT LOGS
--
-- Existing legacy columns:
--   actor, resource, resource_id, details(JSON)
--
-- Current model:
--   actor_id, tenant_id, action, entity_type,
--   entity_id, details(TEXT), created_at
--
-- We preserve legacy columns and add the current columns.
-- ============================================================

ALTER TABLE audit_logs
    ADD COLUMN IF NOT EXISTS actor_id INTEGER;

ALTER TABLE audit_logs
    ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

ALTER TABLE audit_logs
    ADD COLUMN IF NOT EXISTS entity_type VARCHAR(100);

ALTER TABLE audit_logs
    ADD COLUMN IF NOT EXISTS entity_id VARCHAR(100);

ALTER TABLE audit_logs
    ADD COLUMN IF NOT EXISTS details_text TEXT;

ALTER TABLE audit_logs
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE
        NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Current SQLAlchemy model uses "details" as TEXT.
-- Existing legacy "details" is JSON.
-- Rename legacy JSON column and create a TEXT column.
ALTER TABLE audit_logs
    RENAME COLUMN details TO legacy_details;

ALTER TABLE audit_logs
    ADD COLUMN IF NOT EXISTS details TEXT;

-- Populate entity_type/entity_id from legacy data where possible.
UPDATE audit_logs
SET entity_type = COALESCE(entity_type, resource),
    entity_id = COALESCE(entity_id, resource_id),
    details = COALESCE(details, legacy_details::TEXT)
WHERE entity_type IS NULL
   OR entity_id IS NULL
   OR details IS NULL;

ALTER TABLE audit_logs
    ALTER COLUMN entity_type SET DEFAULT 'system';

CREATE INDEX IF NOT EXISTS ix_audit_logs_actor_id
    ON audit_logs(actor_id);

CREATE INDEX IF NOT EXISTS ix_audit_logs_tenant_id
    ON audit_logs(tenant_id);

CREATE INDEX IF NOT EXISTS ix_audit_logs_entity_type
    ON audit_logs(entity_type);

CREATE INDEX IF NOT EXISTS ix_audit_logs_created_at
    ON audit_logs(created_at);

ALTER TABLE audit_logs
    DROP CONSTRAINT IF EXISTS audit_logs_actor_id_fkey;

ALTER TABLE audit_logs
    ADD CONSTRAINT audit_logs_actor_id_fkey
    FOREIGN KEY (actor_id)
    REFERENCES users(id)
    ON DELETE SET NULL;

ALTER TABLE audit_logs
    DROP CONSTRAINT IF EXISTS audit_logs_tenant_id_fkey;

ALTER TABLE audit_logs
    ADD CONSTRAINT audit_logs_tenant_id_fkey
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE SET NULL;


-- ============================================================
-- 11. NOTIFICATIONS
--
-- Existing:
--   recipient_id, actor_id, type, title, message,
--   link, entity_type, entity_id, is_read, created_at
--
-- Current model:
--   tenant_id, recipient_user_id, notification_type,
--   title, body, read_at, created_at
--
-- Preserve existing columns and add current model columns.
-- ============================================================

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS tenant_id INTEGER;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS recipient_user_id INTEGER;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS notification_type VARCHAR(60);

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS body TEXT;

ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITHOUT TIME ZONE;

-- Convert existing notification data into the current model fields.
UPDATE notifications
SET recipient_user_id = COALESCE(recipient_user_id, recipient_id),
    notification_type = COALESCE(notification_type, type),
    body = COALESCE(body, message)
WHERE recipient_user_id IS NULL
   OR notification_type IS NULL
   OR body IS NULL;

-- Current model requires these fields.
ALTER TABLE notifications
    ALTER COLUMN recipient_user_id SET NOT NULL;

ALTER TABLE notifications
    ALTER COLUMN notification_type SET NOT NULL;

ALTER TABLE notifications
    ALTER COLUMN body SET NOT NULL;

CREATE INDEX IF NOT EXISTS ix_notifications_tenant_id
    ON notifications(tenant_id);

CREATE INDEX IF NOT EXISTS ix_notifications_recipient_user_id
    ON notifications(recipient_user_id);

CREATE INDEX IF NOT EXISTS ix_notifications_notification_type
    ON notifications(notification_type);

CREATE INDEX IF NOT EXISTS ix_notifications_created_at
    ON notifications(created_at);

ALTER TABLE notifications
    DROP CONSTRAINT IF EXISTS notifications_recipient_user_id_fkey;

ALTER TABLE notifications
    ADD CONSTRAINT notifications_recipient_user_id_fkey
    FOREIGN KEY (recipient_user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE notifications
    DROP CONSTRAINT IF EXISTS notifications_tenant_id_fkey;

ALTER TABLE notifications
    ADD CONSTRAINT notifications_tenant_id_fkey
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE;


-- ============================================================
-- 12. MESSAGE THREADS
-- ============================================================

CREATE TABLE IF NOT EXISTS message_threads (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL
        REFERENCES tenants(id) ON DELETE CASCADE,
    recipient_tenant_id INTEGER
        REFERENCES tenants(id) ON DELETE CASCADE,
    thread_type VARCHAR(30) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    created_by INTEGER NOT NULL
        REFERENCES users(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_message_threads_tenant_id
    ON message_threads(tenant_id);

CREATE INDEX IF NOT EXISTS ix_message_threads_recipient_tenant_id
    ON message_threads(recipient_tenant_id);


-- ============================================================
-- 13. MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL
        REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL
        REFERENCES users(id),
    body TEXT NOT NULL,
    read_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_messages_thread_id
    ON messages(thread_id);

CREATE INDEX IF NOT EXISTS ix_messages_created_at
    ON messages(created_at);


-- ============================================================
-- 14. SAFETY CHECKS / CURRENT USER NORMALIZATION
-- ============================================================

UPDATE users
SET role = 'SUPER_ADMIN'
WHERE is_admin = TRUE
  AND (role IS NULL OR role = 'TENANT_ADMIN');

UPDATE users
SET updated_at = created_at
WHERE updated_at IS NULL;


-- ============================================================
-- END
-- ============================================================