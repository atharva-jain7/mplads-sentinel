package com.sih26102.sentinel.controller;

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