-- 010: Enterprise Organization and Branch Management

CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    branch_type VARCHAR(50) NOT NULL DEFAULT 'office',
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state_region VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'Myanmar',
    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Yangon',
    is_headquarters BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_branches_tenant_code UNIQUE (tenant_id, branch_code)
);

CREATE INDEX IF NOT EXISTS ix_branches_tenant_id ON branches(tenant_id);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
    parent_department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    department_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    manager_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_departments_tenant_code UNIQUE (tenant_id, department_code)
);

CREATE INDEX IF NOT EXISTS ix_departments_tenant_id ON departments(tenant_id);
CREATE INDEX IF NOT EXISTS ix_departments_branch_id ON departments(branch_id);

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    team_lead_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_teams_tenant_id ON teams(tenant_id);
CREATE INDEX IF NOT EXISTS ix_teams_department_id ON teams(department_id);

CREATE TABLE IF NOT EXISTS employee_profiles (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(100) NOT NULL,
    job_title VARCHAR(200),
    employment_type VARCHAR(50) NOT NULL DEFAULT 'full_time',
    employment_status VARCHAR(50) NOT NULL DEFAULT 'active',
    hire_date DATE,
    termination_date DATE,
    phone VARCHAR(50),
    address TEXT,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_employee_profiles_tenant_code UNIQUE (tenant_id, employee_code),
    CONSTRAINT uq_employee_profiles_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS ix_employee_profiles_tenant_id ON employee_profiles(tenant_id);

CREATE TABLE IF NOT EXISTS user_branch_assignments (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_branch_assignment UNIQUE (user_id, branch_id)
);

CREATE INDEX IF NOT EXISTS ix_user_branch_assignments_tenant ON user_branch_assignments(tenant_id);
CREATE INDEX IF NOT EXISTS ix_user_branch_assignments_user ON user_branch_assignments(user_id);
CREATE INDEX IF NOT EXISTS ix_user_branch_assignments_branch ON user_branch_assignments(branch_id);