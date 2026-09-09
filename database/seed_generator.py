# -*- coding: utf-8 -*-
import os
import json
import random
from datetime import datetime, timedelta

random.seed(42)

DISTRICTS = [
    {"state": "Maharashtra", "district": "Pune", "constituency": "Pune Parliamentary Constituency", "lat": 18.5204, "lon": 73.8567},
    {"state": "Maharashtra", "district": "Mumbai Suburban", "constituency": "Mumbai North", "lat": 19.1136, "lon": 72.8697},
    {"state": "Maharashtra", "district": "Nagpur", "constituency": "Nagpur Lok Sabha", "lat": 21.1458, "lon": 79.0882},
    {"state": "Karnataka", "district": "Bengaluru Urban", "constituency": "Bangalore South", "lat": 12.9716, "lon": 77.5946},
    {"state": "Karnataka", "district": "Mysuru", "constituency": "Mysore Lok Sabha", "lat": 12.2958, "lon": 76.6394},
    {"state": "Uttar Pradesh", "district": "Lucknow", "constituency": "Lucknow Parliamentary Constituency", "lat": 26.8467, "lon": 80.9462},
    {"state": "Uttar Pradesh", "district": "Varanasi", "constituency": "Varanasi Lok Sabha", "lat": 25.3176, "lon": 82.9739},
    {"state": "Delhi", "district": "New Delhi", "constituency": "New Delhi Lok Sabha", "lat": 28.6139, "lon": 77.2090},
    {"state": "Tamil Nadu", "district": "Chennai", "constituency": "Chennai Central", "lat": 13.0827, "lon": 80.2707},
    {"state": "Gujarat", "district": "Ahmedabad", "constituency": "Ahmedabad East", "lat": 23.0225, "lon": 72.5714},
    {"state": "Rajasthan", "district": "Jaipur", "constituency": "Jaipur Urban", "lat": 26.9124, "lon": 75.7873},
    {"state": "West Bengal", "district": "Kolkata", "constituency": "Kolkata South", "lat": 22.5726, "lon": 88.3639},
    {"state": "Bihar", "district": "Patna", "constituency": "Patna Sahib", "lat": 25.5941, "lon": 85.1376},
    {"state": "Telangana", "district": "Hyderabad", "constituency": "Hyderabad Lok Sabha", "lat": 17.3850, "lon": 78.4867}
]

CATEGORIES = [
    ("Drinking Water", ["Installation of Solar RO Water Plant", "Borewell Drilling and Piped Distribution", "Community Overhead Water Tank", "Water Purification Facility in Slum Area"]),
    ("Sanitation", ["Public Community Toilet Block Construction", "Underground Drainage and Sewer Line", "Solid Waste Segregation Shed", "Sanitation Facility at Govt School"]),
    ("Community Infrastructure", ["Construction of Community Infrastructure", "Ward Multipurpose Shed Construction", "Community Hall Renovation Work", "Senior Citizen Recreation Center", "Gram Panchayat Skill Center"]),
    ("Education", ["Construction of Additional Classrooms", "Smart Class Setup at ZP School", "Public Library and Study Hall", "Science Lab Equipment and Building"]),
    ("Roads and Pathways", ["CC Paver Road and Stormwater Drain", "Bituminous Road Construction", "Foot Overbridge Construction", "Link Road Concreting in Rural Ward"]),
    ("Health and Family Welfare", ["Primary Health Center Maternity Wing", "Sub-District Hospital Diagnostic Wing", "Mobile Medical Van and Shelter", "Urban Dispensary Renovation"]),
    ("Irrigation Facilities", ["Check Dam Construction on Nala", "Minor Lift Irrigation Pipeline", "Farm Pond and Recharge Well", "Canal Lining and Sluice Gate"]),
    ("Electricity and Energy", ["High Mast Solar LED Streetlighting", "Distribution Transformer Installation", "Rooftop Solar PV on Govt Building", "Rural Feeder Strengthening"])
]

AGENCIES = [
    "Public Works Division - Infrastructure",
    "Rural Development & Panchayat Raj Agency",
    "Municipal Corporation Engineering Cell",
    "Zilla Parishad Works Department",
    "Minor Irrigation Project Division",
    "State Water Supply & Sewerage Board"
]

CONTRACTORS = [
    "Apex Infrastructure & Civil Works Ltd.",
    "Bharat Nirman Enterprises",
    "Vanguard Engineering & Constructions",
    "Shree Ganesh Developers & Contractors",
    "Pragati Civil Projects Pvt. Ltd.",
    "National InfraTech Services"
]

