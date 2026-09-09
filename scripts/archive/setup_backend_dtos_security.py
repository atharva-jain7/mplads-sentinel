# -*- coding: utf-8 -*-
import os

BASE_DIR = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\backend"
SRC = os.path.join(BASE_DIR, "src", "main", "java", "com", "sih26102", "sentinel")

def write_file(subpath, content):
    full_path = os.path.join(SRC, subpath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip())

# ==========================================
# 3. DTOs
# ==========================================
write_file("dto/LoginRequest.java", """
package com.sih26102.sentinel.dto;

public class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
""")

write_file("dto/LoginResponse.java", """
package com.sih26102.sentinel.dto;

public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private String username;
    private String fullName;
    private String role;
    private String designation;
    private String district;
    private String state;

    public LoginResponse() {}
    public LoginResponse(String token, String username, String fullName, String role, String designation, String district, String state) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.designation = designation;
        this.district = district;
        this.state = state;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
""")

write_file("dto/RiskFactorDTO.java", """
package com.sih26102.sentinel.dto;

public class RiskFactorDTO {
    private String type;
    private String severity;
    private Integer score;
    private String explanation;

    public RiskFactorDTO() {}
    public RiskFactorDTO(String type, String severity, Integer score, String explanation) {
        this.type = type;
        this.severity = severity;
        this.score = score;
        this.explanation = explanation;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
""")

write_file("dto/RiskAnalysisResponse.java", """
package com.sih26102.sentinel.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class RiskAnalysisResponse {
    private String projectId;
    private Integer riskScore;
    private String riskLevel;
    private LocalDateTime analyzedAt = LocalDateTime.now();
    private List<RiskFactorDTO> ruleSignals;
    private Map<String, Object> mlSignals;
    private List<RiskFactorDTO> factors;
    private String investigationPriority;
    private String recommendedAction;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
    public List<RiskFactorDTO> getRuleSignals() { return ruleSignals; }
    public void setRuleSignals(List<RiskFactorDTO> ruleSignals) { this.ruleSignals = ruleSignals; }
    public Map<String, Object> getMlSignals() { return mlSignals; }
    public void setMlSignals(Map<String, Object> mlSignals) { this.mlSignals = mlSignals; }
    public List<RiskFactorDTO> getFactors() { return factors; }
    public void setFactors(List<RiskFactorDTO> factors) { this.factors = factors; }
    public String getInvestigationPriority() { return investigationPriority; }
    public void setInvestigationPriority(String investigationPriority) { this.investigationPriority = investigationPriority; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
}
""")

write_file("dto/NearbyProjectDTO.java", """
package com.sih26102.sentinel.dto;

public class NearbyProjectDTO {
    private String projectId;
    private String projectName;
    private String projectType;
    private Double sanctionedAmount;
    private Double expenditureAmount;
    private Double progressPercentage;
    private String status;
    private Integer riskScore;
    private String riskLevel;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private Boolean potentialOverlap;
    private String relationType;

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
    public Double getSanctionedAmount() { return sanctionedAmount; }
    public void setSanctionedAmount(Double sanctionedAmount) { this.sanctionedAmount = sanctionedAmount; }
    public Double getExpenditureAmount() { return expenditureAmount; }
    public void setExpenditureAmount(Double expenditureAmount) { this.expenditureAmount = expenditureAmount; }
    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Boolean getPotentialOverlap() { return potentialOverlap; }
    public void setPotentialOverlap(Boolean potentialOverlap) { this.potentialOverlap = potentialOverlap; }
    public String getRelationType() { return relationType; }
    public void setRelationType(String relationType) { this.relationType = relationType; }
}
""")

write_file("dto/NearbyResponseDTO.java", """
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
""")

write_file("dto/DashboardSummaryDTO.java", """
package com.sih26102.sentinel.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {
    private long totalProjects;
    private long criticalRisk;
    private long highRisk;
    private long delayed;
    private long costAnomalies;
    private long potentialDuplicates;
    private long repeatedFunding;
    private Map<String, Long> riskDistribution;
    private Map<String, Long> statusDistribution;
    private List<Map<String, Object>> monthlyRiskTrend;
    private List<Map<String, Object>> priorityQueue;

    public long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }
    public long getCriticalRisk() { return criticalRisk; }
    public void setCriticalRisk(long criticalRisk) { this.criticalRisk = criticalRisk; }
    public long getHighRisk() { return highRisk; }
    public void setHighRisk(long highRisk) { this.highRisk = highRisk; }
    public long getDelayed() { return delayed; }
    public void setDelayed(long delayed) { this.delayed = delayed; }
    public long getCostAnomalies() { return costAnomalies; }
    public void setCostAnomalies(long costAnomalies) { this.costAnomalies = costAnomalies; }
    public long getPotentialDuplicates() { return potentialDuplicates; }
    public void setPotentialDuplicates(long potentialDuplicates) { this.potentialDuplicates = potentialDuplicates; }
    public long getRepeatedFunding() { return repeatedFunding; }
    public void setRepeatedFunding(long repeatedFunding) { this.repeatedFunding = repeatedFunding; }
    public Map<String, Long> getRiskDistribution() { return riskDistribution; }
    public void setRiskDistribution(Map<String, Long> riskDistribution) { this.riskDistribution = riskDistribution; }
    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
    public List<Map<String, Object>> getMonthlyRiskTrend() { return monthlyRiskTrend; }
    public void setMonthlyRiskTrend(List<Map<String, Object>> monthlyRiskTrend) { this.monthlyRiskTrend = monthlyRiskTrend; }
    public List<Map<String, Object>> getPriorityQueue() { return priorityQueue; }
    public void setPriorityQueue(List<Map<String, Object>> priorityQueue) { this.priorityQueue = priorityQueue; }
}
""")

write_file("dto/InvestigationReportDTO.java", """
package com.sih26102.sentinel.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class InvestigationReportDTO {
    private String reportId;
    private String projectId;
    private LocalDateTime generatedAt = LocalDateTime.now();
    private String generatedBy;
    private String designation;
    private Map<String, Object> reportData;
    private String disclaimer = "Analytical output for monitoring and investigation support only. It does not establish legal fraud or wrongdoing.";

    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public Map<String, Object> getReportData() { return reportData; }
    public void setReportData(Map<String, Object> reportData) { this.reportData = reportData; }
    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
""")

# ==========================================
# 4. CONFIG & SECURITY
# ==========================================
write_file("config/JwtUtils.java", """
package com.sih26102.sentinel.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${sentinel.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String jwtSecret;

    @Value("${sentinel.jwt.expiration-ms:86400000}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith((javax.crypto.SecretKey) getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
""")

write_file("config/JwtFilter.java", """
package com.sih26102.sentinel.config;

import com.sih26102.sentinel.model.User;
import com.sih26102.sentinel.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtils.validateToken(token)) {
                String username = jwtUtils.getUsernameFromToken(token);
                Optional<User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
""")

write_file("config/SecurityConfig.java", """
package com.sih26102.sentinel.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/h2-console/**", "/error", "/api/v1/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
""")

write_file("config/RestTemplateConfig.java", """
package com.sih26102.sentinel.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofSeconds(3))
                .setReadTimeout(Duration.ofSeconds(6))
                .build();
    }
}
""")

print("DTOs and Security configurations written.")
