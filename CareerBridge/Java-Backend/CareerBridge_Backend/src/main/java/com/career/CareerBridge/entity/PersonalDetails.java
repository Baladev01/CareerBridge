package com.career.CareerBridge.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "personal_details")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PersonalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Long userId;
    
 // Documents - Updated for better profile photo handling
    @Column(name = "profile_photo_path")
    private String profilePhotoPath;

    // New field for direct profile photo URL access
    @Transient
    private String profilePhoto;

    // Personal Information
    private String name;
    private String email;
    private String phone;
    private String dateOfBirth;
    private Integer age;
    private String gender;
    private String maritalStatus;

    // Address Information
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String country;

    // Identification Details
    private String aadharNumber;
    private String nationality;
    private String religion;
    private String category;
    private String bloodGroup;

    // Family Information
    private String fatherName;
    private String fatherOccupation;
    private String fatherPhone;
    private String motherName;
    private String motherOccupation;
    private String motherPhone;
    private String guardianName;
    private String guardianRelation;
    private String guardianPhone;
    private String guardianAddress;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PersonalDetails() {}

    public PersonalDetails(Long userId) {
        this.userId = userId;
    }

    // ===== Getters and Setters =====
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getAadharNumber() { return aadharNumber; }
    public void setAadharNumber(String aadharNumber) { this.aadharNumber = aadharNumber; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getFatherOccupation() { return fatherOccupation; }
    public void setFatherOccupation(String fatherOccupation) { this.fatherOccupation = fatherOccupation; }

    public String getFatherPhone() { return fatherPhone; }
    public void setFatherPhone(String fatherPhone) { this.fatherPhone = fatherPhone; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getMotherOccupation() { return motherOccupation; }
    public void setMotherOccupation(String motherOccupation) { this.motherOccupation = motherOccupation; }

    public String getMotherPhone() { return motherPhone; }
    public void setMotherPhone(String motherPhone) { this.motherPhone = motherPhone; }

    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

    public String getGuardianRelation() { return guardianRelation; }
    public void setGuardianRelation(String guardianRelation) { this.guardianRelation = guardianRelation; }

    public String getGuardianPhone() { return guardianPhone; }
    public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }

    public String getGuardianAddress() { return guardianAddress; }
    public void setGuardianAddress(String guardianAddress) { this.guardianAddress = guardianAddress; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public String getEmergencyContactRelation() { return emergencyContactRelation; }
    public void setEmergencyContactRelation(String emergencyContactRelation) { this.emergencyContactRelation = emergencyContactRelation; }

    public String getProfilePhotoPath() { return profilePhotoPath; }
    public void setProfilePhotoPath(String profilePhotoPath) { this.profilePhotoPath = profilePhotoPath; }

    
    // ✅ ENHANCED: Getter for profile photo with full URL
    public String getProfilePhoto() {
        if (this.profilePhotoPath != null && !this.profilePhotoPath.trim().isEmpty()) {
            // Use the FileController endpoint with proper URL construction
            return "http://localhost:8080/api/files/personal-documents/" + this.profilePhotoPath;
        }
        return this.profilePhoto; // Return transient field if set
    }
    
    // ✅ ENHANCED: Setter for profile photo (for JSON deserialization)
    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
    
    public String getProfilePhotoFilename() {
        return this.profilePhotoPath;
    }
    

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "PersonalDetails{" +
                "id=" + id +
                ", userId=" + userId +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", profilePhoto='" + getProfilePhoto() + '\'' +
                '}';
    }
}