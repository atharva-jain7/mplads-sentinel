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