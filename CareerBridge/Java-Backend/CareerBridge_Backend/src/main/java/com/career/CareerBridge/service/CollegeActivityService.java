package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.CollegeActivity;
import com.career.CareerBridge.repository.CollegeActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class CollegeActivityService {
    
    @Autowired
    private CollegeActivityRepository repository;
    
    private final Path fileStorageLocation;
    
    public CollegeActivityService() {
        this.fileStorageLocation = Paths.get("uploads/activity-certificates").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            System.out.println("✅ Activity certificates directory created: " + this.fileStorageLocation);
        } catch (Exception ex) {
            System.err.println("❌ Could not create activity certificates directory: " + ex.getMessage());
        }
    }
    
    public CollegeActivity saveActivity(CollegeActivity activity, MultipartFile certificate) throws IOException {
        // Handle certificate upload
        if (certificate != null && !certificate.isEmpty()) {
            String certificatePath = storeFile(certificate, "activity_certificate");
            activity.setCertificatePath(certificatePath);
        }
        
        CollegeActivity savedActivity = repository.save(activity);
        
        
        return savedActivity;
    }
    
    private String storeFile(MultipartFile file, String prefix) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = prefix + "_" + UUID.randomUUID() + fileExtension;
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }
    
    public List<CollegeActivity> getUserActivities(Long userId) {
        return repository.findByUserId(userId);
    }
    
    public List<CollegeActivity> getEducationActivities(Long educationId) {
        return repository.findByEducationId(educationId);
    }
    
    public void deleteActivity(Long activityId) {
        repository.deleteById(activityId);
    }
}