package com.career.CareerBridge.dto;

public class PointsResponse {
    private boolean success;
    private String message;
    private PointsData data;

    // Constructors
    public PointsResponse() {}

    public PointsResponse(boolean success, String message, PointsData data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public PointsData getData() { return data; }
    public void setData(PointsData data) { this.data = data; }

    public static PointsResponse success(String message, PointsData data) {
        return new PointsResponse(true, message, data);
    }

    public static PointsResponse error(String message) {
        return new PointsResponse(false, message, null);
    }
}