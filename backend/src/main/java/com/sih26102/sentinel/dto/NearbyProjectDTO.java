package com.sih26102.sentinel.dto;

public class NearbyProjectDTO {
    private String projectId;
    private String projectName;
    private String projectType;
    private Double sanctionedAmount;
    private Double expenditureAmount;
    private Double progressPercentage;
    private String status;
    private Integer riskScore;
    private String riskLevel;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private Boolean potentialOverlap;
    private String relationType;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
    public Double getSanctionedAmount() { return sanctionedAmount; }
    public void setSanctionedAmount(Double sanctionedAmount) { this.sanctionedAmount = sanctionedAmount; }
    public Double getExpenditureAmount() { return expenditureAmount; }
    public void setExpenditureAmount(Double expenditureAmount) { this.expenditureAmount = expenditureAmount; }
    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Boolean getPotentialOverlap() { return potentialOverlap; }
    public void setPotentialOverlap(Boolean potentialOverlap) { this.potentialOverlap = potentialOverlap; }
    public String getRelationType() { return relationType; }
    public void setRelationType(String relationType) { this.relationType = relationType; }
}