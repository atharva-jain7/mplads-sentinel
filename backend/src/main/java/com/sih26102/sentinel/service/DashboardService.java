package com.sih26102.sentinel.service;

import com.sih26102.sentinel.dto.DashboardSummaryDTO;
import com.sih26102.sentinel.model.Project;
import com.sih26102.sentinel.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    public DashboardSummaryDTO getDashboardSummary(String district, String state) {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        
        List<Project> pool;
        String jurisdictionLabel;
        if (district != null && !district.trim().isEmpty()) {
            pool = projectRepository.findByDistrict(district.trim());
            jurisdictionLabel = district.trim() + " District Administration";
        } else if (state != null && !state.trim().isEmpty()) {
            pool = projectRepository.findByState(state.trim());
            jurisdictionLabel = state.trim() + " State Oversight";
        } else {
            pool = projectRepository.findAll();
            jurisdictionLabel = "National Central Oversight (All India)";
        }

        long total = pool.size();
        summary.setTotalProjects(total);
        summary.setJurisdictionLabel(jurisdictionLabel);
        summary.setDatasetType("Demonstration Dataset");

        long criticalCount = 0;
        long highCount = 0;
        long mediumCount = 0;
        long lowCount = 0;
        long delayedCount = 0;
        long costAnomalyCount = 0;
        long potentialDuplicates = 0;
        long repeatedFunding = 0;
        double rupeesAtRisk = 0.0;
        double totalSanctioned = 0.0;
        double totalDisbursed = 0.0;

        // Data Quality Counters
        long validFinancial = 0;
        long validProgress = 0;
        long validGps = 0;
        long validCompletion = 0;

        Map<String, Long> statusMap = new LinkedHashMap<>();
        statusMap.put("RECOMMENDED", 0L);
        statusMap.put("SANCTIONED", 0L);
        statusMap.put("IN_PROGRESS", 0L);
        statusMap.put("DELAYED", 0L);
        statusMap.put("OVERDUE", 0L);
        statusMap.put("COMPLETED", 0L);

        for (Project p : pool) {
            String rl = p.getRiskLevel() != null ? p.getRiskLevel().toUpperCase() : "LOW";
            if ("CRITICAL".equals(rl)) {
                criticalCount++;
                if (p.getExpenditureAmount() != null) rupeesAtRisk += p.getExpenditureAmount();
            } else if ("HIGH".equals(rl)) {
                highCount++;
                if (p.getExpenditureAmount() != null) rupeesAtRisk += p.getExpenditureAmount();
            } else if ("MEDIUM".equals(rl)) {
                mediumCount++;
            } else {
                lowCount++;
            }

            if (p.getDelayDays() != null && p.getDelayDays() > 30) {
                delayedCount++;
            }

            if (p.getExpenditureAmount() != null && p.getEstimatedCost() != null && p.getExpenditureAmount() > p.getEstimatedCost()) {
                costAnomalyCount++;
            }

            if (p.getRiskScore() != null && p.getRiskScore() >= 80) {
                potentialDuplicates++;
            }
            if (p.getFundUtilizationPercent() != null && p.getFundUtilizationPercent() > 95 && p.getProgressPercentage() != null && p.getProgressPercentage() < 50) {
                repeatedFunding++;
            }

            if (p.getSanctionedAmount() != null) totalSanctioned += p.getSanctionedAmount();
            if (p.getExpenditureAmount() != null) totalDisbursed += p.getExpenditureAmount();

            // Status tracking
            String st = p.getStatus() != null ? p.getStatus().toUpperCase() : "IN_PROGRESS";
            statusMap.put(st, statusMap.getOrDefault(st, 0L) + 1L);

            // Data Quality Check
            if (p.getSanctionedAmount() != null && p.getSanctionedAmount() > 0 && p.getExpenditureAmount() != null) validFinancial++;
            if (p.getProgressPercentage() != null && p.getExpectedProgressPercentage() != null) validProgress++;
            if (p.getLatitude() != null && p.getLongitude() != null && Math.abs(p.getLatitude()) > 0.1) validGps++;
            if (p.getSanctionDate() != null && p.getExpectedCompletionDate() != null) validCompletion++;
        }

        summary.setCriticalRisk(criticalCount);
        summary.setHighRisk(highCount);
        summary.setDelayed(delayedCount);
        summary.setCostAnomalies(costAnomalyCount);
        summary.setPotentialDuplicates(Math.max(potentialDuplicates / 2, 1));
        summary.setRepeatedFunding(repeatedFunding);
        summary.setRupeesAtRisk(rupeesAtRisk);
        summary.setTotalSanctioned(totalSanctioned);
        summary.setTotalDisbursed(totalDisbursed);

        Map<String, Long> riskMap = new LinkedHashMap<>();
        riskMap.put("low", lowCount);
        riskMap.put("medium", mediumCount);
        riskMap.put("high", highCount);
        riskMap.put("critical", criticalCount);
        summary.setRiskDistribution(riskMap);
        summary.setStatusDistribution(statusMap);

        // Data quality calculation
        Map<String, Object> quality = new LinkedHashMap<>();
        double finPct = total > 0 ? Math.round((validFinancial * 100.0 / total) * 10.0) / 10.0 : 100.0;
        double progPct = total > 0 ? Math.round((validProgress * 100.0 / total) * 10.0) / 10.0 : 100.0;
        double gpsPct = total > 0 ? Math.round((validGps * 100.0 / total) * 10.0) / 10.0 : 100.0;
        double compPct = total > 0 ? Math.round((validCompletion * 100.0 / total) * 10.0) / 10.0 : 100.0;
        double overallQuality = Math.round(((finPct + progPct + gpsPct + compPct) / 4.0) * 10.0) / 10.0;

        quality.put("overallScore", overallQuality);
        quality.put("financialCompleteness", finPct);
        quality.put("progressCompleteness", progPct);
        quality.put("gpsCompleteness", gpsPct);
        quality.put("completionCompleteness", compPct);
        quality.put("recordsAnalyzed", total);
        quality.put("lastUpdated", java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        summary.setDataQuality(quality);

        // Monthly risk trend (dynamically scaled to pool size)
        List<Map<String, Object>> trends = new ArrayList<>();
        String[] months = {"Sep", "Oct", "Nov", "Dec", "Jan", "Feb"};
        for (int i = 0; i < months.length; i++) {
            long mCrit = Math.max(1, (criticalCount * (i + 1)) / (months.length * 2));
            long mHigh = Math.max(2, (highCount * (i + 1)) / (months.length * 2));
            long mLow = Math.max(5, (lowCount * (i + 1)) / (months.length * 2));
            long mMed = Math.max(3, (mediumCount * (i + 1)) / (months.length * 2));
            trends.add(Map.of("month", months[i] + " 2025/26", "low", mLow, "medium", mMed, "high", mHigh, "critical", mCrit));
        }
        summary.setMonthlyRiskTrend(trends);

        // Priority queue sorted by risk score descending
        pool.sort((a, b) -> Integer.compare(
            b.getRiskScore() != null ? b.getRiskScore() : 0,
            a.getRiskScore() != null ? a.getRiskScore() : 0
        ));

        List<Map<String, Object>> queue = new ArrayList<>();
        int limit = Math.min(10, pool.size());
        for (int i = 0; i < limit; i++) {
            Project p = pool.get(i);
            String primaryFlag = p.getProgressGap() != null && p.getProgressGap() > 20 ? 
                    String.format("Milestone gap of %.1f%% & %dd delay", p.getProgressGap(), p.getDelayDays() != null ? p.getDelayDays() : 0) :
                    (p.getDelayDays() != null && p.getDelayDays() > 0 ? p.getDelayDays() + " days schedule delay" : "Cost & progress anomaly");
            
            Map<String, Object> item = new HashMap<>();
            item.put("projectId", p.getProjectId());
            item.put("projectName", p.getProjectName());
            item.put("projectType", p.getProjectType());
            item.put("district", p.getDistrict());
            item.put("state", p.getState());
            item.put("sanctionedAmount", p.getSanctionedAmount());
            item.put("expenditureAmount", p.getExpenditureAmount());
            item.put("progressPercentage", p.getProgressPercentage());
            item.put("delayDays", p.getDelayDays());
            item.put("riskScore", p.getRiskScore() != null ? p.getRiskScore() : 50);
            item.put("riskLevel", p.getRiskLevel() != null ? p.getRiskLevel() : "MEDIUM");
            item.put("primaryFlag", primaryFlag);
            queue.add(item);
        }
        summary.setPriorityQueue(queue);

        return summary;
    }
}