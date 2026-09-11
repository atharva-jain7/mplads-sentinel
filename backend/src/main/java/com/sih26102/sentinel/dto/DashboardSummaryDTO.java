package com.sih26102.sentinel.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {
    private long totalProjects;
    private long criticalRisk;
    private long highRisk;
    private long delayed;
    private long costAnomalies;
    private long potentialDuplicates;
    private long repeatedFunding;
    private Map<String, Long> riskDistribution;
    private Map<String, Long> statusDistribution;
    private List<Map<String, Object>> monthlyRiskTrend;
    private List<Map<String, Object>> priorityQueue;
    private Double rupeesAtRisk;
    private Double totalSanctioned;
    private Double totalDisbursed;
    private String jurisdictionLabel;
    private String datasetType = "Demonstration Dataset";
    private Map<String, Object> dataQuality;

    public long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }
    public long getCriticalRisk() { return criticalRisk; }
    public void setCriticalRisk(long criticalRisk) { this.criticalRisk = criticalRisk; }
    public long getHighRisk() { return highRisk; }
    public void setHighRisk(long highRisk) { this.highRisk = highRisk; }
    public long getDelayed() { return delayed; }
    public void setDelayed(long delayed) { this.delayed = delayed; }
    public long getCostAnomalies() { return costAnomalies; }
    public void setCostAnomalies(long costAnomalies) { this.costAnomalies = costAnomalies; }
    public long getPotentialDuplicates() { return potentialDuplicates; }
    public void setPotentialDuplicates(long potentialDuplicates) { this.potentialDuplicates = potentialDuplicates; }
    public long getRepeatedFunding() { return repeatedFunding; }
    public void setRepeatedFunding(long repeatedFunding) { this.repeatedFunding = repeatedFunding; }
    public Map<String, Long> getRiskDistribution() { return riskDistribution; }
    public void setRiskDistribution(Map<String, Long> riskDistribution) { this.riskDistribution = riskDistribution; }
    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
    public List<Map<String, Object>> getMonthlyRiskTrend() { return monthlyRiskTrend; }
    public void setMonthlyRiskTrend(List<Map<String, Object>> monthlyRiskTrend) { this.monthlyRiskTrend = monthlyRiskTrend; }
    public List<Map<String, Object>> getPriorityQueue() { return priorityQueue; }
    public void setPriorityQueue(List<Map<String, Object>> priorityQueue) { this.priorityQueue = priorityQueue; }

    public Double getRupeesAtRisk() { return rupeesAtRisk; }
    public void setRupeesAtRisk(Double rupeesAtRisk) { this.rupeesAtRisk = rupeesAtRisk; }
    public Double getTotalSanctioned() { return totalSanctioned; }
    public void setTotalSanctioned(Double totalSanctioned) { this.totalSanctioned = totalSanctioned; }
    public Double getTotalDisbursed() { return totalDisbursed; }
    public void setTotalDisbursed(Double totalDisbursed) { this.totalDisbursed = totalDisbursed; }
    public String getJurisdictionLabel() { return jurisdictionLabel; }
    public void setJurisdictionLabel(String jurisdictionLabel) { this.jurisdictionLabel = jurisdictionLabel; }
    public String getDatasetType() { return datasetType; }
    public void setDatasetType(String datasetType) { this.datasetType = datasetType; }
    public Map<String, Object> getDataQuality() { return dataQuality; }
    public void setDataQuality(Map<String, Object> dataQuality) { this.dataQuality = dataQuality; }
}