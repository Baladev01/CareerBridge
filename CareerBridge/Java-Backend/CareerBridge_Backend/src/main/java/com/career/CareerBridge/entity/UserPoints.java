package com.career.CareerBridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_points")
public class UserPoints {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private Integer points = 0;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();

    // Constructors
    public UserPoints() {}

    public UserPoints(Long userId, Integer points, Integer level) {
        this.userId = userId;
        this.points = points;
        this.level = level;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}