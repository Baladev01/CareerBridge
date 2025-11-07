package com.career.CareerBridge.dto;

public class ForgotPasswordRequest {
    private String email;

    // Default constructor
    public ForgotPasswordRequest() {}

    // Parameterized constructor
    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}