package com.sih26102.sentinel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "related_projects")
public class RelatedProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "related_project_id", nullable = false)
    private String relatedProjectId;

    @Column(name = "relationship_type", nullable = false)
    private String relationshipType;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "similarity_score")
    private Integer similarityScore;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getRelatedProjectId() { return relatedProjectId; }
    public void setRelatedProjectId(String relatedProjectId) { this.relatedProjectId = relatedProjectId; }
    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Integer getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Integer similarityScore) { this.similarityScore = similarityScore; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}