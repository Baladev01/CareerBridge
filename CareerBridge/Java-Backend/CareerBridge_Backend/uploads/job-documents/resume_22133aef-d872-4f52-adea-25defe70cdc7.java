package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.EducationDetails;
import com.career.CareerBridge.repository.EducationDetailsRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EducationDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(EducationDetailsService.class);

    @Autowired
    private EducationDetailsRepository repository;

    private final Path fileStorageLocation;

    public EducationDetailsService() {
        this.fileStorageLocation = Paths.get("uploads/education-documents").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            logger.info("Education upload directory created: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            logger.error("Could not create education upload directory: {}", ex.getMessage());
            throw new RuntimeException("Could not create education upload directory.", ex);
        }
    }

    public EducationDetails saveEducationDetails(EducationDetails details,
                                                 MultipartFile tenthMarksheet,
                                                 MultipartFile twelfthMarksheet,
                                                 Map<Integer, MultipartFile> activityCertificates) throws IOException {

        Long userId = details.getUserId();
        String degree = details.getDegree();
        String collegeName = details.getCollegeName();

        logger.info("Checking for existing education record - User: {}, Degree: {}, College: {}", 
                   userId, degree, collegeName);

        Optional<EducationDetails> existingDetailsOpt = repository
            .findByUserIdAndDegreeAndCollegeName(userId, degree, collegeName);

        if (existingDetailsOpt.isPresent()) {
            EducationDetails existing = existingDetailsOpt.get();
            logger.info("Updating existing education record ID: {} for User: {}", existing.getId(), userId);
            
            updateEducationDetails(existing, details);
            handleFileUpdates(existing, tenthMarksheet, twelfthMarksheet, activityCertificates);
            existing.setUpdatedAt(LocalDateTime.now());
            
            EducationDetails updated = repository.save(existing);
            logger.info("Updated education record ID: {}", updated.getId());
            return updated;
        } else {
            logger.info("Creating NEW education record for User: {}, Degree: {}, College: {}", 
                       userId, degree, collegeName);
            
            handleFileUploads(details, tenthMarksheet, twelfthMarksheet, activityCertificates);
            details.setCreatedAt(LocalDateTime.now());
            details.setUpdatedAt(LocalDateTime.now());
            
            EducationDetails saved = repository.save(details);
            logger.info("Created NEW education record ID: {}", saved.getId());
            return saved;
        }
    }
    
    private void updateEducationDetails(EducationDetails existing, EducationDetails newDetails) {
        logger.info("Updating education details for record ID: {}", existing.getId());
        
        if (newDetails.getTenthSchool() != null) existing.setTenthSchool(newDetails.getTenthSchool());
        if (newDetails.getTenthBoard() != null) existing.setTenthBoard(newDetails.getTenthBoard());
        if (newDetails.getTenthPercentage() != null) existing.setTenthPercentage(newDetails.getTenthPercentage());
        if (newDetails.getTenthYear() != null) existing.setTenthYear(newDetails.getTenthYear());
        if (newDetails.getTwelfthSchool() != null) existing.setTwelfthSchool(newDetails.getTwelfthSchool());
        if (newDetails.getTwelfthBoard() != null) existing.setTwelfthBoard(newDetails.getTwelfthBoard());
        if (newDetails.getTwelfthStream() != null) existing.setTwelfthStream(newDetails.getTwelfthStream());
        if (newDetails.getTwelfthPercentage() != null) existing.setTwelfthPercentage(newDetails.getTwelfthPercentage());
        if (newDetails.getTwelfthYear() != null) existing.setTwelfthYear(newDetails.getTwelfthYear());
        if (newDetails.getCollegeName() != null) existing.setCollegeName(newDetails.getCollegeName());
        if (newDetails.getDegree() != null) existing.setDegree(newDetails.getDegree());
        if (newDetails.getSpecialization() != null) existing.setSpecialization(newDetails.getSpecialization());
        if (newDetails.getCgpa() != null) existing.setCgpa(newDetails.getCgpa());
        if (newDetails.getPercentage() != null) existing.setPercentage(newDetails.getPercentage());
        if (newDetails.getStartDate() != null) existing.setStartDate(newDetails.getStartDate());
        if (newDetails.getEndDate() != null) existing.setEndDate(newDetails.getEndDate());
        if (newDetails.getCurrentlyStudying() != null) existing.setCurrentlyStudying(newDetails.getCurrentlyStudying());
        if (newDetails.getUniversity() != null) existing.setUniversity(newDetails.getUniversity());
        if (newDetails.getDepartment() != null) existing.setDepartment(newDetails.getDepartment());
        if (newDetails.getRollNumber() != null) existing.setRollNumber(newDetails.getRollNumber());
        if (newDetails.getSemester() != null) existing.setSemester(newDetails.getSemester());
        if (newDetails.getSkills() != null) existing.setSkills(newDetails.getSkills());
        if (newDetails.getAchievements() != null) existing.setAchievements(newDetails.getAchievements());
        if (newDetails.getCollegeActivities() != null) existing.setCollegeActivities(newDetails.getCollegeActivities());
        if (newDetails.getExtracurricular() != null) existing.setExtracurricular(newDetails.getExtracurricular());
        if (newDetails.getProjects() != null) existing.setProjects(newDetails.getProjects());
        if (newDetails.getAdditionalDegree() != null) existing.setAdditionalDegree(newDetails.getAdditionalDegree());
        if (newDetails.getAdditionalCertifications() != null) existing.setAdditionalCertifications(newDetails.getAdditionalCertifications());
        
        logger.info("Updated education details for record ID: {}", existing.getId());
    }

    private void handleFileUploads(EducationDetails details, 
                                  MultipartFile tenthMarksheet, 
                                  MultipartFile twelfthMarksheet,
                                  Map<Integer, MultipartFile> activityCertificates) throws IOException {
        if (tenthMarksheet != null && !tenthMarksheet.isEmpty()) {
            String tenthPath = storeFile(tenthMarksheet, "tenth_marksheet");
            details.setTenthMarksheetPath(tenthPath);
            logger.info("Stored 10th marksheet for user {}: {}", details.getUserId(), tenthPath);
        }
        if (twelfthMarksheet != null && !twelfthMarksheet.isEmpty()) {
            String twelfthPath = storeFile(twelfthMarksheet, "twelfth_marksheet");
            details.setTwelfthMarksheetPath(twelfthPath);
            logger.info("Stored 12th marksheet for user {}: {}", details.getUserId(), twelfthPath);
        }
        
        handleActivityCertificatesUpload(details, activityCertificates);
    }

    private void handleFileUpdates(EducationDetails existing,
                                  MultipartFile tenthMarksheet,
                                  MultipartFile twelfthMarksheet,
                                  Map<Integer, MultipartFile> activityCertificates) throws IOException {
        if (tenthMarksheet != null && !tenthMarksheet.isEmpty()) {
            deleteFile(existing.getTenthMarksheetPath());
            String tenthPath = storeFile(tenthMarksheet, "tenth_marksheet");
            existing.setTenthMarksheetPath(tenthPath);
            logger.info("Updated 10th marksheet for user {}: {}", existing.getUserId(), tenthPath);
        }
        if (twelfthMarksheet != null && !twelfthMarksheet.isEmpty()) {
            deleteFile(existing.getTwelfthMarksheetPath());
            String twelfthPath = storeFile(twelfthMarksheet, "twelfth_marksheet");
            existing.setTwelfthMarksheetPath(twelfthPath);
            logger.info("Updated 12th marksheet for user {}: {}", existing.getUserId(), twelfthPath);
        }
        
        handleActivityCertificatesUpdate(existing, activityCertificates);
    }

    private void handleActivityCertificatesUpload(EducationDetails details, Map<Integer, MultipartFile> activityCertificates) throws IOException {
        if (activityCertificates != null && !activityCertificates.isEmpty() && details.getCollegeActivities() != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                List<Map<String, Object>> activities = mapper.readValue(
                    details.getCollegeActivities(), new TypeReference<List<Map<String, Object>>>() {}
                );
                
                for (int i = 0; i < activities.size(); i++) {
                    if (activityCertificates.containsKey(i)) {
                        MultipartFile file = activityCertificates.get(i);
                        if (file != null && !file.isEmpty()) {
                            String certificatePath = storeFile(file, "activity_certificate");
                            activities.get(i).put("certificatePath", certificatePath);
                            logger.info("Stored activity certificate for activity {}: {}", i, certificatePath);
                        }
                    }
                }
                details.setCollegeActivities(mapper.writeValueAsString(activities));
            } catch (Exception e) {
                logger.error("Error processing activity certificates: {}", e.getMessage());
            }
        }
    }

    private void handleActivityCertificatesUpdate(EducationDetails existing, Map<Integer, MultipartFile> activityCertificates) throws IOException {
        if (activityCertificates != null && !activityCertificates.isEmpty() && existing.getCollegeActivities() != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                List<Map<String, Object>> activities = mapper.readValue(
                    existing.getCollegeActivities(), new TypeReference<List<Map<String, Object>>>() {}
                );
                
                for (int i = 0; i < activities.size(); i++) {
                    if (activityCertificates.containsKey(i)) {
                        MultipartFile file = activityCertificates.get(i);
                        if (file != null && !file.isEmpty()) {
                            String oldCertificatePath = (String) activities.get(i).get("certificatePath");
                            deleteFile(oldCertificatePath);
                            
                            String certificatePath = storeFile(file, "activity_certificate");
                            activities.get(i).put("certificatePath", certificatePath);
                            logger.info("Updated activity certificate for activity {}: {}", i, certificatePath);
                        }
                    }
                }
                existing.setCollegeActivities(mapper.writeValueAsString(activities));
            } catch (Exception e) {
                logger.error("Error updating activity certificates: {}", e.getMessage());
            }
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
        
        logger.info("Storing file: {} at {}", fileName, targetLocation);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return fileName;
    }

    private void deleteFile(String fileName) {
        if (fileName != null && !fileName.trim().isEmpty()) {
            try {
                Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
                Files.deleteIfExists(filePath);
                logger.info("Deleted old file: {}", fileName);
            } catch (IOException e) {
                logger.error("Could not delete file: {}, Error: {}", fileName, e.getMessage());
            }
        }
    }

    public Optional<EducationDetails> getEducationDetailsByUserId(Long userId) {
        logger.info("Fetching education details for user ID: {}", userId);
        return repository.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<EducationDetails> getAllEducationDetailsByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }

    public Optional<EducationDetails> getEducationDetailsById(Integer id) {
        return repository.findById(id);
    }

    public List<EducationDetails> getAllEducationDetails() {
        return repository.findAll();
    }

    public Optional<EducationDetails> getEducationDetailsByUserIdAndDegreeAndCollege(Long userId, String degree, String collegeName) {
        return repository.findByUserIdAndDegreeAndCollegeName(userId, degree, collegeName);
    }
}