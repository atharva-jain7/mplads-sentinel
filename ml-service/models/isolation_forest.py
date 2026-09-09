import numpy as np
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
