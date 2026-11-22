
-- 011: HR Attendance and Leave Management

CREATE TABLE IF NOT EXISTS hr_leave_types (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    annual_allowance NUMERIC(8,2) NOT NULL DEFAULT 0,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_hr_leave_types_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS hr_leave_balances (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_profile_id INTEGER NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES hr_leave_types(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    entitled_days NUMERIC(8,2) NOT NULL DEFAULT 0,
    used_days NUMERIC(8,2) NOT NULL DEFAULT 0,
    pending_days NUMERIC(8,2) NOT NULL DEFAULT 0,
    carried_forward_days NUMERIC(8,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_hr_leave_balance UNIQUE (employee_profile_id, leave_type_id, year)
);

CREATE TABLE IF NOT EXISTS hr_leave_requests (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_profile_id INTEGER NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES hr_leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(8,2) NOT NULL,
    reason TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_hr_leave_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_hr_leave_days CHECK (total_days > 0)
);

CREATE TABLE IF NOT EXISTS hr_attendance_records (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_profile_id INTEGER NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    break_minutes INTEGER NOT NULL DEFAULT 0,
    worked_minutes INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'present',
    source VARCHAR(30) NOT NULL DEFAULT 'manual',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_hr_attendance_employee_date UNIQUE (employee_profile_id, attendance_date),
    CONSTRAINT chk_hr_attendance_break CHECK (break_minutes >= 0),
    CONSTRAINT chk_hr_attendance_worked CHECK (worked_minutes >= 0)
);

CREATE TABLE IF NOT EXISTS hr_attendance_adjustments (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    attendance_record_id INTEGER NOT NULL REFERENCES hr_attendance_records(id) ON DELETE CASCADE,
    requested_by INTEGER NOT NULL REFERENCES users(id),
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    old_check_in TIMESTAMP,
    new_check_in TIMESTAMP,
    old_check_out TIMESTAMP,
    new_check_out TIMESTAMP,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hr_shifts (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_minutes INTEGER NOT NULL DEFAULT 60,
    grace_period_minutes INTEGER NOT NULL DEFAULT 10,
    is_overnight BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_hr_shift_break CHECK (break_minutes >= 0),
    CONSTRAINT chk_hr_shift_grace CHECK (grace_period_minutes >= 0)
);

CREATE TABLE IF NOT EXISTS hr_employee_shifts (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_profile_id INTEGER NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
    shift_id INTEGER NOT NULL REFERENCES hr_shifts(id),
    effective_from DATE NOT NULL,
    effective_until DATE,
    assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_hr_employee_shift_dates CHECK (
        effective_until IS NULL OR effective_until >= effective_from
    )
);

CREATE TABLE IF NOT EXISTS hr_holidays (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    holiday_date DATE NOT NULL,
    description TEXT,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS ix_hr_leave_requests_tenant
    ON hr_leave_requests(tenant_id);

CREATE INDEX IF NOT EXISTS ix_hr_leave_requests_employee
    ON hr_leave_requests(employee_profile_id);

CREATE INDEX IF NOT EXISTS ix_hr_leave_requests_status
    ON hr_leave_requests(status);

CREATE INDEX IF NOT EXISTS ix_hr_attendance_tenant_date
    ON hr_attendance_records(tenant_id, attendance_date);

CREATE INDEX IF NOT EXISTS ix_hr_attendance_employee
    ON hr_attendance_records(employee_profile_id);

CREATE INDEX IF NOT EXISTS ix_hr_attendance_adjustments_record
    ON hr_attendance_adjustments(attendance_record_id);

CREATE INDEX IF NOT EXISTS ix_hr_employee_shifts_employee
    ON hr_employee_shifts(employee_profile_id);

CREATE INDEX IF NOT EXISTS ix_hr_holidays_tenant_date
    ON hr_holidays(tenant_id, holiday_date);
