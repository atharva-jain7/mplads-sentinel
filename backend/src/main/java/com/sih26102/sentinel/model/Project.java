package com.sih26102.sentinel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @Column(name = "project_id", length = 50)
    private String projectId;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "project_type", nullable = false)
    private String projectType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    private String constituency;
    private String location;

    private Double latitude;
    private Double longitude;

    @Column(name = "sanctioned_amount", nullable = false)
    private Double sanctionedAmount;

    @Column(name = "estimated_cost", nullable = false)
    private Double estimatedCost;

    @Column(name = "expenditure_amount")
    private Double expenditureAmount = 0.0;

    @Column(name = "fund_utilization_percent")
    private Double fundUtilizationPercent = 0.0;

    @Column(name = "progress_percentage")
    private Double progressPercentage = 0.0;

    @Column(name = "expected_progress_percentage")
    private Double expectedProgressPercentage = 0.0;

    @Column(name = "progress_gap")
    private Double progressGap = 0.0;

    @Column(name = "sanction_date")
    private LocalDate sanctionDate;

    @Column(name = "expected_completion_date")
    private LocalDate expectedCompletionDate;

    @Column(name = "delay_days")
    private Integer delayDays = 0;

    @Column(nullable = false)
    private String status;

    @Column(name = "implementing_agency")
    private String implementingAgency;

    @Column(name = "contractor_name")
    private String contractorName;

    @Column(name = "payment_count")
    private Integer paymentCount = 0;

    @Column(name = "risk_score")
    private Integer riskScore = 0;

    @Column(name = "risk_level")
    private String riskLevel = "LOW";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getConstituency() { return constituency; }
    public void setConstituency(String constituency) { this.constituency = constituency; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getSanctionedAmount() { return sanctionedAmount; }
    public void setSanctionedAmount(Double sanctionedAmount) { this.sanctionedAmount = sanctionedAmount; }
    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
    public Double getExpenditureAmount() { return expenditureAmount; }
    public void setExpenditureAmount(Double expenditureAmount) { this.expenditureAmount = expenditureAmount; }
    public Double getFundUtilizationPercent() { return fundUtilizationPercent; }
    public void setFundUtilizationPercent(Double fundUtilizationPercent) { this.fundUtilizationPercent = fundUtilizationPercent; }
    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }
    public Double getExpectedProgressPercentage() { return expectedProgressPercentage; }
    public void setExpectedProgressPercentage(Double expectedProgressPercentage) { this.expectedProgressPercentage = expectedProgressPercentage; }
    public Double getProgressGap() { return progressGap; }
    public void setProgressGap(Double progressGap) { this.progressGap = progressGap; }
    public LocalDate getSanctionDate() { return sanctionDate; }
    public void setSanctionDate(LocalDate sanctionDate) { this.sanctionDate = sanctionDate; }
    public LocalDate getExpectedCompletionDate() { return expectedCompletionDate; }
    public void setExpectedCompletionDate(LocalDate expectedCompletionDate) { this.expectedCompletionDate = expectedCompletionDate; }
    public Integer getDelayDays() { return delayDays; }
    public void setDelayDays(Integer delayDays) { this.delayDays = delayDays; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getImplementingAgency() { return implementingAgency; }
    public void setImplementingAgency(String implementingAgency) { this.implementingAgency = implementingAgency; }
    public String getContractorName() { return contractorName; }
    public void setContractorName(String contractorName) { this.contractorName = contractorName; }
    public Integer getPaymentCount() { return paymentCount; }
    public void setPaymentCount(Integer paymentCount) { this.paymentCount = paymentCount; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}