# MPLADS Sentinel - Risk Model and Legal Terminology

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
