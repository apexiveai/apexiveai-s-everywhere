CREATE TABLE IF NOT EXISTS daiichi_lead_status_history (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL,
    actor_user_id INTEGER,
    from_status VARCHAR(20) NOT NULL,
    to_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_daiichi_lead_status_history_lead_id
    ON daiichi_lead_status_history (lead_id);

CREATE INDEX IF NOT EXISTS ix_daiichi_lead_status_history_created_at
    ON daiichi_lead_status_history (created_at);

UPDATE daiichi_leads
SET status = 'CLOSED_LOST'
WHERE status = 'REJECTED';
