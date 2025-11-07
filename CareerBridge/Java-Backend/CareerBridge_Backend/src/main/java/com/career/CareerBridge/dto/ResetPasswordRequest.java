package com.career.CareerBridge.dto;

public class ResetPasswordRequest {
    private String token;
    private String newPassword;

    // Default constructor
    public ResetPasswordRequest() {}

    // Parameterized constructor
    public ResetPasswordRequest(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}