package com.sih26102.sentinel.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class InvestigationReportDTO {
    private String reportId;
    private String projectId;
    private LocalDateTime generatedAt = LocalDateTime.now();
    private String generatedBy;
    private String designation;
    private Map<String, Object> reportData;
    private String disclaimer = "Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.";

    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public Map<String, Object> getReportData() { return reportData; }
    public void setReportData(Map<String, Object> reportData) { this.reportData = reportData; }
    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}