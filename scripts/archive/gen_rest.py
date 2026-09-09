import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\backend\src\main\java\com\sih26102\sentinel"

def save(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created: {rel_path}")

# DashboardService
save("service/DashboardService.java", """package com.sih26102.sentinel.service;

import com.sih26102.sentinel.dto.DashboardSummaryDTO;
import com.sih26102.sentinel.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        
        summary.setTotalProjects(12482);
        summary.setCriticalRisk(47);
        summary.setHighRisk(386);
        summary.setDelayed(912);
        summary.setCostAnomalies(386);
        summary.setPotentialDuplicates(74);
        summary.setRepeatedFunding(91);

        Map<String, Long> riskMap = new LinkedHashMap<>();
        riskMap.put("low", 10185L);
        riskMap.put("medium", 1864L);
        riskMap.put("high", 386L);
        riskMap.put("critical", 47L);
        summary.setRiskDistribution(riskMap);

        Map<String, Long> statusMap = new LinkedHashMap<>();
        statusMap.put("RECOMMENDED", 820L);
        statusMap.put("SANCTIONED", 1450L);
        statusMap.put("IN_PROGRESS", 6120L);
        statusMap.put("DELAYED", 912L);
        statusMap.put("OVERDUE", 340L);
        statusMap.put("COMPLETED", 2840L);
        summary.setStatusDistribution(statusMap);

        List<Map<String, Object>> trends = new ArrayList<>();
        trends.add(Map.of("month", "Sep 2025", "low", 850, "medium", 120, "high", 25, "critical", 3));
        trends.add(Map.of("month", "Oct 2025", "low", 890, "medium", 135, "high", 30, "critical", 4));
        trends.add(Map.of("month", "Nov 2025", "low", 920, "medium", 140, "high", 28, "critical", 2));
        trends.add(Map.of("month", "Dec 2025", "low", 870, "medium", 160, "high", 34, "critical", 5));
        trends.add(Map.of("month", "Jan 2026", "low", 940, "medium", 155, "high", 32, "critical", 4));
        trends.add(Map.of("month", "Feb 2026", "low", 910, "medium", 170, "high", 38, "critical", 6));
        summary.setMonthlyRiskTrend(trends);

        List<Map<String, Object>> queue = new ArrayList<>();
        queue.add(Map.of(
                "projectId", "MPL-10482",
                "projectName", "Construction of Community Infrastructure",
                "district", "Pune",
                "riskScore", 94,
                "riskLevel", "CRITICAL",
                "primaryFlag", "Cost overrun, low physical progress, delay & repeated funding"
        ));
        queue.add(Map.of(
                "projectId", "MPL-9182",
                "projectName", "CC Paver Road and Stormwater Drain",
                "district", "Lucknow",
                "riskScore", 91,
                "riskLevel", "HIGH",
                "primaryFlag", "Budget overrun 20% & 180 days delay"
        ));
        queue.add(Map.of(
                "projectId", "MPL-7721",
                "projectName", "Installation of Solar RO Water Plant",
                "district", "Bengaluru Urban",
                "riskScore", 87,
                "riskLevel", "HIGH",
                "primaryFlag", "Repeated funding in same ward & milestone delay"
        ));
        queue.add(Map.of(
                "projectId", "MPL-6651",
                "projectName", "Underground Drainage and Sewer Line",
                "district", "Ahmedabad",
                "riskScore", 83,
                "riskLevel", "HIGH",
                "primaryFlag", "Potential duplicate project within 1.0 km radius"
        ));
        summary.setPriorityQueue(queue);

        return summary;
    }
}
""")

# ReportService
save("service/ReportService.java", """package com.sih26102.sentinel.service;

import com.sih26102.sentinel.dto.InvestigationReportDTO;
import com.sih26102.sentinel.dto.NearbyResponseDTO;
import com.sih26102.sentinel.dto.RiskAnalysisResponse;
import com.sih26102.sentinel.model.Payment;
import com.sih26102.sentinel.model.Project;
import com.sih26102.sentinel.model.ProjectProgress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private ProjectService projectService;

    public InvestigationReportDTO generateReport(String projectId, String username) {
        Project project = projectService.getProjectById(projectId);
        List<Payment> payments = projectService.getPayments(projectId);
        List<ProjectProgress> progress = projectService.getProgress(projectId);
        NearbyResponseDTO nearby = projectService.getNearbyProjects(projectId, 5.0);
        RiskAnalysisResponse analysis = projectService.runRiskAnalysis(projectId);

        InvestigationReportDTO dto = new InvestigationReportDTO();
        String reportId = "RPT-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + projectId.replace("MPL-", "");
        dto.setReportId(reportId);
        dto.setProjectId(projectId);
        dto.setGeneratedAt(LocalDateTime.now());
        dto.setGeneratedBy(username != null ? username : "Rajesh Sharma");
        dto.setDesignation("Deputy Commissioner / District Nodal Officer");

        Map<String, Object> data = new HashMap<>();
        data.put("project", project);
        
        Map<String, Object> fin = new HashMap<>();
        fin.put("sanctionedAmount", project.getSanctionedAmount());
        fin.put("estimatedCost", project.getEstimatedCost());
        fin.put("expenditureAmount", project.getExpenditureAmount());
        fin.put("fundUtilizationPercent", project.getFundUtilizationPercent());
        fin.put("payments", payments);
        data.put("financialSummary", fin);

        Map<String, Object> prog = new HashMap<>();
        prog.put("progressPercentage", project.getProgressPercentage());
        prog.put("expectedProgressPercentage", project.getExpectedProgressPercentage());
        prog.put("progressGap", project.getProgressGap());
        prog.put("progressLogs", progress);
        data.put("progressSummary", prog);

        Map<String, Object> time = new HashMap<>();
        time.put("sanctionDate", project.getSanctionDate());
        time.put("expectedCompletionDate", project.getExpectedCompletionDate());
        time.put("delayDays", project.getDelayDays());
        time.put("status", project.getStatus());
        data.put("timeline", time);

        data.put("ruleFindings", analysis.getRuleSignals());
        data.put("mlFindings", analysis.getMlSignals());

        Map<String, Object> mlMap = analysis.getMlSignals();
        data.put("benfordAnalysis", mlMap != null ? mlMap.get("benford") : Collections.emptyMap());
        data.put("peerComparison", mlMap != null ? mlMap.get("lof") : Collections.emptyMap());

        data.put("gisFindings", Map.of(
                "latitude", project.getLatitude(),
                "longitude", project.getLongitude(),
                "location", project.getLocation(),
                "district", project.getDistrict(),
                "state", project.getState()
        ));

        data.put("relatedProjects", nearby.getNearbyProjects());
        data.put("riskScore", analysis.getRiskScore());
        data.put("riskLevel", analysis.getRiskLevel());
        data.put("factors", analysis.getFactors());
        data.put("investigationPriority", analysis.getInvestigationPriority());

        List<String> steps = new ArrayList<>();
        steps.add("Conduct on-site physical verification of completed civil structure and compare against MB (Measurement Book) entries.");
        steps.add("Audit payment vouchers and verify authenticity of contractor milestone submission bills.");
        steps.add("Check administrative sanction records for previous related funding in the same ward / GPS coordinates.");
        steps.add("Verify GIS proximity with nearby completed project (MPL-9812) to ensure work scope distinction.");
        steps.add("Obtain formal explanation from Implementing Agency regarding 137 days schedule delay.");
        data.put("recommendedVerificationSteps", steps);

        dto.setReportData(data);
        return dto;
    }
}
""")

# AuthController
save("controller/AuthController.java", """package com.sih26102.sentinel.controller;

import com.sih26102.sentinel.dto.LoginRequest;
import com.sih26102.sentinel.dto.LoginResponse;
import com.sih26102.sentinel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser() {
        return ResponseEntity.ok(new LoginResponse(
                "mock-token",
                "officer@nic.in",
                "Rajesh Sharma",
                "DISTRICT_MONITORING_OFFICER",
                "Deputy Commissioner / Nodal Officer",
                "Pune",
                "Maharashtra"
        ));
    }
}
""")

# DashboardController
save("controller/DashboardController.java", """package com.sih26102.sentinel.controller;

import com.sih26102.sentinel.dto.DashboardSummaryDTO;
import com.sih26102.sentinel.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }
}
""")

# ProjectController
save("controller/ProjectController.java", """package com.sih26102.sentinel.controller;

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
}
""")

# ReportController
save("controller/ReportController.java", """package com.sih26102.sentinel.controller;

import com.sih26102.sentinel.dto.InvestigationReportDTO;
import com.sih26102.sentinel.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/{projectId}")
    public ResponseEntity<InvestigationReportDTO> generateReport(
            @PathVariable String projectId,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "Rajesh Sharma";
        return ResponseEntity.ok(reportService.generateReport(projectId, username));
    }
}
""")
