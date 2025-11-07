package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.PersonalDetails;
import com.career.CareerBridge.repository.PersonalDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PersonalDetailsService {

    @Autowired
    private PersonalDetailsRepository repository;

    private final Path fileStorageLocation;

    public PersonalDetailsService() {
        this.fileStorageLocation = Paths.get("uploads/personal-documents").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            System.out.println("✅ Personal upload directory created: " + this.fileStorageLocation);
        } catch (Exception ex) {
            System.err.println("❌ Could not create personal upload directory: " + ex.getMessage());
            throw new RuntimeException("Could not create personal upload directory.", ex);
        }
    }

    public PersonalDetails savePersonalDetails(PersonalDetails details, MultipartFile profilePhoto) throws IOException {
        Long userId = details.getUserId();
        String name = details.getName();
        String email = details.getEmail();

        System.out.println("🔍 Checking for existing personal record - User: " + userId + 
                         ", Name: " + name + ", Email: " + email);

        // Check if same user has same name+email combination (or use other unique combination)
        Optional<PersonalDetails> existingPersonalOpt = repository
            .findByUserIdAndNameAndEmail(userId, name, email);

        if (existingPersonalOpt.isPresent()) {
            // UPDATE existing record for same name+email
            PersonalDetails existing = existingPersonalOpt.get();
            System.out.println("🔄 Updating existing personal record ID: " + existing.getId() + 
                             " for User: " + userId + ", Name: " + name + ", Email: " + email);
            
            updatePersonalDetails(existing, details);
            handleFileUpdates(existing, profilePhoto);
            existing.setUpdatedAt(LocalDateTime.now());
            
            PersonalDetails updated = repository.save(existing);
            System.out.println("✅ Updated personal record ID: " + updated.getId());
            return updated;
        } else {
            // CREATE new record
            System.out.println("🆕 Creating NEW personal record for User: " + userId + 
                             ", Name: " + name + ", Email: " + email);
            
            handleFileUploads(details, profilePhoto);
            details.setCreatedAt(LocalDateTime.now());
            details.setUpdatedAt(LocalDateTime.now());
            
            PersonalDetails saved = repository.save(details);
            System.out.println("✅ Created NEW personal record ID: " + saved.getId());
            return saved;
        }
    }
    private void updatePersonalDetails(PersonalDetails existing, PersonalDetails newDetails) {
        System.out.println("🔄 Updating personal details for record ID: " + existing.getId());
        
        if (newDetails.getName() != null) existing.setName(newDetails.getName());
        if (newDetails.getEmail() != null) existing.setEmail(newDetails.getEmail());
        if (newDetails.getPhone() != null) existing.setPhone(newDetails.getPhone());
        if (newDetails.getDateOfBirth() != null) existing.setDateOfBirth(newDetails.getDateOfBirth());
        if (newDetails.getAge() != null) existing.setAge(newDetails.getAge());
        if (newDetails.getGender() != null) existing.setGender(newDetails.getGender());
        if (newDetails.getMaritalStatus() != null) existing.setMaritalStatus(newDetails.getMaritalStatus());
        if (newDetails.getAddress() != null) existing.setAddress(newDetails.getAddress());
        if (newDetails.getCity() != null) existing.setCity(newDetails.getCity());
        if (newDetails.getState() != null) existing.setState(newDetails.getState());
        if (newDetails.getPincode() != null) existing.setPincode(newDetails.getPincode());
        if (newDetails.getCountry() != null) existing.setCountry(newDetails.getCountry());
        if (newDetails.getAadharNumber() != null) existing.setAadharNumber(newDetails.getAadharNumber());
        if (newDetails.getNationality() != null) existing.setNationality(newDetails.getNationality());
        if (newDetails.getReligion() != null) existing.setReligion(newDetails.getReligion());
        if (newDetails.getCategory() != null) existing.setCategory(newDetails.getCategory());
        if (newDetails.getBloodGroup() != null) existing.setBloodGroup(newDetails.getBloodGroup());
        if (newDetails.getFatherName() != null) existing.setFatherName(newDetails.getFatherName());
        if (newDetails.getFatherOccupation() != null) existing.setFatherOccupation(newDetails.getFatherOccupation());
        if (newDetails.getFatherPhone() != null) existing.setFatherPhone(newDetails.getFatherPhone());
        if (newDetails.getMotherName() != null) existing.setMotherName(newDetails.getMotherName());
        if (newDetails.getMotherOccupation() != null) existing.setMotherOccupation(newDetails.getMotherOccupation());
        if (newDetails.getMotherPhone() != null) existing.setMotherPhone(newDetails.getMotherPhone());
        if (newDetails.getGuardianName() != null) existing.setGuardianName(newDetails.getGuardianName());
        if (newDetails.getGuardianRelation() != null) existing.setGuardianRelation(newDetails.getGuardianRelation());
        if (newDetails.getGuardianPhone() != null) existing.setGuardianPhone(newDetails.getGuardianPhone());
        if (newDetails.getGuardianAddress() != null) existing.setGuardianAddress(newDetails.getGuardianAddress());
        if (newDetails.getEmergencyContactName() != null) existing.setEmergencyContactName(newDetails.getEmergencyContactName());
        if (newDetails.getEmergencyContactPhone() != null) existing.setEmergencyContactPhone(newDetails.getEmergencyContactPhone());
        if (newDetails.getEmergencyContactRelation() != null) existing.setEmergencyContactRelation(newDetails.getEmergencyContactRelation());
        
        System.out.println("✅ Updated personal details for record ID: " + existing.getId());
    }

    private void handleFileUploads(PersonalDetails details, MultipartFile profilePhoto) throws IOException {
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            String profilePhotoPath = storeFile(profilePhoto, "profile_photo");
            details.setProfilePhotoPath(profilePhotoPath);
            System.out.println("📄 Stored profile photo for user " + details.getUserId() + ": " + profilePhotoPath);
        }
    }

    private void handleFileUpdates(PersonalDetails existing, MultipartFile profilePhoto) throws IOException {
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            deleteFile(existing.getProfilePhotoPath());
            String profilePhotoPath = storeFile(profilePhoto, "profile_photo");
            existing.setProfilePhotoPath(profilePhotoPath);
            System.out.println("📄 Updated profile photo for user " + existing.getUserId() + ": " + profilePhotoPath);
        }
    }

    private String storeFile(MultipartFile file, String prefix) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = prefix + "_" + UUID.randomUUID() + fileExtension;
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        
        System.out.println("💾 Storing file: " + fileName + " at " + targetLocation);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return fileName;
    }

    private void deleteFile(String fileName) {
        if (fileName != null && !fileName.trim().isEmpty()) {
            try {
                Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
                Files.deleteIfExists(filePath);
                System.out.println("🗑️ Deleted old file: " + fileName);
            } catch (IOException e) {
                System.err.println("❌ Could not delete file: " + fileName + ", Error: " + e.getMessage());
            }
        }
    }

    public Optional<PersonalDetails> getPersonalDetailsByUserId(Long userId) {
        System.out.println("🔍 Fetching personal details for user ID: " + userId);
        return repository.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<PersonalDetails> getAllPersonalDetailsByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }

    public Optional<PersonalDetails> getPersonalDetailsById(Integer id) {
        return repository.findById(id);
    }

    public List<PersonalDetails> getAllPersonalDetails() {
        return repository.findAll();
    }
    
    public PersonalDetails updatePersonalDetails(PersonalDetails details) {
        return repository.save(details);
    }
}