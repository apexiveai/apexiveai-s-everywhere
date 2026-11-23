
-- =========================================================
-- APEXIVEAI SPACE
-- Migration 012: Enterprise Space Core Foundation
-- PostgreSQL
-- =========================================================

-- 1. SPACE ORGANIZATIONS
CREATE TABLE IF NOT EXISTS space_organizations (
    id BIGSERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL
        REFERENCES tenants(id) ON DELETE CASCADE,

    organization_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(50) NOT NULL DEFAULT 'PRIVATE',
    country VARCHAR(100),
    description TEXT,

    contact_email VARCHAR(255),
    contact_phone VARCHAR(100),

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_space_org_tenant_code
        UNIQUE (tenant_id, organization_code),

    CONSTRAINT uq_space_org_id_tenant
        UNIQUE (id, tenant_id)
);

CREATE INDEX IF NOT EXISTS ix_space_org_tenant
    ON space_organizations(tenant_id);

CREATE INDEX IF NOT EXISTS ix_space_org_status
    ON space_organizations(status);


-- 2. SATELLITE REGISTRY
CREATE TABLE IF NOT EXISTS space_satellites (
    id BIGSERIAL PRIMARY KEY,

    tenant_id INTEGER NOT NULL,
    organization_id BIGINT NOT NULL,

    satellite_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,

    international_designator VARCHAR(100),
    norad_catalog_id INTEGER,

    satellite_type VARCHAR(80),
    manufacturer VARCHAR(255),

    launch_date DATE,
    launch_vehicle VARCHAR(255),
    launch_site VARCHAR(255),

    orbit_type VARCHAR(50),
    orbit_altitude_km NUMERIC(12,3),
    orbit_inclination_deg NUMERIC(9,5),
    orbital_period_minutes NUMERIC(10,3),

    operational_status VARCHAR(40) NOT NULL DEFAULT 'PLANNED',

    mission_description TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_space_satellite_org_tenant
        FOREIGN KEY (organization_id, tenant_id)
        REFERENCES space_organizations(id, tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_space_satellite_tenant_code
        UNIQUE (tenant_id, satellite_code),

    CONSTRAINT uq_space_satellite_id_tenant
        UNIQUE (id, tenant_id),

    CONSTRAINT ck_space_satellite_status
        CHECK (operational_status IN (
            'PLANNED',
            'INTEGRATION',
            'READY',
            'OPERATIONAL',
            'DEGRADED',
            'MAINTENANCE',
            'DECOMMISSIONED',
            'LOST'
        )),

    CONSTRAINT ck_space_satellite_altitude
        CHECK (orbit_altitude_km IS NULL OR orbit_altitude_km >= 0)
);

CREATE INDEX IF NOT EXISTS ix_space_satellite_tenant
    ON space_satellites(tenant_id);

CREATE INDEX IF NOT EXISTS ix_space_satellite_org
    ON space_satellites(organization_id);

CREATE INDEX IF NOT EXISTS ix_space_satellite_status
    ON space_satellites(operational_status);

CREATE INDEX IF NOT EXISTS ix_space_satellite_metadata
    ON space_satellites USING GIN(metadata);


-- 3. GROUND STATIONS
CREATE TABLE IF NOT EXISTS space_ground_stations (
    id BIGSERIAL PRIMARY KEY,

    tenant_id INTEGER NOT NULL,
    organization_id BIGINT NOT NULL,

    station_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,

    country VARCHAR(100),
    city VARCHAR(150),

    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    altitude_meters NUMERIC(12,3),

    antenna_type VARCHAR(100),
    antenna_diameter_meters NUMERIC(10,3),

    frequency_bands JSONB NOT NULL DEFAULT '[]'::jsonb,

    operational_status VARCHAR(40) NOT NULL DEFAULT 'PLANNED',

    contact_email VARCHAR(255),
    description TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_space_station_org_tenant
        FOREIGN KEY (organization_id, tenant_id)
        REFERENCES space_organizations(id, tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_space_station_tenant_code
        UNIQUE (tenant_id, station_code),

    CONSTRAINT uq_space_station_id_tenant
        UNIQUE (id, tenant_id),

    CONSTRAINT ck_space_station_latitude
        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),

    CONSTRAINT ck_space_station_longitude
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),

    CONSTRAINT ck_space_station_status
        CHECK (operational_status IN (
            'PLANNED',
            'OPERATIONAL',
            'DEGRADED',
            'MAINTENANCE',
            'OFFLINE',
            'DECOMMISSIONED'
        ))
);

CREATE INDEX IF NOT EXISTS ix_space_station_tenant
    ON space_ground_stations(tenant_id);

CREATE INDEX IF NOT EXISTS ix_space_station_org
    ON space_ground_stations(organization_id);


