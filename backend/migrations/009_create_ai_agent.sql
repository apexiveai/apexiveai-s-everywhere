
CREATE TABLE IF NOT EXISTS ai_conversations (
    id VARCHAR(36) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    public_session_hash VARCHAR(64),
    title VARCHAR(255) NOT NULL DEFAULT 'New conversation',
    provider VARCHAR(30) NOT NULL DEFAULT 'cloud',
    model VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_ai_conversations_user
ON ai_conversations(user_id);

CREATE INDEX IF NOT EXISTS ix_ai_conversations_tenant
ON ai_conversations(tenant_id);

CREATE INDEX IF NOT EXISTS ix_ai_conversations_session
ON ai_conversations(public_session_hash);

CREATE INDEX IF NOT EXISTS ix_ai_conversations_tenant_updated
ON ai_conversations(tenant_id, updated_at);

CREATE TABLE IF NOT EXISTS ai_messages (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL
        REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    provider VARCHAR(30),
    model VARCHAR(150),
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_ai_messages_conversation
ON ai_messages(conversation_id);

CREATE INDEX IF NOT EXISTS ix_ai_messages_conversation_created
ON ai_messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS ai_usage (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36)
        REFERENCES ai_conversations(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    provider VARCHAR(30) NOT NULL,
    model VARCHAR(150) NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    estimated_cost NUMERIC(12, 6) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_ai_usage_conversation
ON ai_usage(conversation_id);

CREATE INDEX IF NOT EXISTS ix_ai_usage_user
ON ai_usage(user_id);

CREATE INDEX IF NOT EXISTS ix_ai_usage_tenant
ON ai_usage(tenant_id);
