# -*- coding: utf-8 -*-
import os
import json

BASE_DIR = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel"

# 1. API CONTRACT
api_contract = """# MPLADS Sentinel - API Contract

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
"""

with open(os.path.join(BASE_DIR, "docs", "api-contract.md"), "w", encoding="utf-8") as f:
    f.write(api_contract)

# 2. DATA DICTIONARY
data_dict = """# MPLADS Sentinel - Data Dictionary

Strictly enforced camelCase JSON properties across frontend, Java backend, and Python ML service:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `projectId` | String | Unique project code (e.g., `MPL-10482`) |
| `projectName` | String | Title of MPLADS work |
| `projectType` | String | Sector category |
| `sanctionedAmount` | Double | Amount sanctioned in INR (Rs) |
| `estimatedCost` | Double | Initial estimated cost in INR (Rs) |
| `expenditureAmount` | Double | Cumulative expenditure incurred in INR (Rs) |
| `fundUtilizationPercent` | Double | (expenditureAmount / sanctionedAmount) * 100 |
| `progressPercentage` | Double | Physical progress completion percentage (0.0 to 100.0) |
| `expectedProgressPercentage` | Double | Expected progress based on timeline (0.0 to 100.0) |
| `delayDays` | Integer | Days overdue past expected completion date |
| `riskScore` | Integer | Calculated risk index from 0 to 100 |
| `riskLevel` | String | `LOW` (0-29), `MEDIUM` (30-59), `HIGH` (60-79), `CRITICAL` (80-100) |
| `paymentCount` | Integer | Total number of payment tranches disbursed |
| `latitude` | Double | WGS84 Latitude coordinate |
| `longitude` | Double | WGS84 Longitude coordinate |
| `state` | String | State / UT |
| `district` | String | Nodal District |
| `constituency` | String | Parliamentary Constituency |
| `status` | String | `RECOMMENDED`, `SANCTIONED`, `IN_PROGRESS`, `DELAYED`, `OVERDUE`, `COMPLETED` |
"""

with open(os.path.join(BASE_DIR, "docs", "data-dictionary.md"), "w", encoding="utf-8") as f:
    f.write(data_dict)

# 3. RISK MODEL
risk_model = """# MPLADS Sentinel - Risk Model and Legal Terminology

## Risk Level Thresholds
- **0 to 29**: `LOW` - Normal routine tracking
- **30 to 59**: `MEDIUM` - Regular monitoring
- **60 to 79**: `HIGH` - Review recommended
- **80 to 100**: `CRITICAL` - Investigation priority

## Weighted Risk Fusion Formulation
```
RiskScore = (RuleScore * 0.35) + 
            (IsolationForestScore * 0.20) + 
            (LOFScore * 0.15) + 
            (BenfordDeviationScore * 0.10) + 
            (HistoricalSimilarityScore * 0.10) + 
            (GISProximityScore * 0.10)
```

## Mandatory Analytical Terminology
- Use: "Potential irregularity", "Anomaly detected", "Review recommended", "Investigation priority", "Unusual financial pattern", "Potential overlap - review recommended".
- Never Use: "Fraud confirmed", "Fraud detected", "Guilty contractor".
- Mandatory Disclaimer: "Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing."
"""

with open(os.path.join(BASE_DIR, "docs", "risk-model.md"), "w", encoding="utf-8") as f:
    f.write(risk_model)

# 4. ML SERVICE FILES
requirements_txt = """fastapi>=0.110.0
uvicorn>=0.28.0
scikit-learn>=1.4.0
pandas>=2.2.0
numpy>=1.26.0
scipy>=1.12.0
pydantic>=2.6.0
"""

with open(os.path.join(BASE_DIR, "ml-service", "requirements.txt"), "w", encoding="utf-8") as f:
    f.write(requirements_txt)

