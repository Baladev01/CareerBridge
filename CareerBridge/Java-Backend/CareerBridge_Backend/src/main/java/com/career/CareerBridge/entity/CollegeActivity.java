// CollegeActivity.java
package com.career.CareerBridge.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "college_activities")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CollegeActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "education_id")
    private Long educationId;
    
    private String activity;
    private String role;
    
    @Column(name = "start_date")
    private String startDate;
    
    @Column(name = "end_date")
    private String endDate;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "certificate_path")
    private String certificatePath;
    
    // Constructors
    public CollegeActivity() {}
    
    public CollegeActivity(Long userId, String activity, String role, String startDate, String endDate, String description) {
        this.userId = userId;
        this.activity = activity;
        this.role = role;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getEducationId() { return educationId; }
    public void setEducationId(Long educationId) { this.educationId = educationId; }
    
    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCertificatePath() { return certificatePath; }
    public void setCertificatePath(String certificatePath) { this.certificatePath = certificatePath; }

    @Override
    public String toString() {
        return "CollegeActivity{" +
                "id=" + id +
                ", userId=" + userId +
                ", activity='" + activity + '\'' +
                ", role='" + role + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", description='" + description + '\'' +
                ", certificatePath='" + certificatePath + '\'' +
                '}';
    }
}