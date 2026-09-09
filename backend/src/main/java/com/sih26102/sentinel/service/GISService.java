package com.sih26102.sentinel.service;

import com.sih26102.sentinel.dto.NearbyProjectDTO;
import com.sih26102.sentinel.model.Project;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

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

                boolean sameType = target.getProjectType().equalsIgnoreCase(p.getProjectType());
                boolean isPotentialOverlap = dist <= 2.0 && sameType;
                dto.setPotentialOverlap(isPotentialOverlap);
                dto.setRelationType(isPotentialOverlap ? "POTENTIAL_OVERLAP" : "PROXIMITY_ONLY");

                results.add(dto);
            }
        }

        results.sort(Comparator.comparingDouble(NearbyProjectDTO::getDistanceKm));
        return results;
    }
}