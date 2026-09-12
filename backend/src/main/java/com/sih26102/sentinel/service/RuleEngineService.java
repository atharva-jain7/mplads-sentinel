package com.sih26102.sentinel.service;

import com.sih26102.sentinel.dto.RiskFactorDTO;
import com.sih26102.sentinel.model.Project;
import com.sih26102.sentinel.model.RelatedProject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RuleEngineService {

    public List<RiskFactorDTO> evaluateRules(Project project, List<RelatedProject> relatedProjects) {
        List<RiskFactorDTO> signals = new ArrayList<>();

        // RULE 1: Cost Overrun
        if (project.getExpenditureAmount() != null && project.getEstimatedCost() != null &&
            project.getExpenditureAmount() > project.getEstimatedCost()) {
            double overrunPct = ((project.getExpenditureAmount() - project.getEstimatedCost()) / project.getEstimatedCost()) * 100.0;
            int score = (int) Math.min(95, 60 + (overrunPct * 1.5));
            signals.add(new RiskFactorDTO(
                "COST_ANOMALY",
                "HIGH",
                score,
                String.format("Expenditure exceeds initial estimated budget by %.1f%% (Cost Overrun Anomaly)", overrunPct)
            ));
        }

        // RULE 2: Low Fund Utilization
        if (project.getFundUtilizationPercent() != null && project.getFundUtilizationPercent() < 25.0 &&
            (project.getDelayDays() != null && project.getDelayDays() > 30)) {
            signals.add(new RiskFactorDTO(
                "FUND_UTILIZATION_ANOMALY",
                "MEDIUM",
                65,
                String.format("Fund utilization is unusually low (%.1f%%) despite elapsed schedule timeline", project.getFundUtilizationPercent())
            ));
        }

        // RULE 3: Delay
        if (project.getDelayDays() != null && project.getDelayDays() > 0) {
            String severity = project.getDelayDays() > 90 ? "HIGH" : (project.getDelayDays() > 30 ? "MEDIUM" : "LOW");
            int score = Math.min(95, 40 + (project.getDelayDays() / 2));
            signals.add(new RiskFactorDTO(
                "DELAY",
                severity,
                score,
                String.format("Project is %d days overdue past expected completion date", project.getDelayDays())
            ));
        }

        // RULE 4: Incomplete Work / Progress Gap
        if (project.getProgressPercentage() != null && project.getExpectedProgressPercentage() != null &&
            project.getProgressPercentage() < project.getExpectedProgressPercentage()) {
            double gap = project.getExpectedProgressPercentage() - project.getProgressPercentage();
            if (gap > 15.0) {
                String severity = gap > 35.0 ? "HIGH" : "MEDIUM";
                int score = (int) Math.min(92, 50 + gap);
                signals.add(new RiskFactorDTO(
                    "PROGRESS_DELAY",
                    severity,
                    score,
                    String.format("Physical progress (%.1f%%) is significantly behind expected milestone (%.1f%%)",
                        project.getProgressPercentage(), project.getExpectedProgressPercentage())
                ));
            }
        }

        // RULE 5: Expenditure vs Physical Progress Mismatch
        if (project.getFundUtilizationPercent() != null && project.getProgressPercentage() != null) {
            double mismatch = project.getFundUtilizationPercent() - project.getProgressPercentage();
            if (mismatch > 25.0) {
                signals.add(new RiskFactorDTO(
                    "PROGRESS_EXPENDITURE_MISMATCH",
                    "HIGH",
                    88,
                    String.format("Expenditure (%.1f%%) is disproportionately higher than physical progress (%.1f%%)",
                        project.getFundUtilizationPercent(), project.getProgressPercentage())
                ));
            }
        }

        // RULE 6: Repeated Funding
        long repeatedCount = relatedProjects != null ? relatedProjects.stream()
                .filter(rp -> "REPEATED_FUNDING".equalsIgnoreCase(rp.getRelationshipType()) ||
                              "POTENTIAL_OVERLAP".equalsIgnoreCase(rp.getRelationshipType())).count() : 0;
        if (repeatedCount > 0) {
            signals.add(new RiskFactorDTO(
                "REPEATED_FUNDING",
                "HIGH",
                80,
                String.format("%d previous related funding projects identified at this location/category", repeatedCount)
            ));
        }

        // RULE 7: Potential Duplicate
        if (relatedProjects != null) {
            RelatedProject nearestDuplicate = relatedProjects.stream()
                    .filter(rp -> rp.getDistanceKm() != null && rp.getDistanceKm() <= 1.0)
                    .findFirst().orElse(null);
            if (nearestDuplicate != null) {
                String overlapId = nearestDuplicate.getRelatedProjectId() != null ? nearestDuplicate.getRelatedProjectId() : "nearby work";
                signals.add(new RiskFactorDTO(
                    "POTENTIAL_DUPLICATE",
                    "MEDIUM",
                    75,
                    String.format("Similar project (%s) found within close spatial proximity (%.1f km) - potential overlap review recommended",
                            overlapId, nearestDuplicate.getDistanceKm())
                ));
            }
        }

        return signals;
    }
}