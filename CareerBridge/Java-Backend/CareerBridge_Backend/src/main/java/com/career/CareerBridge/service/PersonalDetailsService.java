package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.PersonalDetails;
import com.career.CareerBridge.repository.PersonalDetailsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PersonalDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(PersonalDetailsService.class);

    @Autowired
    private PersonalDetailsRepository repository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private final Path fileStorageLocation;

    public PersonalDetailsService() {
        this.fileStorageLocation = Paths.get("uploads/personal-documents").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            logger.info("Personal upload directory created: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            logger.error("Could not create personal upload directory: {}", ex.getMessage());
            throw new RuntimeException("Could not create personal upload directory.", ex);
        }
    }

    public PersonalDetails savePersonalDetails(PersonalDetails details, MultipartFile profilePhoto) throws IOException {
        Long userId = details.getUserId();
        String name = details.getName();
        String email = details.getEmail();

        logger.info("Creating NEW personal record for User: {}, Name: {}, Email: {}", 
                   userId, name, email);
        
        handleFileUploads(details, profilePhoto);
        details.setCreatedAt(LocalDateTime.now());
        details.setUpdatedAt(LocalDateTime.now());
        
        PersonalDetails saved = repository.save(details);
        logger.info("Created NEW personal record ID: {}", saved.getId());
        return saved;
    }

    public PersonalDetails updateProfilePhoto(PersonalDetails existing, MultipartFile profilePhoto) throws IOException {
        logger.info("Updating profile photo for user ID: {}", existing.getUserId());
        
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            deleteFile(existing.getProfilePhotoPath());
            
            String profilePhotoPath = storeFile(profilePhoto, "profile_photo");
            existing.setProfilePhotoPath(profilePhotoPath);
            existing.setUpdatedAt(LocalDateTime.now());
            
            logger.info("Updated profile photo for user {}: {}", existing.getUserId(), profilePhotoPath);
        }
        
        return repository.save(existing);
    }

    private void handleFileUploads(PersonalDetails details, MultipartFile profilePhoto) throws IOException {
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            String profilePhotoPath = storeFile(profilePhoto, "profile_photo");
            details.setProfilePhotoPath(profilePhotoPath);
            logger.info("Stored profile photo for user {}: {}", details.getUserId(), profilePhotoPath);
        }
    }

    private String storeFile(MultipartFile file, String prefix) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
        }
        
        String fileName = prefix + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        
        logger.info("Storing file: {} at {}", fileName, targetLocation);
        
        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            logger.info("File stored successfully: {}", fileName);
            return fileName;
        } catch (IOException e) {
            logger.error("Failed to store file: {}", fileName, e);
            throw new IOException("Could not store file " + fileName + ". Please try again!", e);
        }
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

    public Optional<PersonalDetails> getPersonalDetailsByUserId(Long userId) {
        logger.info("Fetching personal details for user ID: {}", userId);
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
        details.setUpdatedAt(LocalDateTime.now());
        return repository.save(details);
    }
   

    public String getProfilePhotoUrl(Long userId) {
        Optional<PersonalDetails> details = repository.findByUserId(userId);
        return details.map(PersonalDetails::getProfilePhoto).orElse(null);
    }

    public String getProfilePhotoPath(Long userId) {
        Optional<PersonalDetails> details = repository.findByUserId(userId);
        return details.map(PersonalDetails::getProfilePhotoPath).orElse(null);
    }

    public boolean hasProfilePhoto(Long userId) {
        Optional<PersonalDetails> details = repository.findByUserId(userId);
        return details.isPresent() && details.get().getProfilePhotoPath() != null;
    }
}