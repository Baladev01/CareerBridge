// AdminForgotPasswordRequest.java
package com.career.CareerBridge.dto;

public class AdminForgotPasswordRequest {
    private String email;

    // Default constructor
    public AdminForgotPasswordRequest() {}

    // Parameterized constructor
    public AdminForgotPasswordRequest(String email) {
        this.email = email;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "AdminForgotPasswordRequest{" +
                "email='" + email + '\'' +
                '}';
    }
}