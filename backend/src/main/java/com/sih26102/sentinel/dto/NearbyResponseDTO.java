package com.sih26102.sentinel.dto;

import com.sih26102.sentinel.model.Project;
import java.util.List;

public class NearbyResponseDTO {
    private Project targetProject;
    private List<NearbyProjectDTO> nearbyProjects;

    public NearbyResponseDTO() {}
    public NearbyResponseDTO(Project targetProject, List<NearbyProjectDTO> nearbyProjects) {
        this.targetProject = targetProject;
        this.nearbyProjects = nearbyProjects;
    }

    public Project getTargetProject() { return targetProject; }
    public void setTargetProject(Project targetProject) { this.targetProject = targetProject; }
    public List<NearbyProjectDTO> getNearbyProjects() { return nearbyProjects; }
    public void setNearbyProjects(List<NearbyProjectDTO> nearbyProjects) { this.nearbyProjects = nearbyProjects; }
}