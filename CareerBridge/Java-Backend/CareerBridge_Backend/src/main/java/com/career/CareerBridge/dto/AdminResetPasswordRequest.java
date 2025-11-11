package com.career.CareerBridge.dto;

public class AdminResetPasswordRequest {
    private String email;
    private String newPassword;

    // Default constructor
    public AdminResetPasswordRequest() {}

    // Parameterized constructor
    public AdminResetPasswordRequest(String email, String newPassword) {
        this.email = email;
        this.newPassword = newPassword;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    @Override
    public String toString() {
        return "AdminResetPasswordRequest{" +
                "email='" + email + '\'' +
                '}';
    }
}