# Isolation Forest Model
if_py = """import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

class IsolationForestAnalyzer:
    def __init__(self, contamination=0.1, random_state=42):
        self.contamination = contamination
        self.random_state = random_state
        self.scaler = StandardScaler()
        self.model = IsolationForest(
            n_estimators=100,
            contamination=self.contamination,
            random_state=self.random_state
        )

    def _prepare_features(self, projects):
        data = []
        for p in projects:
            sanctioned = float(p.get("sanctionedAmount", 0.0))
            estimated = float(p.get("estimatedCost", sanctioned))
            expenditure = float(p.get("expenditureAmount", 0.0))
            progress = float(p.get("progressPercentage", 0.0))
            expected_progress = float(p.get("expectedProgressPercentage", progress))
            delay_days = float(p.get("delayDays", 0))
            payment_count = float(p.get("paymentCount", 1))
            utilization = float(p.get("fundUtilizationPercent", (expenditure / max(sanctioned, 1.0)) * 100.0))
            progress_gap = max(0.0, expected_progress - progress)
            cost_overrun_pct = max(0.0, ((expenditure - estimated) / max(estimated, 1.0)) * 100.0) if expenditure > estimated else 0.0
            
            data.append([
                sanctioned,
                estimated,
                expenditure,
                utilization,
                progress,
                expected_progress,
                progress_gap,
                delay_days,
                payment_count,
                cost_overrun_pct
            ])
        return np.array(data, dtype=np.float64)

    def analyze(self, target_project, baseline_projects=None):
        projectId = target_project.get("projectId", "UNKNOWN")
        
        feature_list = [target_project]
        if baseline_projects and len(baseline_projects) > 5:
            feature_list.extend(baseline_projects)
        else:
            np.random.seed(42)
            for i in range(50):
                s = np.random.uniform(500000, 5000000)
                e = s * np.random.uniform(0.95, 1.05)
                exp = s * np.random.uniform(0.4, 0.9)
                prog = np.random.uniform(40, 95)
                exp_prog = min(100, prog + np.random.uniform(-5, 10))
                feature_list.append({
                    "sanctionedAmount": s,
                    "estimatedCost": e,
                    "expenditureAmount": exp,
                    "fundUtilizationPercent": (exp / s) * 100,
                    "progressPercentage": prog,
                    "expectedProgressPercentage": exp_prog,
                    "delayDays": max(0, int(np.random.normal(15, 30))),
                    "paymentCount": np.random.randint(2, 10)
                })
        
        X = self._prepare_features(feature_list)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        
        scores = self.model.decision_function(X_scaled)
        target_raw_score = float(scores[0])
        
        normalized_score = int(np.clip((0.5 - target_raw_score) * 100, 5, 98))
        is_anomaly = bool(normalized_score >= 60)
        
        target_features = X[0]
        explanations = []
        if target_features[6] > 25.0:
            explanations.append(f"Significant progress gap ({target_features[6]:.1f}% behind expected)")
        if target_features[7] > 60:
            explanations.append(f"Excessive project timeline delay ({int(target_features[7])} days overdue)")
        if target_features[3] > 80.0 and target_features[4] < 45.0:
            explanations.append(f"High fund utilization ({target_features[3]:.1f}%) paired with low physical progress ({target_features[4]:.1f}%)")
        if target_features[9] > 0.0:
            explanations.append(f"Expenditure exceeds initial estimated budget by {target_features[9]:.1f}%")
            
        if not explanations:
            explanation = "Feature combination aligns closely with normal project baseline."
        else:
            explanation = "; ".join(explanations)
            
        return {
            "projectId": projectId,
            "anomalyScore": normalized_score,
            "isAnomaly": is_anomaly,
            "explanation": explanation
        }
"""

with open(os.path.join(BASE_DIR, "ml-service", "models", "isolation_forest.py"), "w", encoding="utf-8") as f:
    f.write(if_py)

# Local Outlier Factor (LOF)
lof_py = """import numpy as np
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import StandardScaler

class LOFAnalyzer:
    def __init__(self, n_neighbors=15):
        self.n_neighbors = n_neighbors
        self.scaler = StandardScaler()

    def _prepare_features(self, projects):
        data = []
        for p in projects:
            sanctioned = float(p.get("sanctionedAmount", 0.0))
            expenditure = float(p.get("expenditureAmount", 0.0))
            progress = float(p.get("progressPercentage", 0.0))
            expected_progress = float(p.get("expectedProgressPercentage", progress))
            delay_days = float(p.get("delayDays", 0))
            cost_per_progress = (expenditure / max(progress, 1.0))
            
            data.append([
                sanctioned,
                expenditure,
                progress,
                expected_progress,
                delay_days,
                cost_per_progress
            ])
        return np.array(data, dtype=np.float64)

    def analyze(self, target_project, peer_projects=None):
        projectId = target_project.get("projectId", "UNKNOWN")
        
        feature_list = [target_project]
        if peer_projects and len(peer_projects) >= self.n_neighbors:
            feature_list.extend(peer_projects)
        else:
            np.random.seed(101)
            base_budget = float(target_project.get("sanctionedAmount", 2500000.0))
            for _ in range(30):
                budget = base_budget * np.random.uniform(0.7, 1.3)
                prog = np.random.uniform(50, 95)
                exp = budget * (prog / 100.0) * np.random.uniform(0.9, 1.1)
                exp_prog = min(100, prog + np.random.uniform(-5, 10))
                delay = max(0, int(np.random.normal(10, 20)))
                feature_list.append({
                    "sanctionedAmount": budget,
                    "expenditureAmount": exp,
                    "progressPercentage": prog,
                    "expectedProgressPercentage": exp_prog,
                    "delayDays": delay
                })

        X = self._prepare_features(feature_list)
        X_scaled = self.scaler.fit_transform(X)
        
        n_neighbors = min(self.n_neighbors, len(feature_list) - 1)
        lof = LocalOutlierFactor(n_neighbors=n_neighbors, novelty=False)
        lof.fit_predict(X_scaled)
        
        nof = lof.negative_outlier_factor_[0]
        raw_diff = max(0.0, (-nof) - 1.0)
        lof_score = int(np.clip(20 + (raw_diff * 45), 10, 95))
        is_anomaly = bool(lof_score >= 60)
        
        if is_anomaly:
            explanation = "Unusual cost-to-progress ratio and delay deviation compared with similar local peer projects."
        else:
            explanation = "Project metrics are consistent with peer cluster norms."
            
        return {
            "projectId": projectId,
            "lofScore": lof_score,
            "isAnomaly": is_anomaly,
            "explanation": explanation
        }
"""

