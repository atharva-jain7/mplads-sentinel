# MPLADS Sentinel - API Contract

Version: 1.0.0 (Stage-2 Prototype)
Base URL: `/api/v1`
Data Format: JSON (Strictly camelCase)

---

## 1. Authentication
### `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "username": "officer@nic.in",
    "password": "Sentinel@2026"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "tokenType": "Bearer",
    "username": "officer@nic.in",
    "fullName": "Rajesh Sharma",
    "role": "DISTRICT_MONITORING_OFFICER",
    "designation": "Deputy Commissioner / Nodal Officer",
    "district": "Pune",
    "state": "Maharashtra"
  }
  ```

---

## 2. Dashboard
### `GET /api/v1/dashboard/summary`
- **Response** (200 OK):
  ```json
  {
    "totalProjects": 12482,
    "criticalRisk": 47,
    "highRisk": 386,
    "delayed": 912,
    "costAnomalies": 386,
    "potentialDuplicates": 74,
    "repeatedFunding": 91,
    "riskDistribution": {
      "low": 10185,
      "medium": 1864,
      "high": 386,
      "critical": 47
    },
    "statusDistribution": {
      "RECOMMENDED": 820,
      "SANCTIONED": 1450,
      "IN_PROGRESS": 6120,
      "DELAYED": 912,
      "OVERDUE": 340,
      "COMPLETED": 2840
    },
    "monthlyRiskTrend": [
      { "month": "Sep 2025", "low": 850, "medium": 120, "high": 25, "critical": 3 },
      { "month": "Oct 2025", "low": 890, "medium": 135, "high": 30, "critical": 4 },
      { "month": "Nov 2025", "low": 920, "medium": 140, "high": 28, "critical": 2 },
      { "month": "Dec 2025", "low": 870, "medium": 160, "high": 34, "critical": 5 },
      { "month": "Jan 2026", "low": 940, "medium": 155, "high": 32, "critical": 4 },
      { "month": "Feb 2026", "low": 910, "medium": 170, "high": 38, "critical": 6 }
    ],
    "priorityQueue": [
      {
        "projectId": "MPL-10482",
        "projectName": "Construction of Community Infrastructure",
        "district": "Pune",
        "riskScore": 94,
        "riskLevel": "CRITICAL",
        "primaryFlag": "Cost overrun, low physical progress, delay and repeated funding"
      }
    ]
  }
  ```

---

## 3. Projects
### `GET /api/v1/projects`
- Query params: `query`, `district`, `projectType`, `status`, `riskLevel`, `sortBy`, `sortDirection`, `page`, `size`
- Paginated project list with camelCase properties.

### `GET /api/v1/projects/{projectId}`
- Full project profile, timeline, financials, implementing agency, contractor.

### `POST /api/v1/projects/{projectId}/analyze`
- Triggers live pipeline: Rule Engine (Rules 1-7) -> ML Service (Isolation Forest, LOF, Benford) -> Risk Fusion -> DB save.
- Returns `riskScore`, `riskLevel`, `factors`, `investigationPriority`, `recommendedAction`.

### `GET /api/v1/projects/{projectId}/risk`
- Risk assessment history and factor breakdown.

### `GET /api/v1/projects/map`
- All projects with geo-coordinates and risk badges for GIS rendering.

### `GET /api/v1/projects/nearby?projectId=MPL-10482&radiusKm=5.0`
- Nearby projects within radius with distance and potential overlap indicators.

---

## 4. Reports
### `POST /api/v1/reports/{projectId}`
- Generates 14-section formal investigation report with analytical disclaimer.
