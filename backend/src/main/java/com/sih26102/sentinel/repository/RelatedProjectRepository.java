package com.sih26102.sentinel.repository;

import com.sih26102.sentinel.model.RelatedProject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RelatedProjectRepository extends JpaRepository<RelatedProject, Long> {
    List<RelatedProject> findByProjectId(String projectId);
}