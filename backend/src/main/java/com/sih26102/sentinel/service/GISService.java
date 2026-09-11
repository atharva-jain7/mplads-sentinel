package com.sih26102.sentinel.service;

import com.sih26102.sentinel.dto.NearbyProjectDTO;
import com.sih26102.sentinel.model.Project;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GISService {

    public double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(EARTH_RADIUS_KM * c * 100.0) / 100.0;
    }

    private double computeWordOverlap(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        Set<String> words1 = new HashSet<>(Arrays.asList(s1.toLowerCase().split("\\W+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(s2.toLowerCase().split("\\W+")));
        words1.removeIf(w -> w.length() < 3);
        words2.removeIf(w -> w.length() < 3);
        if (words1.isEmpty() || words2.isEmpty()) return 0.0;
        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);
        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);
        return ((double) intersection.size()) / union.size();
    }

    public List<NearbyProjectDTO> findNearbyProjects(Project target, List<Project> pool, double maxRadiusKm) {
        List<NearbyProjectDTO> results = new ArrayList<>();
        if (target.getLatitude() == null || target.getLongitude() == null) {
            return results;
        }

        for (Project p : pool) {
            if (p.getProjectId().equals(target.getProjectId()) || p.getLatitude() == null || p.getLongitude() == null) {
                continue;
            }
            double dist = calculateDistanceKm(target.getLatitude(), target.getLongitude(), p.getLatitude(), p.getLongitude());
            if (dist <= maxRadiusKm) {
                NearbyProjectDTO dto = new NearbyProjectDTO();
                dto.setProjectId(p.getProjectId());
                dto.setProjectName(p.getProjectName());
                dto.setProjectType(p.getProjectType());
                dto.setSanctionedAmount(p.getSanctionedAmount());
                dto.setExpenditureAmount(p.getExpenditureAmount());
                dto.setProgressPercentage(p.getProgressPercentage());
                dto.setStatus(p.getStatus());
                dto.setRiskScore(p.getRiskScore());
                dto.setRiskLevel(p.getRiskLevel());
                dto.setLatitude(p.getLatitude());
                dto.setLongitude(p.getLongitude());
                dto.setDistanceKm(dist);

                // Multi-factor duplicate evaluation
                List<String> evidence = new ArrayList<>();
                int dupScore = 0;

                // 1. Distance factor
                if (dist < 0.5) {
                    dupScore += 35;
                    evidence.add(String.format("Distance: %.0f m (Immediate Proximity)", dist * 1000));
                } else if (dist < 1.0) {
                    dupScore += 25;
                    evidence.add(String.format("Distance: %.0f m", dist * 1000));
                } else if (dist < 2.0) {
                    dupScore += 15;
                    evidence.add(String.format("Distance: %.1f km", dist));
                } else {
                    dupScore += 5;
                    evidence.add(String.format("Distance: %.1f km", dist));
                }

                // 2. Category match
                boolean sameType = target.getProjectType() != null && target.getProjectType().equalsIgnoreCase(p.getProjectType());
                if (sameType) {
                    dupScore += 30;
                    evidence.add("Same Asset Category: " + p.getProjectType());
                }

                // 3. Name & description text overlap
                double overlap = computeWordOverlap(target.getProjectName(), p.getProjectName());
                if (overlap > 0.2) {
                    int overlapPts = (int) Math.min(25, Math.round(overlap * 35));
                    dupScore += overlapPts;
                    evidence.add(String.format("Title similarity: %.0f%% lexical overlap", overlap * 100));
                }

                // 4. Financial cost similarity
                if (target.getSanctionedAmount() != null && p.getSanctionedAmount() != null && target.getSanctionedAmount() > 0) {
                    double maxCost = Math.max(target.getSanctionedAmount(), p.getSanctionedAmount());
                    double costDiffRatio = Math.abs(target.getSanctionedAmount() - p.getSanctionedAmount()) / maxCost;
                    if (costDiffRatio < 0.25) {
                        dupScore += 15;
                        evidence.add(String.format("Cost alignment: within %.0f%% sanctioned budget", costDiffRatio * 100));
                    }
                }

                dupScore = Math.min(96, dupScore);
                dto.setPotentialDuplicateScore(dupScore);
                dto.setEvidenceList(evidence);

                boolean isPotentialDup = dupScore >= 60;
                dto.setPotentialOverlap(isPotentialDup);
                dto.setRelationType(isPotentialDup ? "POTENTIAL_DUPLICATE" : "PROXIMITY_ONLY");

                results.add(dto);
            }
        }

        results.sort(Comparator.comparingDouble(NearbyProjectDTO::getDistanceKm));
        return results;
    }
}