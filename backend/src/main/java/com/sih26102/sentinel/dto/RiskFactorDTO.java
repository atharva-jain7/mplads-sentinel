package com.sih26102.sentinel.dto;

public class RiskFactorDTO {
    private String type;
    private String severity;
    private Integer score;
    private String explanation;

    public RiskFactorDTO() {}
    public RiskFactorDTO(String type, String severity, Integer score, String explanation) {
        this.type = type;
        this.severity = severity;
        this.score = score;
        this.explanation = explanation;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}