package com.sih26102.sentinel.controller;

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