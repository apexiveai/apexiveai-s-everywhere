
CREATE TABLE IF NOT EXISTS daiichi_leads (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    email VARCHAR(254),
    inquiry TEXT,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    consent_text_version VARCHAR(30) NOT NULL DEFAULT 'v1',
    consent_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    admin_note TEXT,
    source VARCHAR(80) NOT NULL DEFAULT 'daiichi_partner_page',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_daiichi_leads_phone
    ON daiichi_leads (phone);

CREATE INDEX IF NOT EXISTS ix_daiichi_leads_status
    ON daiichi_leads (status);

CREATE INDEX IF NOT EXISTS ix_daiichi_leads_created_at
    ON daiichi_leads (created_at);

CREATE INDEX IF NOT EXISTS ix_daiichi_leads_created_status
    ON daiichi_leads (created_at, status);


CREATE TABLE IF NOT EXISTS daiichi_analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(30) NOT NULL,
    campaign_key VARCHAR(80) NOT NULL DEFAULT 'main',
    page_path VARCHAR(250) NOT NULL DEFAULT '/partners/daiichi',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_daiichi_events_event_type
    ON daiichi_analytics_events (event_type);

CREATE INDEX IF NOT EXISTS ix_daiichi_events_created_at
    ON daiichi_analytics_events (created_at);

CREATE INDEX IF NOT EXISTS ix_daiichi_events_type_created
    ON daiichi_analytics_events (event_type, created_at);
