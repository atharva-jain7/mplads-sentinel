package com.sih26102.sentinel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "risk_assessments")
public class RiskAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "risk_level", nullable = false)
    private String riskLevel;

    @Column(name = "rule_score")
    private Integer ruleScore;

    @Column(name = "if_score")
    private Integer ifScore;

    @Column(name = "lof_score")
    private Integer lofScore;

    @Column(name = "benford_score")
    private Integer benfordScore;

    @Column(name = "investigation_priority")
    private String investigationPriority;

    @Column(name = "recommended_action", columnDefinition = "TEXT")
    private String recommendedAction;

    @Column(name = "assessed_at")
    private LocalDateTime assessedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RiskFactor> factors = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public Integer getRuleScore() { return ruleScore; }
    public void setRuleScore(Integer ruleScore) { this.ruleScore = ruleScore; }
    public Integer getIfScore() { return ifScore; }
    public void setIfScore(Integer ifScore) { this.ifScore = ifScore; }
    public Integer getLofScore() { return lofScore; }
    public void setLofScore(Integer lofScore) { this.lofScore = lofScore; }
    public Integer getBenfordScore() { return benfordScore; }
    public void setBenfordScore(Integer benfordScore) { this.benfordScore = benfordScore; }
    public String getInvestigationPriority() { return investigationPriority; }
    public void setInvestigationPriority(String investigationPriority) { this.investigationPriority = investigationPriority; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
    public LocalDateTime getAssessedAt() { return assessedAt; }
    public void setAssessedAt(LocalDateTime assessedAt) { this.assessedAt = assessedAt; }
    public List<RiskFactor> getFactors() { return factors; }
    public void setFactors(List<RiskFactor> factors) { this.factors = factors; }
}