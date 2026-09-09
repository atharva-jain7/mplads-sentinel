package com.sih26102.sentinel.service;

import com.sih26102.sentinel.dto.*;
import com.sih26102.sentinel.model.*;
import com.sih26102.sentinel.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ProjectProgressRepository progressRepository;

    @Autowired
    private RelatedProjectRepository relatedProjectRepository;

    @Autowired
    private RiskAssessmentRepository riskAssessmentRepository;

    @Autowired
    private RuleEngineService ruleEngineService;

    @Autowired
    private MLServiceConnector mlServiceConnector;

    @Autowired
    private RiskFusionService riskFusionService;

    @Autowired
    private GISService gisService;

    public Page<Project> getProjects(
            String query, String district, String projectType, String status, String riskLevel,
            String sortBy, String sortDirection, int page, int size) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection != null ? sortDirection : "desc"),
                            sortBy != null ? sortBy : "riskScore");
        Pageable pageable = PageRequest.of(page, size, sort);

        return projectRepository.findWithFilters(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                (district != null && !district.trim().isEmpty()) ? district.trim() : null,
                (projectType != null && !projectType.trim().isEmpty()) ? projectType.trim() : null,
                (status != null && !status.trim().isEmpty()) ? status.trim() : null,
                (riskLevel != null && !riskLevel.trim().isEmpty()) ? riskLevel.trim() : null,
                pageable
        );
    }

    public Project getProjectById(String projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
    }

    public List<Payment> getPayments(String projectId) {
        return paymentRepository.findByProjectIdOrderByPaymentDateAsc(projectId);
    }

    public List<ProjectProgress> getProgress(String projectId) {
        return progressRepository.findByProjectIdOrderByInspectionDateDesc(projectId);
    }

    public List<RelatedProject> getRelatedProjects(String projectId) {
        return relatedProjectRepository.findByProjectId(projectId);
    }

    public Optional<RiskAssessment> getLatestRiskAssessment(String projectId) {
        return riskAssessmentRepository.findTopByProjectIdOrderByAssessedAtDesc(projectId);
    }

    public NearbyResponseDTO getNearbyProjects(String projectId, double radiusKm) {
        Project target = getProjectById(projectId);
        List<Project> pool = projectRepository.findAll();
        List<NearbyProjectDTO> nearby = gisService.findNearbyProjects(target, pool, radiusKm);
        return new NearbyResponseDTO(target, nearby);
    }

    public List<Map<String, Object>> getMapProjects() {
        List<Project> projects = projectRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Project p : projects) {
            if (p.getLatitude() != null && p.getLongitude() != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("projectId", p.getProjectId());
                map.put("projectName", p.getProjectName());
                map.put("projectType", p.getProjectType());
                map.put("district", p.getDistrict());
                map.put("state", p.getState());
                map.put("latitude", p.getLatitude());
                map.put("longitude", p.getLongitude());
                map.put("riskScore", p.getRiskScore());
                map.put("riskLevel", p.getRiskLevel());
                map.put("status", p.getStatus());
                map.put("sanctionedAmount", p.getSanctionedAmount());
                map.put("progressPercentage", p.getProgressPercentage());
                list.add(map);
            }
        }
        return list;
    }

    public List<String> getDistricts() {
        return projectRepository.findDistinctDistricts();
    }

    @Transactional
    public RiskAnalysisResponse runRiskAnalysis(String projectId) {
        Project project = getProjectById(projectId);
        List<Payment> payments = getPayments(projectId);
        List<RelatedProject> related = getRelatedProjects(projectId);
        List<Project> districtPool = projectRepository.findByDistrict(project.getDistrict());

        List<RiskFactorDTO> ruleSignals = ruleEngineService.evaluateRules(project, related);

        Map<String, Object> ifResult = mlServiceConnector.analyzeIsolationForest(project, districtPool);
        Map<String, Object> lofResult = mlServiceConnector.analyzeLOF(project, districtPool);
        Map<String, Object> benfordResult = mlServiceConnector.analyzeBenford(project, payments);

        boolean hasRepeated = ruleSignals.stream().anyMatch(r -> "REPEATED_FUNDING".equals(r.getType()));
        boolean hasDuplicate = ruleSignals.stream().anyMatch(r -> "POTENTIAL_DUPLICATE".equals(r.getType()));

        RiskAnalysisResponse analysis = riskFusionService.fuse(
                project, ruleSignals, ifResult, lofResult, benfordResult, hasRepeated, hasDuplicate
        );

        project.setRiskScore(analysis.getRiskScore());
        project.setRiskLevel(analysis.getRiskLevel());
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);

        RiskAssessment assessment = new RiskAssessment();
        assessment.setProjectId(projectId);
        assessment.setRiskScore(analysis.getRiskScore());
        assessment.setRiskLevel(analysis.getRiskLevel());
        assessment.setInvestigationPriority(analysis.getInvestigationPriority());
        assessment.setRecommendedAction(analysis.getRecommendedAction());
        assessment.setAssessedAt(LocalDateTime.now());

        if (analysis.getFactors() != null) {
            for (RiskFactorDTO f : analysis.getFactors()) {
                RiskFactor factor = new RiskFactor(f.getType(), f.getSeverity(), f.getScore(), f.getExplanation());
                factor.setAssessment(assessment);
                assessment.getFactors().add(factor);
            }
        }

        riskAssessmentRepository.save(assessment);

        return analysis;
    }

    @Transactional
    public Map<String, Object> importCsvProjects(String csvContent) {
        if (csvContent == null || csvContent.trim().isEmpty()) {
            throw new IllegalArgumentException("CSV content is empty.");
        }

        String[] lines = csvContent.split("\r?\n");
        if (lines.length < 2) {
            throw new IllegalArgumentException("CSV requires at least a header row and 1 data row.");
        }

        String[] headers = lines[0].split(",");
        Map<String, Integer> headerMap = new HashMap<>();
        for (int i = 0; i < headers.length; i++) {
            headerMap.put(headers[i].trim().toLowerCase().replaceAll("[^a-z0-9]", ""), i);
        }

        List<Project> importedList = new ArrayList<>();
        int critical = 0;
        int high = 0;

        for (int i = 1; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;

            String[] tokens = line.split(",");
            for (int t = 0; t < tokens.length; t++) {
                String val = tokens[t].trim();
                if (val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) {
                    val = val.substring(1, val.length() - 1).trim();
                }
                tokens[t] = val;
            }

            String projectId = getVal(tokens, headerMap, "projectid", "MPL-" + (20000 + i));
            String projectName = getVal(tokens, headerMap, "projectname", "Imported Real Project " + i);
            String projectType = getVal(tokens, headerMap, "projecttype", "Community Infrastructure");
            String state = getVal(tokens, headerMap, "state", "Maharashtra");
            String district = getVal(tokens, headerMap, "district", "Pune");
            String constituency = getVal(tokens, headerMap, "constituency", "Pune Parliamentary Constituency");
            String location = getVal(tokens, headerMap, "location", "Ward " + i + ", " + district);

            double sanctioned = parseDouble(getVal(tokens, headerMap, "sanctionedamount", "3000000"), 3000000.0);
            double estimated = parseDouble(getVal(tokens, headerMap, "estimatedcost", String.valueOf(sanctioned)), sanctioned);
            double expenditure = parseDouble(getVal(tokens, headerMap, "expenditureamount", "2400000"), 2400000.0);
            double progress = parseDouble(getVal(tokens, headerMap, "progresspercentage", "45.0"), 45.0);
            double expectedProgress = parseDouble(getVal(tokens, headerMap, "expectedprogresspercentage", "75.0"), 75.0);
            int delayDays = parseInt(getVal(tokens, headerMap, "delaydays", "45"), 45);
            String status = getVal(tokens, headerMap, "status", "IN_PROGRESS");
            String sanctionDate = getVal(tokens, headerMap, "sanctiondate", "2024-02-10");
            String completionDate = getVal(tokens, headerMap, "expectedcompletiondate", "2025-05-30");
            String agency = getVal(tokens, headerMap, "implementingagency", "District Engineering Cell");
            String contractor = getVal(tokens, headerMap, "contractorname", "Registered Agency Vendor");
            String desc = getVal(tokens, headerMap, "description", "Official real project record imported from external dataset.");

            double lat = parseDouble(getVal(tokens, headerMap, "latitude", "18.5204"), 18.5204);
            double lon = parseDouble(getVal(tokens, headerMap, "longitude", "73.8567"), 73.8567);

            Project p = new Project();
            p.setProjectId(projectId);
            p.setProjectName(projectName);
            p.setProjectType(projectType);
            p.setState(state);
            p.setDistrict(district);
            p.setConstituency(constituency);
            p.setLocation(location);
            p.setLatitude(lat);
            p.setLongitude(lon);
            p.setSanctionedAmount(sanctioned);
            p.setEstimatedCost(estimated);
            p.setExpenditureAmount(expenditure);
            p.setFundUtilizationPercent(Math.round((expenditure / (sanctioned > 0 ? sanctioned : 1.0)) * 1000.0) / 10.0);
            p.setProgressPercentage(progress);
            p.setExpectedProgressPercentage(expectedProgress);
            p.setProgressGap(Math.max(0.0, Math.round((expectedProgress - progress) * 10.0) / 10.0));
            p.setDelayDays(delayDays);
            p.setStatus(status);
            p.setSanctionDate(parseDate(sanctionDate, LocalDate.of(2024, 1, 15)));
            p.setExpectedCompletionDate(parseDate(completionDate, LocalDate.of(2025, 6, 30)));
            p.setImplementingAgency(agency);
            p.setContractorName(contractor);
            p.setDescription(desc);
            p.setCreatedAt(LocalDateTime.now());
            p.setUpdatedAt(LocalDateTime.now());

            projectRepository.save(p);

            // Execute automated ML & rule analysis on the imported record
            try {
                RiskAnalysisResponse analysis = runRiskAnalysis(projectId);
                p.setRiskScore(analysis.getRiskScore());
                p.setRiskLevel(analysis.getRiskLevel());
                if (analysis.getRiskScore() >= 80) critical++;
                else if (analysis.getRiskScore() >= 60) high++;
            } catch (Exception ex) {
                // Fallback score calculation if ML service is busy
                int baseScore = (int) Math.round((p.getProgressGap() * 0.4) + (p.getFundUtilizationPercent() * 0.3) + Math.min(30, p.getDelayDays() * 0.2));
                baseScore = Math.min(99, Math.max(15, baseScore));
                p.setRiskScore(baseScore);
                p.setRiskLevel(baseScore >= 80 ? "CRITICAL" : baseScore >= 60 ? "HIGH" : "MEDIUM");
                if (baseScore >= 80) critical++;
                else if (baseScore >= 60) high++;
                projectRepository.save(p);
            }

            importedList.add(p);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalImported", importedList.size());
        result.put("criticalRiskCount", critical);
        result.put("highRiskCount", high);
        result.put("importedProjects", importedList);
        return result;
    }

    private String getVal(String[] tokens, Map<String, Integer> headerMap, String key, String defaultVal) {
        String cleanKey = key.toLowerCase().replaceAll("[^a-z0-9]", "");
        Integer idx = headerMap.get(cleanKey);
        if (idx != null && idx < tokens.length && !tokens[idx].trim().isEmpty()) {
            return tokens[idx].trim();
        }
        return defaultVal;
    }

    private double parseDouble(String s, double defaultVal) {
        try {
            return Double.parseDouble(s.replaceAll("[^0-9.-]", ""));
        } catch (Exception e) {
            return defaultVal;
        }
    }


    private LocalDate parseDate(String s, LocalDate defaultVal) {
        try {
            return LocalDate.parse(s.trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }
    private int parseInt(String s, int defaultVal) {
        try {
            return Integer.parseInt(s.replaceAll("[^0-9-]", ""));
        } catch (Exception e) {
            return defaultVal;
        }
    }
}