with open(os.path.join(BASE_DIR, "ml-service", "models", "lof.py"), "w", encoding="utf-8") as f:
    f.write(lof_py)

# Benford's Law Financial Analyzer
benford_py = """import math
import numpy as np

class BenfordAnalyzer:
    def __init__(self):
        self.expected_distribution = {
            d: math.log10(1.0 + 1.0 / d) * 100.0 for d in range(1, 10)
        }

    def _get_leading_digit(self, num):
        try:
            val = abs(float(num))
            if val == 0:
                return None
            s = f"{val:.10f}".replace(".", "").lstrip("0")
            if s and s[0].isdigit():
                d = int(s[0])
                if 1 <= d <= 9:
                    return d
        except Exception:
            pass
        return None

    def analyze(self, projectId, payment_amounts):
        if not payment_amounts or len(payment_amounts) < 4:
            return {
                "projectId": projectId,
                "deviationScore": 25,
                "isAnomaly": False,
                "explanation": "Insufficient suitable financial records for Benford analysis.",
                "digitsDistribution": [
                    {"digit": d, "expected": round(self.expected_distribution[d], 1), "observed": round(self.expected_distribution[d], 1)}
                    for d in range(1, 10)
                ]
            }

        counts = {d: 0 for d in range(1, 10)}
        valid_count = 0

        for amt in payment_amounts:
            d = self._get_leading_digit(amt)
            if d:
                counts[d] += 1
                valid_count += 1

        if valid_count < 4:
            return {
                "projectId": projectId,
                "deviationScore": 25,
                "isAnomaly": False,
                "explanation": "Insufficient suitable financial records for Benford analysis.",
                "digitsDistribution": [
                    {"digit": d, "expected": round(self.expected_distribution[d], 1), "observed": round(self.expected_distribution[d], 1)}
                    for d in range(1, 10)
                ]
            }

        observed_pct = {d: (counts[d] / valid_count) * 100.0 for d in range(1, 10)}
        
        mad = sum(abs(observed_pct[d] - self.expected_distribution[d]) for d in range(1, 10)) / 9.0
        deviation_score = int(np.clip(mad * 10.0, 10, 95))
        is_anomaly = bool(deviation_score >= 60)
        
        digits_list = []
        for d in range(1, 10):
            digits_list.append({
                "digit": d,
                "expected": round(self.expected_distribution[d], 1),
                "observed": round(observed_pct[d], 1)
            })

        if is_anomaly:
            explanation = "Unusual financial digit distribution across payment tranches - review recommended."
        else:
            explanation = "Payment leading-digit distribution conforms reasonably to expected logarithmic curve."

        return {
            "projectId": projectId,
            "deviationScore": deviation_score,
            "isAnomaly": is_anomaly,
            "explanation": explanation,
            "digitsDistribution": digits_list
        }
"""

with open(os.path.join(BASE_DIR, "ml-service", "models", "benford.py"), "w", encoding="utf-8") as f:
    f.write(benford_py)

