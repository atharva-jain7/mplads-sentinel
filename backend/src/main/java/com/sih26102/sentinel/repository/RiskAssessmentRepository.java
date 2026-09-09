package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    Optional<RiskAssessment> findTopByProjectIdOrderByAssessedAtDesc(String projectId);
}