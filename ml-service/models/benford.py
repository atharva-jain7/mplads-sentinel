import math
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
