package com.sih26102.sentinel.controller;

import com.sih26102.sentinel.dto.NearbyResponseDTO;
import com.sih26102.sentinel.dto.RiskAnalysisResponse;
import com.sih26102.sentinel.model.Payment;
import com.sih26102.sentinel.model.Project;
import com.sih26102.sentinel.model.ProjectProgress;
import com.sih26102.sentinel.model.RiskAssessment;
import com.sih26102.sentinel.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<Project>> getProjects(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String projectType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false, defaultValue = "riskScore") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDirection,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        return ResponseEntity.ok(projectService.getProjects(
                query, district, projectType, status, riskLevel, sortBy, sortDirection, page, size
        ));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProject(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @GetMapping("/{projectId}/payments")
    public ResponseEntity<List<Payment>> getPayments(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.getPayments(projectId));
    }

    @GetMapping("/{projectId}/progress")
    public ResponseEntity<List<ProjectProgress>> getProgress(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.getProgress(projectId));
    }

    @GetMapping("/{projectId}/risk")
    public ResponseEntity<RiskAssessment> getRisk(@PathVariable String projectId) {
        return projectService.getLatestRiskAssessment(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{projectId}/analyze")
    public ResponseEntity<RiskAnalysisResponse> runAnalysis(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.runRiskAnalysis(projectId));
    }

    @GetMapping("/nearby")
    public ResponseEntity<NearbyResponseDTO> getNearby(
            @RequestParam String projectId,
            @RequestParam(required = false, defaultValue = "5.0") double radiusKm) {
        return ResponseEntity.ok(projectService.getNearbyProjects(projectId, radiusKm));
    }

    @GetMapping("/map")
    public ResponseEntity<List<Map<String, Object>>> getMapProjects() {
        return ResponseEntity.ok(projectService.getMapProjects());
    }

    @GetMapping("/districts")
    public ResponseEntity<List<String>> getDistricts() {
        return ResponseEntity.ok(projectService.getDistricts());
    }

    @PostMapping("/import-csv")
    public ResponseEntity<Map<String, Object>> importCsv(@RequestBody String csvContent) {
        return ResponseEntity.ok(projectService.importCsvProjects(csvContent));
    }
}