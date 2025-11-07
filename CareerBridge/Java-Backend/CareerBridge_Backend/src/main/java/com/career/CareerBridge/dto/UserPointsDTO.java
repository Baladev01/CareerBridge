package com.career.CareerBridge.dto;

import java.time.LocalDateTime;

public class UserPointsDTO {
 private Integer points;
 private Integer level;
 private String rank;
 private LocalDateTime lastUpdated;

 // Constructors
 public UserPointsDTO() {}

 public UserPointsDTO(Integer points, Integer level, String rank, LocalDateTime lastUpdated) {
     this.points = points;
     this.level = level;
     this.rank = rank;
     this.lastUpdated = lastUpdated;
 }

 // Getters and Setters
 public Integer getPoints() { return points; }
 public void setPoints(Integer points) { this.points = points; }

 public Integer getLevel() { return level; }
 public void setLevel(Integer level) { this.level = level; }

 public String getRank() { return rank; }
 public void setRank(String rank) { this.rank = rank; }

 public LocalDateTime getLastUpdated() { return lastUpdated; }
 public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}