# FastAPI App
app_py = """import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from models.isolation_forest import IsolationForestAnalyzer
from models.lof import LOFAnalyzer
from models.benford import BenfordAnalyzer

app = FastAPI(
    title="MPLADS Sentinel - ML Anomaly Detection Service",
    description="Microservice providing Isolation Forest, Local Outlier Factor, and Benford Financial Analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if_analyzer = IsolationForestAnalyzer()
lof_analyzer = LOFAnalyzer()
benford_analyzer = BenfordAnalyzer()

class ProjectFeatures(BaseModel):
    projectId: str
    projectName: Optional[str] = None
    projectType: Optional[str] = None
    sanctionedAmount: float
    estimatedCost: Optional[float] = None
    expenditureAmount: float
    fundUtilizationPercent: Optional[float] = None
    progressPercentage: float
    expectedProgressPercentage: Optional[float] = None
    delayDays: Optional[int] = 0
    paymentCount: Optional[int] = 1

class IFRequest(BaseModel):
    targetProject: ProjectFeatures
    baselineProjects: Optional[List[ProjectFeatures]] = None

class LOFRequest(BaseModel):
    targetProject: ProjectFeatures
    peerProjects: Optional[List[ProjectFeatures]] = None

class BenfordRequest(BaseModel):
    projectId: str
    paymentAmounts: List[float]

@app.get("/health")
def health():
    return {"status": "UP", "service": "MPLADS Sentinel ML Microservice"}

@app.post("/ml/analyze/isolation-forest")
def analyze_isolation_forest(req: IFRequest):
    try:
        target = req.targetProject.model_dump()
        baseline = [p.model_dump() for p in req.baselineProjects] if req.baselineProjects else None
        result = if_analyzer.analyze(target, baseline)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ml/analyze/lof")
def analyze_lof(req: LOFRequest):
    try:
        target = req.targetProject.model_dump()
        peers = [p.model_dump() for p in req.peerProjects] if req.peerProjects else None
        result = lof_analyzer.analyze(target, peers)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ml/analyze/benford")
def analyze_benford(req: BenfordRequest):
    try:
        result = benford_analyzer.analyze(req.projectId, req.paymentAmounts)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8082, reload=False)
"""

with open(os.path.join(BASE_DIR, "ml-service", "app.py"), "w", encoding="utf-8") as f:
    f.write(app_py)

# Test ML Service
test_ml_py = """import unittest
from models.isolation_forest import IsolationForestAnalyzer
from models.lof import LOFAnalyzer
from models.benford import BenfordAnalyzer

class TestMLModels(unittest.TestCase):
    def setUp(self):
        self.demo_project = {
            "projectId": "MPL-10482",
            "projectName": "Construction of Community Infrastructure",
            "projectType": "Community Infrastructure",
            "sanctionedAmount": 3000000.0,
            "estimatedCost": 3000000.0,
            "expenditureAmount": 2600000.0,
            "fundUtilizationPercent": 86.67,
            "progressPercentage": 38.0,
            "expectedProgressPercentage": 80.0,
            "delayDays": 137,
            "paymentCount": 12
        }

    def test_isolation_forest(self):
        analyzer = IsolationForestAnalyzer()
        res = analyzer.analyze(self.demo_project)
        self.assertEqual(res["projectId"], "MPL-10482")
        self.assertTrue(res["anomalyScore"] >= 60, f"Expected high anomaly score, got {res['anomalyScore']}")
        self.assertTrue(res["isAnomaly"])
        print("Isolation Forest Test Passed:", res)

    def test_lof(self):
        analyzer = LOFAnalyzer()
        res = analyzer.analyze(self.demo_project)
        self.assertEqual(res["projectId"], "MPL-10482")
        self.assertTrue(res["lofScore"] >= 60, f"Expected high LOF score, got {res['lofScore']}")
        self.assertTrue(res["isAnomaly"])
        print("LOF Test Passed:", res)

    def test_benford(self):
        analyzer = BenfordAnalyzer()
        unusual_payments = [240000.0, 250000.0, 245000.0, 260000.0, 248000.0, 510000.0, 520000.0, 890000.0, 920000.0, 230000.0, 240000.0, 150000.0]
        res = analyzer.analyze("MPL-10482", unusual_payments)
        self.assertEqual(res["projectId"], "MPL-10482")
        self.assertTrue(res["deviationScore"] >= 50)
        self.assertEqual(len(res["digitsDistribution"]), 9)
        print("Benford Test Passed:", res)

if __name__ == "__main__":
    unittest.main()
"""

with open(os.path.join(BASE_DIR, "ml-service", "test_ml.py"), "w", encoding="utf-8") as f:
    f.write(test_ml_py)

print("ML Service and Docs generated successfully.")
