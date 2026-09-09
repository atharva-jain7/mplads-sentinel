# -*- coding: utf-8 -*-
import os

BASE_DIR = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\backend"
SRC = os.path.join(BASE_DIR, "src", "main", "java", "com", "sih26102", "sentinel")

def write_file(subpath, content):
    full_path = os.path.join(SRC, subpath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip())

# ==========================================
# 1. MODELS
# ==========================================

# User.java
write_file("model/User.java", """
package com.sih26102.sentinel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role;

    private String designation;
    private String district;
    private String state;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
""")

# Project.java
write_file("model/Project.java", """
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
""")

# Payment.java
write_file("model/Payment.java", """
package com.sih26102.sentinel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @Column(name = "payment_id", length = 50)
    private String paymentId;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "tranche_number")
    private Integer trancheNumber;

    @Column(name = "disbursement_stage")
    private String disbursementStage;

    @Column(name = "beneficiary_account")
    private String beneficiaryAccount;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    public Integer getTrancheNumber() { return trancheNumber; }
    public void setTrancheNumber(Integer trancheNumber) { this.trancheNumber = trancheNumber; }
    public String getDisbursementStage() { return disbursementStage; }
    public void setDisbursementStage(String disbursementStage) { this.disbursementStage = disbursementStage; }
    public String getBeneficiaryAccount() { return beneficiaryAccount; }
    public void setBeneficiaryAccount(String beneficiaryAccount) { this.beneficiaryAccount = beneficiaryAccount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
""")

# ProjectProgress.java
write_file("model/ProjectProgress.java", """
package com.sih26102.sentinel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_progress")
public class ProjectProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "inspection_date", nullable = false)
    private LocalDate inspectionDate;

    @Column(name = "physical_progress", nullable = false)
    private Double physicalProgress;

    @Column(name = "financial_progress")
    private Double financialProgress;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public LocalDate getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDate inspectionDate) { this.inspectionDate = inspectionDate; }
    public Double getPhysicalProgress() { return physicalProgress; }
    public void setPhysicalProgress(Double physicalProgress) { this.physicalProgress = physicalProgress; }
    public Double getFinancialProgress() { return financialProgress; }
    public void setFinancialProgress(Double financialProgress) { this.financialProgress = financialProgress; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
""")

# RelatedProject.java
write_file("model/RelatedProject.java", """
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
""")

# RiskAssessment.java & RiskFactor.java
write_file("model/RiskAssessment.java", """
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
""")

write_file("model/RiskFactor.java", """
package com.sih26102.sentinel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "risk_factors")
public class RiskFactor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    @JsonIgnore
    private RiskAssessment assessment;

    @Column(name = "factor_type", nullable = false)
    private String type;

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    public RiskFactor() {}
    public RiskFactor(String type, String severity, Integer score, String explanation) {
        this.type = type;
        this.severity = severity;
        this.score = score;
        this.explanation = explanation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public RiskAssessment getAssessment() { return assessment; }
    public void setAssessment(RiskAssessment assessment) { this.assessment = assessment; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
""")

# AuditLog.java
write_file("model/AuditLog.java", """
package com.sih26102.sentinel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String action;

    @Column(name = "project_id")
    private String projectId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address")
    private String ipAddress;

    private LocalDateTime timestamp = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
""")

# ==========================================
# 2. REPOSITORIES
# ==========================================
write_file("repository/UserRepository.java", """
package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
""")

write_file("repository/ProjectRepository.java", """
package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, String> {
    
    @Query("SELECT p FROM Project p WHERE " +
           "(:query IS NULL OR LOWER(p.projectId) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.projectName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.location) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:district IS NULL OR p.district = :district) AND " +
           "(:projectType IS NULL OR p.projectType = :projectType) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:riskLevel IS NULL OR p.riskLevel = :riskLevel)")
    Page<Project> findWithFilters(
        @Param("query") String query,
        @Param("district") String district,
        @Param("projectType") String projectType,
        @Param("status") String status,
        @Param("riskLevel") String riskLevel,
        Pageable pageable
    );

    long countByRiskLevel(String riskLevel);
    long countByStatus(String status);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.expenditureAmount > p.estimatedCost")
    long countCostAnomalies();

    @Query("SELECT COUNT(p) FROM Project p WHERE p.delayDays > 30")
    long countDelayedProjects();

    List<Project> findTop10ByOrderByRiskScoreDesc();

    List<Project> findByDistrict(String district);

    @Query("SELECT DISTINCT p.district FROM Project p ORDER BY p.district")
    List<String> findDistinctDistricts();

    @Query("SELECT DISTINCT p.projectType FROM Project p ORDER BY p.projectType")
    List<String> findDistinctProjectTypes();
}
""")

write_file("repository/PaymentRepository.java", """
package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByProjectIdOrderByPaymentDateAsc(String projectId);
}
""")

write_file("repository/ProjectProgressRepository.java", """
package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.ProjectProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectProgressRepository extends JpaRepository<ProjectProgress, Long> {
    List<ProjectProgress> findByProjectIdOrderByInspectionDateDesc(String projectId);
}
""")

write_file("repository/RelatedProjectRepository.java", """
package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.RelatedProject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RelatedProjectRepository extends JpaRepository<RelatedProject, Long> {
    List<RelatedProject> findByProjectId(String projectId);
}
""")

write_file("repository/RiskAssessmentRepository.java", """
package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    Optional<RiskAssessment> findTopByProjectIdOrderByAssessedAtDesc(String projectId);
}
""")

write_file("repository/AuditLogRepository.java", """
package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
""")

print("Models & Repositories written.")
