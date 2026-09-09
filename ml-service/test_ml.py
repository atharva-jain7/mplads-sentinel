import unittest
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
