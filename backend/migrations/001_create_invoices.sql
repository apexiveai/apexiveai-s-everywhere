CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(40) NOT NULL UNIQUE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_type VARCHAR(40) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    description TEXT NOT NULL,
    payment_instructions TEXT,
    plan_id INTEGER REFERENCES subscription_plans(id),
    solution_id INTEGER REFERENCES solutions(id),
    duration_months INTEGER,
    status VARCHAR(30) NOT NULL DEFAULT 'ISSUED',
    due_at TIMESTAMP WITHOUT TIME ZONE,
    payment_reference VARCHAR(255),
    payer_name VARCHAR(255),
    amount_reported NUMERIC(14, 2),
    currency_reported VARCHAR(3),
    payment_reported_at TIMESTAMP WITHOUT TIME ZONE,
    review_note TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ix_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX ix_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX ix_invoices_status ON invoices(status);
CREATE UNIQUE INDEX ix_invoices_payment_reference ON invoices(payment_reference);
