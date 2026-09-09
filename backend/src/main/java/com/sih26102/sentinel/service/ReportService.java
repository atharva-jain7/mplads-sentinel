package com.sih26102.sentinel.service;

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
        steps.add("Conduct on-site physical verification of completed civil structure in " + project.getDistrict() + " and compare against MB (Measurement Book) records.");
        steps.add("Audit payment vouchers and verify milestone submission bills from contractor (" + project.getContractorName() + ").");
        if (project.getDelayDays() > 0) {
            steps.add("Obtain formal explanation from Implementing Agency (" + project.getImplementingAgency() + ") regarding " + project.getDelayDays() + " days schedule delay.");
        }
        if (nearby.getNearbyProjects() != null && !nearby.getNearbyProjects().isEmpty()) {
            steps.add("Verify GIS proximity with " + nearby.getNearbyProjects().size() + " nearby works to ensure distinct scope of work.");
        }
        steps.add("Review physical milestone inspection logs against financial disbursement velocity.");
        data.put("recommendedVerificationSteps", steps);

        dto.setReportData(data);
        return dto;
    }
}