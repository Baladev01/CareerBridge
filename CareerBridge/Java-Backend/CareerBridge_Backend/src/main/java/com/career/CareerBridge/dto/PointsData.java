package com.career.CareerBridge.dto;

public class PointsData {
    private Integer points;
    private Integer pointsEarned;
    private Integer level;
    private String rank;

    // Constructors
    public PointsData() {}

    public PointsData(Integer points, Integer pointsEarned, Integer level, String rank) {
        this.points = points;
        this.pointsEarned = pointsEarned;
        this.level = level;
        this.rank = rank;
    }

    // Getters and Setters
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }
}