import os
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
