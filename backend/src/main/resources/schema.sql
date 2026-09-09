-- MPLADS Sentinel Database Schema
-- Prototype / Synthetic Demonstration Data

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS risk_factors CASCADE;
DROP TABLE IF EXISTS risk_assessments CASCADE;
DROP TABLE IF EXISTS related_projects CASCADE;
DROP TABLE IF EXISTS project_progress CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    designation VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    project_id VARCHAR(50) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    description TEXT,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    constituency VARCHAR(150),
    location VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    sanctioned_amount DOUBLE PRECISION NOT NULL,
    estimated_cost DOUBLE PRECISION NOT NULL,
    expenditure_amount DOUBLE PRECISION DEFAULT 0.0,
    fund_utilization_percent DOUBLE PRECISION DEFAULT 0.0,
    progress_percentage DOUBLE PRECISION DEFAULT 0.0,
    expected_progress_percentage DOUBLE PRECISION DEFAULT 0.0,
    progress_gap DOUBLE PRECISION DEFAULT 0.0,
    sanction_date DATE,
    expected_completion_date DATE,
    delay_days INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    implementing_agency VARCHAR(150),
    contractor_name VARCHAR(150),
    payment_count INTEGER DEFAULT 0,
    risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    payment_date DATE NOT NULL,
    tranche_number INTEGER,
    disbursement_stage VARCHAR(100),
    beneficiary_account VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_progress (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    inspection_date DATE NOT NULL,
    physical_progress DOUBLE PRECISION NOT NULL,
    financial_progress DOUBLE PRECISION,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE related_projects (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    related_project_id VARCHAR(50) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,
    distance_km DOUBLE PRECISION,
    similarity_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE risk_assessments (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(project_id) ON DELETE CASCADE,
    risk_score INTEGER NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    rule_score INTEGER,
    if_score INTEGER,
    lof_score INTEGER,
    benford_score INTEGER,
    investigation_priority VARCHAR(50),
    recommended_action TEXT,
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE risk_factors (
    id BIGSERIAL PRIMARY KEY,
    assessment_id BIGINT REFERENCES risk_assessments(id) ON DELETE CASCADE,
    factor_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    score INTEGER NOT NULL,
    explanation TEXT NOT NULL
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    project_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
