package com.career.CareerBridge.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_details")
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    // Basic Job Details
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Column(nullable = false)
    private String role;
    
    private Double experience;
    
    @Column(name = "employment_type")
    private String employmentType;
    
    private String industry;

    // Employment Details - CHANGED TO STRING
    @Column(name = "start_date")
    private String startDate;
    
    @Column(name = "end_date")
    private String endDate;
    
    @Column(name = "currently_working")
    private Boolean currentlyWorking = false;
    
    private String salary;
    
    private String location;

    // Job Description
    @Column(columnDefinition = "TEXT", name = "job_description")
    private String jobDescription;

    @Column(columnDefinition = "JSON", name = "skills_used")
    private String skillsUsed;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    // References & Contacts
    @Column(name = "manager_name")
    private String managerName;
    
    @Column(name = "manager_contact")
    private String managerContact;
    
    @Column(name = "hr_contact")
    private String hrContact;

    // Documents
    @Column(name = "resume_path")
    private String resumePath;
    
    @Column(name = "offer_letter_path")
    private String offerLetterPath;
    
    @Column(name = "experience_letter_path")
    private String experienceLetterPath;

    // Additional Information
    @Column(name = "notice_period")
    private String noticePeriod;
    
    @Column(name = "preferred_location")
    private String preferredLocation;
    
    @Column(name = "expected_salary")
    private String expectedSalary;

    @Column(columnDefinition = "TEXT", name = "reason_for_leaving")
    private String reasonForLeaving;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public JobDetails() {}

    public JobDetails(Long userId) {
        this.userId = userId;
    }

    // ===== Getters and Setters =====
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Double getExperience() { return experience; }
    public void setExperience(Double experience) { this.experience = experience; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    // FIXED: Handle empty strings for dates
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) {
        // Convert empty string to null
        this.startDate = (startDate == null || startDate.trim().isEmpty()) ? null : startDate;
    }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) {
        // Convert empty string to null
        this.endDate = (endDate == null || endDate.trim().isEmpty()) ? null : endDate;
    }

    public Boolean getCurrentlyWorking() { return currentlyWorking; }
    public void setCurrentlyWorking(Boolean currentlyWorking) { this.currentlyWorking = currentlyWorking; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public String getSkillsUsed() { return skillsUsed; }
    public void setSkillsUsed(String skillsUsed) { this.skillsUsed = skillsUsed; }

    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public String getManagerContact() { return managerContact; }
    public void setManagerContact(String managerContact) { this.managerContact = managerContact; }

    public String getHrContact() { return hrContact; }
    public void setHrContact(String hrContact) { this.hrContact = hrContact; }

    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }

    public String getOfferLetterPath() { return offerLetterPath; }
    public void setOfferLetterPath(String offerLetterPath) { this.offerLetterPath = offerLetterPath; }

    public String getExperienceLetterPath() { return experienceLetterPath; }
    public void setExperienceLetterPath(String experienceLetterPath) { this.experienceLetterPath = experienceLetterPath; }

    public String getNoticePeriod() { return noticePeriod; }
    public void setNoticePeriod(String noticePeriod) { this.noticePeriod = noticePeriod; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

    public String getExpectedSalary() { return expectedSalary; }
    public void setExpectedSalary(String expectedSalary) { this.expectedSalary = expectedSalary; }

    public String getReasonForLeaving() { return reasonForLeaving; }
    public void setReasonForLeaving(String reasonForLeaving) { this.reasonForLeaving = reasonForLeaving; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "JobDetails{" +
                "id=" + id +
                ", userId=" + userId +
                ", companyName='" + companyName + '\'' +
                ", role='" + role + '\'' +
                ", experience=" + experience +
                ", employmentType='" + employmentType + '\'' +
                '}';
    }
}