-- 4. MISSION MANAGEMENT
CREATE TABLE IF NOT EXISTS space_missions (
    id BIGSERIAL PRIMARY KEY,

    tenant_id INTEGER NOT NULL,
    organization_id BIGINT NOT NULL,

    mission_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,

    mission_type VARCHAR(80) NOT NULL,
    description TEXT,

    objective TEXT,

    priority VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    status VARCHAR(40) NOT NULL DEFAULT 'DRAFT',

    planned_start_at TIMESTAMPTZ,
    planned_end_at TIMESTAMPTZ,

    actual_start_at TIMESTAMPTZ,
    actual_end_at TIMESTAMPTZ,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_space_mission_org_tenant
        FOREIGN KEY (organization_id, tenant_id)
        REFERENCES space_organizations(id, tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_space_mission_tenant_code
        UNIQUE (tenant_id, mission_code),

    CONSTRAINT uq_space_mission_id_tenant
        UNIQUE (id, tenant_id),

    CONSTRAINT ck_space_mission_status
        CHECK (status IN (
            'DRAFT',
            'PLANNED',
            'APPROVED',
            'SCHEDULED',
            'IN_PROGRESS',
            'ON_HOLD',
            'COMPLETED',
            'FAILED',
            'CANCELLED'
        )),

    CONSTRAINT ck_space_mission_priority
        CHECK (priority IN (
            'LOW',
            'NORMAL',
            'HIGH',
            'CRITICAL'
        )),

    CONSTRAINT ck_space_mission_dates
        CHECK (
            planned_end_at IS NULL
            OR planned_start_at IS NULL
            OR planned_end_at >= planned_start_at
        )
);

CREATE INDEX IF NOT EXISTS ix_space_mission_tenant
    ON space_missions(tenant_id);

CREATE INDEX IF NOT EXISTS ix_space_mission_org
    ON space_missions(organization_id);

CREATE INDEX IF NOT EXISTS ix_space_mission_status
    ON space_missions(status);


-- 5. MISSION SATELLITE ASSIGNMENTS
CREATE TABLE IF NOT EXISTS space_mission_satellites (
    id BIGSERIAL PRIMARY KEY,

    tenant_id INTEGER NOT NULL,
    mission_id BIGINT NOT NULL,
    satellite_id BIGINT NOT NULL,

    assignment_role VARCHAR(100) NOT NULL DEFAULT 'PRIMARY',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_space_assignment_mission
        FOREIGN KEY (mission_id, tenant_id)
        REFERENCES space_missions(id, tenant_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_space_assignment_satellite
        FOREIGN KEY (satellite_id, tenant_id)
        REFERENCES space_satellites(id, tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_space_mission_satellite
        UNIQUE (mission_id, satellite_id)
);

CREATE INDEX IF NOT EXISTS ix_space_assignment_tenant
    ON space_mission_satellites(tenant_id);


-- 6. MISSION SCHEDULING
CREATE TABLE IF NOT EXISTS space_mission_schedules (
    id BIGSERIAL PRIMARY KEY,

    tenant_id INTEGER NOT NULL,
    mission_id BIGINT NOT NULL,
    ground_station_id BIGINT,

    schedule_code VARCHAR(100) NOT NULL,

    scheduled_start_at TIMESTAMPTZ NOT NULL,
    scheduled_end_at TIMESTAMPTZ NOT NULL,

    schedule_status VARCHAR(30) NOT NULL DEFAULT 'PLANNED',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_space_schedule_mission
        FOREIGN KEY (mission_id, tenant_id)
        REFERENCES space_missions(id, tenant_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_space_schedule_station
        FOREIGN KEY (ground_station_id, tenant_id)
        REFERENCES space_ground_stations(id, tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_space_schedule_code
        UNIQUE (tenant_id, schedule_code),

    CONSTRAINT ck_space_schedule_dates
        CHECK (scheduled_end_at > scheduled_start_at),

    CONSTRAINT ck_space_schedule_status
        CHECK (schedule_status IN (
            'PLANNED',
            'CONFIRMED',
            'ACTIVE',
            'COMPLETED',
            'CANCELLED'
        ))
);

CREATE INDEX IF NOT EXISTS ix_space_schedule_mission
    ON space_mission_schedules(mission_id);

CREATE INDEX IF NOT EXISTS ix_space_schedule_tenant_time
    ON space_mission_schedules(tenant_id, scheduled_start_at);


-- 7. TELEMETRY INFRASTRUCTURE
CREATE TABLE IF NOT EXISTS space_telemetry (
    id BIGSERIAL PRIMARY KEY,

    tenant_id INTEGER NOT NULL,
    satellite_id BIGINT NOT NULL,

    telemetry_type VARCHAR(100) NOT NULL,

    observed_at TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    numeric_value DOUBLE PRECISION,
    text_value TEXT,

    unit VARCHAR(50),
    quality VARCHAR(30) NOT NULL DEFAULT 'UNKNOWN',

    source VARCHAR(100),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    CONSTRAINT fk_space_telemetry_satellite
        FOREIGN KEY (satellite_id, tenant_id)
        REFERENCES space_satellites(id, tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_space_telemetry_quality
        CHECK (quality IN (
            'UNKNOWN',
            'VALID',
            'SUSPECT',
            'INVALID'
        ))
);

CREATE INDEX IF NOT EXISTS ix_space_telemetry_satellite_time
    ON space_telemetry(satellite_id, observed_at DESC);

CREATE INDEX IF NOT EXISTS ix_space_telemetry_tenant
    ON space_telemetry(tenant_id);


-- 8. AUDIT LOG
CREATE TABLE IF NOT EXISTS space_audit_logs (
    id BIGSERIAL PRIMARY KEY,

    tenant_id INTEGER NOT NULL
        REFERENCES tenants(id) ON DELETE CASCADE,

    user_id INTEGER
        REFERENCES users(id) ON DELETE SET NULL,

    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),

    ip_address VARCHAR(64),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_space_audit_tenant_time
    ON space_audit_logs(tenant_id, created_at DESC);


-- 9. REGISTER SPACE AS A COMMUNITY SOLUTION
INSERT INTO solutions (
    code,
    name,
    description,
    api_url,
    is_active,
    created_at
)
VALUES (
    'APEXIVEAI_SPACE',
    'ApexiveAI Space',
    'Enterprise Space Technology and Intelligence Platform',
    '/api/space',
    TRUE,
    NOW()
)
ON CONFLICT (code) DO NOTHING;
