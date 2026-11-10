CREATE TABLE IF NOT EXISTS daiichi_campaigns (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    campaign_type VARCHAR(20) NOT NULL DEFAULT 'DAILY',
    image_url VARCHAR(1000),
    cta_label VARCHAR(80) NOT NULL DEFAULT 'Request Information',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    approval_note TEXT,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_by INTEGER,
    approved_by INTEGER,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_daiichi_campaigns_campaign_type ON daiichi_campaigns (campaign_type);
CREATE INDEX IF NOT EXISTS ix_daiichi_campaigns_status ON daiichi_campaigns (status);
CREATE INDEX IF NOT EXISTS ix_daiichi_campaigns_approval_status ON daiichi_campaigns (approval_status);
CREATE INDEX IF NOT EXISTS ix_daiichi_campaigns_starts_at ON daiichi_campaigns (starts_at);
CREATE INDEX IF NOT EXISTS ix_daiichi_campaigns_ends_at ON daiichi_campaigns (ends_at);
CREATE INDEX IF NOT EXISTS ix_daiichi_campaign_publication ON daiichi_campaigns (status, approval_status, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS daiichi_campaign_audits (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    actor_user_id INTEGER,
    action VARCHAR(40) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_daiichi_campaign_audits_campaign_id ON daiichi_campaign_audits (campaign_id);
CREATE INDEX IF NOT EXISTS ix_daiichi_campaign_audits_action ON daiichi_campaign_audits (action);
CREATE INDEX IF NOT EXISTS ix_daiichi_campaign_audit_created ON daiichi_campaign_audits (campaign_id, created_at);
