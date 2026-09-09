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