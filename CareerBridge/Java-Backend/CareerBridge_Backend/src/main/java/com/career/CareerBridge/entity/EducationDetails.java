package com.career.CareerBridge.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "education_details")
@JsonIgnoreProperties(ignoreUnknown = true)
public class EducationDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    // 10th Grade Details
    @Column(name = "tenth_school")
    private String tenthSchool;
    
    @Column(name = "tenth_board")
    private String tenthBoard;
    
    @Column(name = "tenth_percentage")
    private Double tenthPercentage;
    
    @Column(name = "tenth_year")
    private Integer tenthYear;
    
    @Column(name = "tenth_marksheet_path")
    private String tenthMarksheetPath;
    
    // 12th Grade Details
    @Column(name = "twelfth_school")
    private String twelfthSchool;
    
    @Column(name = "twelfth_board")
    private String twelfthBoard;
    
    @Column(name = "twelfth_stream")
    private String twelfthStream;
    
    @Column(name = "twelfth_percentage")
    private Double twelfthPercentage;
    
    @Column(name = "twelfth_year")
    private Integer twelfthYear;
    
    @Column(name = "twelfth_marksheet_path")
    private String twelfthMarksheetPath;
    
    // Undergraduate/Graduate Details
    @Column(name = "college_name")
    private String collegeName;
    
    @Column(name = "degree")
    private String degree;
    
    @Column(name = "specialization")
    private String specialization;
    
    @Column(name = "university")
    private String university;
    
    @Column(name = "department")
    private String department;
    
    @Column(name = "roll_number")
    private String rollNumber;
    
    @Column(name = "cgpa")
    private Double cgpa;
    
    @Column(name = "percentage")
    private Double percentage;
    
    // FIXED: Date fields - handle empty strings properly
    @Column(name = "start_date")
    private String startDate;
    
    @Column(name = "end_date")
    private String endDate;
    
    @Column(name = "currently_studying")
    private Boolean currentlyStudying;
    
    @Column(name = "semester")
    private String semester;
    
    // Skills & Achievements
    @Column(name = "skills", length = 1000)
    private String skills;
    
    @Column(name = "achievements", length = 1500)
    private String achievements;
    
    @Column(name = "college_activities", length = 1500)
    private String collegeActivities;
    
    @Column(name = "extracurricular", length = 1000)
    private String extracurricular;
    
    @Column(name = "projects", length = 1500)
    private String projects;
    
    // Additional Education
    @Column(name = "additional_degree")
    private String additionalDegree;
    
    @Column(name = "additional_certifications", length = 1000)
    private String additionalCertifications;
    
    // Activity Certificates (JSON array)
    @Column(name = "college_activities_certificates", length = 2000)
    private String collegeActivitiesCertificates;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructors
    public EducationDetails() {}
    
    public EducationDetails(Long userId) {
        this.userId = userId;
    }
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getTenthSchool() { return tenthSchool; }
    public void setTenthSchool(String tenthSchool) { this.tenthSchool = tenthSchool; }
    
    public String getTenthBoard() { return tenthBoard; }
    public void setTenthBoard(String tenthBoard) { this.tenthBoard = tenthBoard; }
    
    public Double getTenthPercentage() { return tenthPercentage; }
    public void setTenthPercentage(Double tenthPercentage) { this.tenthPercentage = tenthPercentage; }
    
    public Integer getTenthYear() { return tenthYear; }
    public void setTenthYear(Integer tenthYear) { this.tenthYear = tenthYear; }
    
    public String getTenthMarksheetPath() { return tenthMarksheetPath; }
    public void setTenthMarksheetPath(String tenthMarksheetPath) { this.tenthMarksheetPath = tenthMarksheetPath; }
    
    public String getTwelfthSchool() { return twelfthSchool; }
    public void setTwelfthSchool(String twelfthSchool) { this.twelfthSchool = twelfthSchool; }
    
    public String getTwelfthBoard() { return twelfthBoard; }
    public void setTwelfthBoard(String twelfthBoard) { this.twelfthBoard = twelfthBoard; }
    
    public String getTwelfthStream() { return twelfthStream; }
    public void setTwelfthStream(String twelfthStream) { this.twelfthStream = twelfthStream; }
    
    public Double getTwelfthPercentage() { return twelfthPercentage; }
    public void setTwelfthPercentage(Double twelfthPercentage) { this.twelfthPercentage = twelfthPercentage; }
    
    public Integer getTwelfthYear() { return twelfthYear; }
    public void setTwelfthYear(Integer twelfthYear) { this.twelfthYear = twelfthYear; }
    
    public String getTwelfthMarksheetPath() { return twelfthMarksheetPath; }
    public void setTwelfthMarksheetPath(String twelfthMarksheetPath) { this.twelfthMarksheetPath = twelfthMarksheetPath; }
    
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    
    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) {
        this.startDate = (startDate == null || startDate.trim().isEmpty()) ? null : startDate;
    }
    
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) {
        this.endDate = (endDate == null || endDate.trim().isEmpty()) ? null : endDate;
    }
    
    public Boolean getCurrentlyStudying() { return currentlyStudying; }
    public void setCurrentlyStudying(Boolean currentlyStudying) { this.currentlyStudying = currentlyStudying; }
    
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    
    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }
    
    public String getCollegeActivities() { return collegeActivities; }
    public void setCollegeActivities(String collegeActivities) { this.collegeActivities = collegeActivities; }
    
    public String getExtracurricular() { return extracurricular; }
    public void setExtracurricular(String extracurricular) { this.extracurricular = extracurricular; }
    
    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
    
    public String getAdditionalDegree() { return additionalDegree; }
    public void setAdditionalDegree(String additionalDegree) { this.additionalDegree = additionalDegree; }
    
    public String getAdditionalCertifications() { return additionalCertifications; }
    public void setAdditionalCertifications(String additionalCertifications) { this.additionalCertifications = additionalCertifications; }
    
    public String getCollegeActivitiesCertificates() { return collegeActivitiesCertificates; }
    public void setCollegeActivitiesCertificates(String collegeActivitiesCertificates) { this.collegeActivitiesCertificates = collegeActivitiesCertificates; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "EducationDetails{" +
                "id=" + id +
                ", userId=" + userId +
                ", collegeName='" + collegeName + '\'' +
                ", degree='" + degree + '\'' +
                ", specialization='" + specialization + '\'' +
                ", cgpa=" + cgpa +
                '}';
    }
}