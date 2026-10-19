CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX ix_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX ix_audit_logs_action ON audit_logs(action);
CREATE INDEX ix_audit_logs_created_at ON audit_logs(created_at);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    recipient_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(60) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX ix_notifications_recipient_user_id ON notifications(recipient_user_id);
CREATE INDEX ix_notifications_created_at ON notifications(created_at);

CREATE TABLE message_threads (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    recipient_tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    thread_type VARCHAR(30) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_message_threads_tenant_id ON message_threads(tenant_id);
CREATE INDEX ix_message_threads_recipient_tenant_id ON message_threads(recipient_tenant_id);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    read_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_messages_thread_id ON messages(thread_id);
CREATE INDEX ix_messages_created_at ON messages(created_at);
