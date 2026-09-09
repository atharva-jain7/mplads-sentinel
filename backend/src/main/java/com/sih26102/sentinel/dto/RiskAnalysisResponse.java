package com.sih26102.sentinel.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class RiskAnalysisResponse {
    private String projectId;
    private Integer riskScore;
    private String riskLevel;
    private LocalDateTime analyzedAt = LocalDateTime.now();
    private List<RiskFactorDTO> ruleSignals;
    private Map<String, Object> mlSignals;
    private List<RiskFactorDTO> factors;
    private String investigationPriority;
    private String recommendedAction;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
    public List<RiskFactorDTO> getRuleSignals() { return ruleSignals; }
    public void setRuleSignals(List<RiskFactorDTO> ruleSignals) { this.ruleSignals = ruleSignals; }
    public Map<String, Object> getMlSignals() { return mlSignals; }
    public void setMlSignals(Map<String, Object> mlSignals) { this.mlSignals = mlSignals; }
    public List<RiskFactorDTO> getFactors() { return factors; }
    public void setFactors(List<RiskFactorDTO> factors) { this.factors = factors; }
    public String getInvestigationPriority() { return investigationPriority; }
    public void setInvestigationPriority(String investigationPriority) { this.investigationPriority = investigationPriority; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
}