def generate_projects(total_count=1200):
    projects = []
    payments = []
    progress_records = []
    related_projects = []
    
    # 1. FLAGSHIP DEMO PROJECT: MPL-10482
    flagship = {
        "projectId": "MPL-10482",
        "projectName": "Construction of Community Infrastructure",
        "projectType": "Community Infrastructure",
        "description": "Construction of multi-purpose community resource centre and auditorium with audiovisual setup",
        "state": "Maharashtra",
        "district": "Pune",
        "constituency": "Pune Parliamentary Constituency",
        "location": "Ward 14, Haveli Taluka, Pune",
        "latitude": 18.52043,
        "longitude": 73.85674,
        "sanctionedAmount": 3000000.0,
        "estimatedCost": 3000000.0,
        "expenditureAmount": 2600000.0,
        "fundUtilizationPercent": 86.67,
        "progressPercentage": 38.0,
        "expectedProgressPercentage": 80.0,
        "progressGap": 42.0,
        "sanctionDate": "2024-04-10",
        "expectedCompletionDate": "2025-10-15",
        "delayDays": 137,
        "status": "DELAYED",
        "implementingAgency": "Public Works Division - Central Pune",
        "contractorName": "Apex Infrastructure & Civil Works Ltd.",
        "paymentCount": 12,
        "riskScore": 94,
        "riskLevel": "CRITICAL"
    }
    projects.append(flagship)
    
    # Flagship payments (Unusual clustered amounts with leading digit 2)
    demo_pmts = [240000.0, 250000.0, 245000.0, 260000.0, 248000.0, 510000.0, 520000.0, 890000.0, 920000.0, 230000.0, 240000.0, 150000.0]
    s_date = datetime(2024, 4, 15)
    for idx, amt in enumerate(demo_pmts):
        pmt_date = s_date + timedelta(days=idx * 40)
        payments.append({
            "paymentId": f"PMT-10482-{idx+1:02d}",
            "projectId": "MPL-10482",
            "amount": amt,
            "paymentDate": pmt_date.strftime("%Y-%m-%d"),
            "trancheNumber": idx + 1,
            "disbursementStage": f"Milestone Stage {idx+1}",
            "beneficiaryAccount": f"SBIN000{random.randint(1000, 9999)}"
        })

    # Flagship Progress logs
    progress_records.append({"projectId": "MPL-10482", "inspectionDate": "2024-08-10", "physicalProgress": 15.0, "financialProgress": 35.0, "remarks": "Foundation and plinth work completed with delays"})
    progress_records.append({"projectId": "MPL-10482", "inspectionDate": "2024-12-20", "physicalProgress": 28.0, "financialProgress": 65.0, "remarks": "Pillar columns erected; site progress slowed due to labor shortage"})
    progress_records.append({"projectId": "MPL-10482", "inspectionDate": "2025-05-15", "physicalProgress": 38.0, "financialProgress": 86.67, "remarks": "Roofing incomplete; financial disbursements high relative to ground progress"})

    # Flagship Related Projects (Nearby duplicate & repeated funding)
    # MPL-9812 (Nearby 0.8 km)
    p_9812 = {
        "projectId": "MPL-9812",
        "projectName": "Community Hall Renovation Work",
        "projectType": "Community Infrastructure",
        "description": "Renovation and civil repairs of municipal community hall",
        "state": "Maharashtra",
        "district": "Pune",
        "constituency": "Pune Parliamentary Constituency",
        "location": "Ward 14, Haveli, Pune",
        "latitude": 18.52512,
        "longitude": 73.86145,
        "sanctionedAmount": 1500000.0,
        "estimatedCost": 1500000.0,
        "expenditureAmount": 1450000.0,
        "fundUtilizationPercent": 96.67,
        "progressPercentage": 95.0,
        "expectedProgressPercentage": 100.0,
        "progressGap": 5.0,
        "sanctionDate": "2023-02-10",
        "expectedCompletionDate": "2023-11-30",
        "delayDays": 0,
        "status": "COMPLETED",
        "implementingAgency": "Municipal Corporation Engineering Cell",
        "contractorName": "Bharat Nirman Enterprises",
        "paymentCount": 6,
        "riskScore": 62,
        "riskLevel": "HIGH"
    }
    projects.append(p_9812)
    
    # MPL-7731 (Nearby 1.2 km)
    p_7731 = {
        "projectId": "MPL-7731",
        "projectName": "Public Library and Study Hall",
        "projectType": "Education",
        "description": "Modern study hall and digital library facility",
        "state": "Maharashtra",
        "district": "Pune",
        "constituency": "Pune Parliamentary Constituency",
        "location": "Ward 12, Pune Central",
        "latitude": 18.51234,
        "longitude": 73.84912,
        "sanctionedAmount": 2000000.0,
        "estimatedCost": 2000000.0,
        "expenditureAmount": 1200000.0,
        "fundUtilizationPercent": 60.0,
        "progressPercentage": 60.0,
        "expectedProgressPercentage": 65.0,
        "progressGap": 5.0,
        "sanctionDate": "2024-06-01",
        "expectedCompletionDate": "2025-06-01",
        "delayDays": 0,
        "status": "IN_PROGRESS",
        "implementingAgency": "Zilla Parishad Works Department",
        "contractorName": "Pragati Civil Projects Pvt. Ltd.",
        "paymentCount": 4,
        "riskScore": 45,
        "riskLevel": "MEDIUM"
    }
    projects.append(p_7731)

    # MPL-6621 (Nearby 1.5 km)
    p_6621 = {
        "projectId": "MPL-6621",
        "projectName": "Ward Multipurpose Shed Construction",
        "projectType": "Community Infrastructure",
        "description": "Construction of pre-fab multipurpose shed",
        "state": "Maharashtra",
        "district": "Pune",
        "constituency": "Pune Parliamentary Constituency",
        "location": "Ward 15, Near Shivaji Road, Pune",
        "latitude": 18.53120,
        "longitude": 73.84890,
        "sanctionedAmount": 1800000.0,
        "estimatedCost": 1800000.0,
        "expenditureAmount": 1700000.0,
        "fundUtilizationPercent": 94.4,
        "progressPercentage": 85.0,
        "expectedProgressPercentage": 90.0,
        "progressGap": 5.0,
        "sanctionDate": "2023-08-15",
        "expectedCompletionDate": "2024-08-15",
        "delayDays": 15,
        "status": "IN_PROGRESS",
        "implementingAgency": "Public Works Division - Central Pune",
        "contractorName": "Apex Infrastructure & Civil Works Ltd.",
        "paymentCount": 7,
        "riskScore": 55,
        "riskLevel": "MEDIUM"
    }
    projects.append(p_6621)

    # Additional Special Demo Cases
    # MPL-9182: Cost overrun + severe delay
    projects.append({
        "projectId": "MPL-9182",
        "projectName": "CC Paver Road and Stormwater Drain",
        "projectType": "Roads and Pathways",
        "description": "Heavy duty paver block road with RCC drain",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "constituency": "Lucknow Parliamentary Constituency",
        "location": "Sector 4, Gomti Nagar",
        "latitude": 26.8520,
        "longitude": 80.9580,
        "sanctionedAmount": 4500000.0,
        "estimatedCost": 4000000.0,
        "expenditureAmount": 4800000.0,
        "fundUtilizationPercent": 106.67,
        "progressPercentage": 45.0,
        "expectedProgressPercentage": 90.0,
        "progressGap": 45.0,
        "sanctionDate": "2024-01-10",
        "expectedCompletionDate": "2025-01-10",
        "delayDays": 180,
        "status": "DELAYED",
        "implementingAgency": "Municipal Corporation Engineering Cell",
        "contractorName": "Bharat Nirman Enterprises",
        "paymentCount": 9,
        "riskScore": 91,
        "riskLevel": "HIGH"
    })

    # MPL-7721: Repeated Funding Case
    projects.append({
        "projectId": "MPL-7721",
        "projectName": "Installation of Solar RO Water Plant",
        "projectType": "Drinking Water",
        "description": "Commercial capacity 1000 LPH RO water plant",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "constituency": "Bangalore South",
        "location": "Jayanagar 4th Block",
        "latitude": 12.9250,
        "longitude": 77.5938,
        "sanctionedAmount": 2500000.0,
        "estimatedCost": 2500000.0,
        "expenditureAmount": 2400000.0,
        "fundUtilizationPercent": 96.0,
        "progressPercentage": 50.0,
        "expectedProgressPercentage": 85.0,
        "progressGap": 35.0,
        "sanctionDate": "2024-03-20",
        "expectedCompletionDate": "2025-03-20",
        "delayDays": 110,
        "status": "DELAYED",
        "implementingAgency": "State Water Supply & Sewerage Board",
        "contractorName": "Vanguard Engineering & Constructions",
        "paymentCount": 6,
        "riskScore": 87,
        "riskLevel": "HIGH"
    })

    # MPL-6651: Duplicate Nearby Work
    projects.append({
        "projectId": "MPL-6651",
        "projectName": "Underground Drainage and Sewer Line",
        "projectType": "Sanitation",
        "description": "Laying of HDPE sewer line network",
        "state": "Gujarat",
        "district": "Ahmedabad",
        "constituency": "Ahmedabad East",
        "location": "Maninagar Zone",
        "latitude": 23.0035,
        "longitude": 72.6012,
        "sanctionedAmount": 3800000.0,
        "estimatedCost": 3800000.0,
        "expenditureAmount": 3500000.0,
        "fundUtilizationPercent": 92.1,
        "progressPercentage": 40.0,
        "expectedProgressPercentage": 75.0,
        "progressGap": 35.0,
        "sanctionDate": "2024-05-15",
        "expectedCompletionDate": "2025-05-15",
        "delayDays": 95,
        "status": "DELAYED",
        "implementingAgency": "Municipal Corporation Engineering Cell",
        "contractorName": "Shree Ganesh Developers & Contractors",
        "paymentCount": 8,
        "riskScore": 83,
        "riskLevel": "HIGH"
    })

    # Related Project mappings for demo
    related_projects.append({"projectId": "MPL-10482", "relatedProjectId": "MPL-9812", "relationshipType": "POTENTIAL_OVERLAP", "distanceKm": 0.8, "similarityScore": 85})
    related_projects.append({"projectId": "MPL-10482", "relatedProjectId": "MPL-7731", "relationshipType": "PROXIMITY_ONLY", "distanceKm": 1.2, "similarityScore": 30})
    related_projects.append({"projectId": "MPL-10482", "relatedProjectId": "MPL-6621", "relationshipType": "POTENTIAL_OVERLAP", "distanceKm": 1.5, "similarityScore": 80})

    # Generate remaining projects up to total_count
    existing_ids = {p["projectId"] for p in projects}
    current_num = 1000
    
    statuses = ["RECOMMENDED", "SANCTIONED", "IN_PROGRESS", "DELAYED", "OVERDUE", "COMPLETED"]
    status_weights = [0.08, 0.12, 0.50, 0.08, 0.04, 0.18]

    while len(projects) < total_count:
        p_id = f"MPL-{current_num:05d}"
        current_num += 1
        if p_id in existing_ids:
            continue
            
        dist_info = random.choice(DISTRICTS)
        cat_name, project_titles = random.choice(CATEGORIES)
        p_name = random.choice(project_titles)
        agency = random.choice(AGENCIES)
        contractor = random.choice(CONTRACTORS)
        
        status = random.choices(statuses, weights=status_weights)[0]
        
        # Financials
        sanctioned = round(random.uniform(500000.0, 5000000.0) / 10000.0) * 10000.0
        estimated = round(sanctioned * random.uniform(0.95, 1.05) / 10000.0) * 10000.0
        
        # Dates
        days_ago = random.randint(60, 600)
        s_date = datetime.now() - timedelta(days=days_ago)
        duration = random.randint(180, 365)
        e_date = s_date + timedelta(days=duration)
        
        # Progress & Delays based on status
        if status == "COMPLETED":
            progress = 100.0
            expected_prog = 100.0
            expenditure = sanctioned * random.uniform(0.92, 1.0)
            delay = 0
            risk_score = random.randint(10, 28)
            risk_level = "LOW"
        elif status == "RECOMMENDED":
            progress = 0.0
            expected_prog = 0.0
            expenditure = 0.0
            delay = 0
            risk_score = random.randint(5, 20)
            risk_level = "LOW"
        elif status == "SANCTIONED":
            progress = random.uniform(0.0, 10.0)
            expected_prog = random.uniform(5.0, 15.0)
            expenditure = sanctioned * random.uniform(0.05, 0.15)
            delay = 0
            risk_score = random.randint(10, 25)
            risk_level = "LOW"
        elif status == "DELAYED" or status == "OVERDUE":
            progress = random.uniform(25.0, 65.0)
            expected_prog = min(100.0, progress + random.uniform(25.0, 45.0))
            expenditure = sanctioned * random.uniform(0.70, 1.05)
            delay = random.randint(45, 220)
            risk_score = random.randint(62, 88)
            risk_level = "HIGH" if risk_score < 80 else "CRITICAL"
        else: # IN_PROGRESS
            progress = random.uniform(20.0, 85.0)
            expected_prog = min(100.0, progress + random.uniform(-5.0, 15.0))
            expenditure = sanctioned * (progress / 100.0) * random.uniform(0.85, 1.1)
            delay = random.randint(0, 30)
            risk_score = random.randint(15, 58)
            risk_level = "LOW" if risk_score < 30 else "MEDIUM"

        expenditure = round(min(expenditure, sanctioned * 1.25), 2)
        progress = round(progress, 1)
        expected_prog = round(expected_prog, 1)
        progress_gap = round(max(0.0, expected_prog - progress), 1)
        utilization = round((expenditure / max(sanctioned, 1.0)) * 100.0, 2)
        
        # Spatial jitter around district centroid
        lat_jitter = dist_info["lat"] + random.uniform(-0.08, 0.08)
        lon_jitter = dist_info["lon"] + random.uniform(-0.08, 0.08)
        
        pmt_count = random.randint(3, 10) if expenditure > 0 else 0
        
        proj_obj = {
            "projectId": p_id,
            "projectName": f"{p_name} ({dist_info['district']})",
            "projectType": cat_name,
            "description": f"{p_name} executed under MPLADS parliamentary constituency development guidelines.",
            "state": dist_info["state"],
            "district": dist_info["district"],
            "constituency": dist_info["constituency"],
            "location": f"Zone {random.randint(1, 20)}, {dist_info['district']}",
            "latitude": round(lat_jitter, 5),
            "longitude": round(lon_jitter, 5),
            "sanctionedAmount": sanctioned,
            "estimatedCost": estimated,
            "expenditureAmount": expenditure,
            "fundUtilizationPercent": utilization,
            "progressPercentage": progress,
            "expectedProgressPercentage": expected_prog,
            "progressGap": progress_gap,
            "sanctionDate": s_date.strftime("%Y-%m-%d"),
            "expectedCompletionDate": e_date.strftime("%Y-%m-%d"),
            "delayDays": delay,
            "status": status,
            "implementingAgency": agency,
            "contractorName": contractor,
            "paymentCount": pmt_count,
            "riskScore": risk_score,
            "riskLevel": risk_level
        }
        projects.append(proj_obj)

        # Generate Payments conforming to Benford distribution with occasional anomalies
        if pmt_count > 0:
            remaining_exp = expenditure
            for p_idx in range(pmt_count):
                if p_idx == pmt_count - 1:
                    p_amt = remaining_exp
                else:
                    portion = round(expenditure / pmt_count * random.uniform(0.6, 1.4), 2)
                    p_amt = min(portion, remaining_exp)
                    remaining_exp -= p_amt
                
                if p_amt > 1000:
                    p_date = s_date + timedelta(days=(p_idx + 1) * (duration // max(pmt_count, 1)))
                    payments.append({
                        "paymentId": f"PMT-{p_id.split('-')[1]}-{p_idx+1:02d}",
                        "projectId": p_id,
                        "amount": round(p_amt, 2),
                        "paymentDate": min(p_date, datetime.now()).strftime("%Y-%m-%d"),
                        "trancheNumber": p_idx + 1,
                        "disbursementStage": f"Tranche Stage {p_idx+1}",
                        "beneficiaryAccount": f"SBIN000{random.randint(1000, 9999)}"
                    })

    return projects, payments, progress_records, related_projects

def export_sql_and_json(base_dir):
    projects, payments, progress_records, related_projects = generate_projects(1250)
    
    # Write JSON copy
    json_path = os.path.join(base_dir, "database", "seed_data.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "datasetLabel": "Prototype / Synthetic Demonstration Data",
            "totalCount": len(projects),
            "projects": projects
        }, f, indent=2)

    # Generate SQL schema and seed data
    schema_sql = """-- MPLADS Sentinel Database Schema
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
"""

    # Generate INSERT statements for Seed Data
    data_sql_lines = [
        "-- Seed Data for MPLADS Sentinel",
        "-- Prototype / Synthetic Demonstration Data",
        "",
        "-- Default Officer User (Password: Sentinel@2026 hashed with BCrypt)",
        "INSERT INTO users (username, password_hash, full_name, role, designation, district, state) VALUES "
        "('officer@nic.in', '$2a$10$w3O8mJ19vE8JmSgK0N8uK.o2xO4xT2n8I1V0YmY5e4P6K2a2y4R0u', 'Rajesh Sharma', 'DISTRICT_MONITORING_OFFICER', 'Deputy Commissioner / Nodal Officer', 'Pune', 'Maharashtra');",
        "INSERT INTO users (username, password_hash, full_name, role, designation, district, state) VALUES "
        "('admin@nic.in', '$2a$10$w3O8mJ19vE8JmSgK0N8uK.o2xO4xT2n8I1V0YmY5e4P6K2a2y4R0u', 'Dr. Arvind Mehra', 'STATE_ADMINISTRATOR', 'Joint Secretary (MPLADS Division)', 'All', 'Maharashtra');",
        ""
    ]

    # Insert projects
    data_sql_lines.append("-- Projects")
    for p in projects:
        desc = p['description'].replace("'", "''")
        pname = p['projectName'].replace("'", "''")
        loc = p['location'].replace("'", "''")
        agency = p['implementingAgency'].replace("'", "''")
        contractor = p['contractorName'].replace("'", "''")
        
        sql = (
            f"INSERT INTO projects (project_id, project_name, project_type, description, state, district, constituency, location, "
            f"latitude, longitude, sanctioned_amount, estimated_cost, expenditure_amount, fund_utilization_percent, "
            f"progress_percentage, expected_progress_percentage, progress_gap, sanction_date, expected_completion_date, "
            f"delay_days, status, implementing_agency, contractor_name, payment_count, risk_score, risk_level) VALUES ("
            f"'{p['projectId']}', '{pname}', '{p['projectType']}', '{desc}', '{p['state']}', '{p['district']}', '{p['constituency']}', '{loc}', "
            f"{p['latitude']}, {p['longitude']}, {p['sanctionedAmount']}, {p['estimatedCost']}, {p['expenditureAmount']}, {p['fundUtilizationPercent']}, "
            f"{p['progressPercentage']}, {p['expectedProgressPercentage']}, {p['progressGap']}, '{p['sanctionDate']}', '{p['expectedCompletionDate']}', "
            f"{p['delayDays']}, '{p['status']}', '{agency}', '{contractor}', {p['paymentCount']}, {p['riskScore']}, '{p['riskLevel']}');"
        )
        data_sql_lines.append(sql)

    # Insert Payments
    data_sql_lines.append("\n-- Payments")
    for pm in payments:
        sql = (
            f"INSERT INTO payments (payment_id, project_id, amount, payment_date, tranche_number, disbursement_stage, beneficiary_account) VALUES ("
            f"'{pm['paymentId']}', '{pm['projectId']}', {pm['amount']}, '{pm['paymentDate']}', {pm['trancheNumber']}, '{pm['disbursementStage']}', '{pm['beneficiaryAccount']}');"
        )
        data_sql_lines.append(sql)

    # Insert Progress Records
    data_sql_lines.append("\n-- Progress Records")
    for pr in progress_records:
        rem = pr['remarks'].replace("'", "''")
        sql = (
            f"INSERT INTO project_progress (project_id, inspection_date, physical_progress, financial_progress, remarks) VALUES ("
            f"'{pr['projectId']}', '{pr['inspectionDate']}', {pr['physicalProgress']}, {pr['financialProgress']}, '{rem}');"
        )
        data_sql_lines.append(sql)

    # Insert Related Projects
    data_sql_lines.append("\n-- Related Projects")
    for rp in related_projects:
        sql = (
            f"INSERT INTO related_projects (project_id, related_project_id, relationship_type, distance_km, similarity_score) VALUES ("
            f"'{rp['projectId']}', '{rp['relatedProjectId']}', '{rp['relationshipType']}', {rp['distanceKm']}, {rp['similarityScore']});"
        )
        data_sql_lines.append(sql)

    # Write files
    with open(os.path.join(base_dir, "database", "init.sql"), "w", encoding="utf-8") as f:
        f.write(schema_sql + "\n" + "\n".join(data_sql_lines))

    with open(os.path.join(base_dir, "backend", "src", "main", "resources", "schema.sql"), "w", encoding="utf-8") as f:
        f.write(schema_sql)

    with open(os.path.join(base_dir, "backend", "src", "main", "resources", "data.sql"), "w", encoding="utf-8") as f:
        f.write("\n".join(data_sql_lines))

    print(f"Successfully generated {len(projects)} synthetic projects and {len(payments)} payment records.")

if __name__ == "__main__":
    export_sql_and_json(r"c:\Users\Atharva Jain\Desktop\mplads-sentinel")
