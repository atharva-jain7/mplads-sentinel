import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel"

# docker-compose.yml
docker_compose = """version: '3.8'

services:
  database:
    image: postgis/postgis:15-3.3
    container_name: sentinel-database
    environment:
      POSTGRES_DB: mplads_db
      POSTGRES_USER: sentinel_user
      POSTGRES_PASSWORD: sentinel_password
    ports:
      - "5432:5432"
    volumes:
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sentinel_user -d mplads_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  ml-service:
    build: ./ml-service
    container_name: sentinel-ml-service
    ports:
      - "8082:8082"
    environment:
      - PORT=8082
    restart: always

  backend:
    build: ./backend
    container_name: sentinel-backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/mplads_db
      - SPRING_DATASOURCE_USERNAME=sentinel_user
      - SPRING_DATASOURCE_PASSWORD=sentinel_password
      - SENTINEL_ML_SERVICE_URL=http://ml-service:8082
    depends_on:
      database:
        condition: service_healthy
      ml-service:
        condition: service_started
    restart: always

  frontend:
    build: ./frontend
    container_name: sentinel-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: always

volumes:
  pgdata:
"""

with open(os.path.join(BASE, "docker-compose.yml"), "w", encoding="utf-8") as f:
    f.write(docker_compose)

# README.md
readme_md = """# MPLADS Sentinel - Intelligent Project Monitoring & Risk Prioritization Platform

**Smart India Hackathon 2026 (SIH26102) - Stage-2 Working Prototype**

> **Analytical Disclaimer**: *Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.*

---

## 1. System Overview

MPLADS Sentinel is a multi-tier risk prioritization and anomaly detection platform designed for district authorities and central monitoring officers under the **Ministry of Statistics and Programme Implementation (MoSPI)**.

Instead of manually inspecting thousands of local development works, Sentinel automatically analyzes financial transactions, physical milestone progression, execution timelines, and GIS proximity to highlight high-priority projects requiring verification.

```
MPLADS Project Data
       ↓
Automated Multi-Signal Analysis (Rule Engine + Isolation Forest + LOF + Benford)
       ↓
Explainable Risk Fusion (0-100 Score & Risk Level)
       ↓
GIS Spatial Proximity & Overlap Mapping
       ↓
Investigation Workspace & Evidence Dossier
       ↓
Official 14-Section Investigation Report Generation
```

---

## 2. Architecture & Tech Stack

- **Frontend (`frontend/`)**: React 18, Tailwind CSS, Lucide Icons, Leaflet (OpenStreetMap), Vite.
- **Backend Orchestrator (`backend/`)**: Java 21 / Spring Boot 3.3.x, Spring Data JPA, Spring Security (JWT), Haversine GIS, Embedded DB & PostgreSQL/PostGIS.
- **ML Anomaly Service (`ml-service/`)**: Python FastAPI, scikit-learn (Isolation Forest, Local Outlier Factor), NumPy, SciPy (Benford's Law).
- **Database (`database/`)**: PostgreSQL / PostGIS DDL & 1,250+ realistic synthetic MPLADS projects with 7,560 payment records across Indian parliamentary constituencies.
- **Shared Documentation (`docs/`)**: API Contract, Data Dictionary, Risk Formulation Model.

---

## 3. Flagship Demonstration Case: `MPL-10482`

The prototype includes an intentionally constructed showcase project:
- **Project ID**: `MPL-10482`
- **Title**: Construction of Community Infrastructure
- **Location**: Ward 14, Haveli Taluka, Pune, Maharashtra
- **Sanctioned**: ₹30,00,000 | **Expenditure**: ₹26,00,000 (86.7% Fund Utilization)
- **Physical Progress**: 38.0% | **Expected**: 80.0% (42.0% Progress Gap)
- **Delay**: 137 Days Overdue
- **Signals Flagged**:
  1. `PROGRESS_EXPENDITURE_MISMATCH` (86.7% expenditure vs 38.0% progress)
  2. `DELAY` (137 days overdue)
  3. `REPEATED_FUNDING` (2 historical works in same zone)
  4. `POTENTIAL_DUPLICATE` (Similar work `MPL-9812` located 0.8 km away)
  5. `ISOLATION_FOREST_ANOMALY` (Multi-variate anomaly score: 89)
  6. `LOF_PEER_ANOMALY` (Local density peer anomaly score: 84)
  7. `BENFORD_FINANCIAL_ANOMALY` (Payment first-digit cluster on digit 2)
- **Composite Risk Score**: **94 / 100 (CRITICAL)**

---

## 4. Quickstart Guide (Local Execution)

### Prerequisites
- Java 21+ & Maven
- Python 3.10+
- Node.js 18+ & npm

### Step 1: Start Python ML Microservice
```bash
cd ml-service
pip install -r requirements.txt
python app.py
# Runs on http://localhost:8082
```

### Step 2: Start Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080 (Seeds 1,250 projects into in-memory PostgreSQL DB)
```

### Step 3: Start React Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Demonstration Credentials
- **Username**: `officer@nic.in`
- **Password**: `Sentinel@2026`

---

## 5. Automated Pipeline Flow

1. **Login** (`/login`) → Authenticate as District Nodal Officer.
2. **Dashboard** (`/dashboard`) → Inspect 7 KPI cards, Risk Distribution, Status Breakdown, Trends, and Priority Queue.
3. **Registry** (`/projects`) → Filter by district, sector, status, or search for `MPL-10482`.
4. **Project Details** (`/projects/MPL-10482`) → Click **"Run Live Risk Analysis"** to trigger live multi-model execution.
5. **Investigation Workspace** (`/investigation/MPL-10482`) → Inspect "WHY FLAGGED?" rationale, Benford distribution chart, GIS spatial radius map, and evidence logs.
6. **Generate Report** (`/reports/RPT-20260901-10482`) → View and print formal 14-section investigation report with official disclaimer.
"""

with open(os.path.join(BASE, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme_md)

print("docker-compose.yml and README.md generated.")