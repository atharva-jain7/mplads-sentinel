package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.ProjectProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectProgressRepository extends JpaRepository<ProjectProgress, Long> {
    List<ProjectProgress> findByProjectIdOrderByInspectionDateDesc(String projectId);
}