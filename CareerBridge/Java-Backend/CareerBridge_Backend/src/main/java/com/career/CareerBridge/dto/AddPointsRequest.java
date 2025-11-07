package com.career.CareerBridge.dto;

public class AddPointsRequest {
    private String activityType;
    private String description;

    // Constructors
    public AddPointsRequest() {}

    public AddPointsRequest(String activityType, String description) {
        this.activityType = activityType;
        this.description = description;
    }

    // Getters and Setters
    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}  