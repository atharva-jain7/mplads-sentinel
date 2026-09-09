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