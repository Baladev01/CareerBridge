package com.career.CareerBridge.controller;

import com.career.CareerBridge.dto.PointsResponse;
import com.career.CareerBridge.entity.EducationDetails;
import com.career.CareerBridge.service.EducationDetailsService;
import com.career.CareerBridge.service.PointsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/education")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class EducationDetailsController {

    private static final Logger logger = LoggerFactory.getLogger(EducationDetailsController.class);
    
    @Autowired
    private EducationDetailsService educationDetailsService;
    
    @Autowired
    private PointsService pointsService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveEducationDetails(
            @RequestPart("data") String detailsJson,
            @RequestPart(value = "tenthMarksheet", required = false) MultipartFile tenthMarksheet,
            @RequestPart(value = "twelfthMarksheet", required = false) MultipartFile twelfthMarksheet,
            @RequestPart(value = "activityCertificate0", required = false) MultipartFile activityCertificate0,
            @RequestPart(value = "activityCertificate1", required = false) MultipartFile activityCertificate1,
            @RequestPart(value = "activityCertificate2", required = false) MultipartFile activityCertificate2,
            @RequestPart(value = "activityCertificate3", required = false) MultipartFile activityCertificate3,
            @RequestPart(value = "activityCertificate4", required = false) MultipartFile activityCertificate4,
            HttpServletRequest request) {
        
        try {
            logger.info("=== EDUCATION DETAILS SAVE REQUEST ===");
            
            // Extract user ID from request
            Long userId = extractUserIdFromRequest(request);
            logger.info("Processing request for User ID: {}", userId);
            
            // Parse JSON to EducationDetails
            EducationDetails details = objectMapper.readValue(detailsJson, EducationDetails.class);
            details.setUserId(userId);
            
            // Handle activity certificates
            Map<Integer, MultipartFile> activityCertificates = new HashMap<>();
            addActivityCertificateIfPresent(activityCertificates, 0, activityCertificate0);
            addActivityCertificateIfPresent(activityCertificates, 1, activityCertificate1);
            addActivityCertificateIfPresent(activityCertificates, 2, activityCertificate2);
            addActivityCertificateIfPresent(activityCertificates, 3, activityCertificate3);
            addActivityCertificateIfPresent(activityCertificates, 4, activityCertificate4);
            
            // Save education details
            EducationDetails savedDetails = educationDetailsService.saveEducationDetails(
                details, tenthMarksheet, twelfthMarksheet, activityCertificates);
            
            // ✅ ADD POINTS: 10 points for education form submission (ALWAYS)
            PointsResponse pointsResponse = pointsService.addPoints(
                userId, 
                "education_form", 
                "Completed education details form"
            );
            logger.info("🎉 10 points added for education form: {}", pointsResponse.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Education details saved successfully");
            response.put("data", savedDetails);
            response.put("pointsEarned", 10);
            response.put("pointsMessage", "Earned 10 points for completing education form!");
            
            logger.info("=== EDUCATION DETAILS SAVE SUCCESS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("=== ERROR SAVING EDUCATION DETAILS ===", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error saving education details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateEducationDetails(@RequestBody EducationDetails details) {
        try {
            logger.info("=== UPDATE EDUCATION DETAILS REQUEST ===");
            
            Optional<EducationDetails> existingOpt = educationDetailsService.getEducationDetailsByUserId(details.getUserId());
            
            if (existingOpt.isPresent()) {
                EducationDetails existing = existingOpt.get();
                // Update fields
                if (details.getCollegeName() != null) existing.setCollegeName(details.getCollegeName());
                if (details.getDegree() != null) existing.setDegree(details.getDegree());
                if (details.getSpecialization() != null) existing.setSpecialization(details.getSpecialization());
                if (details.getUniversity() != null) existing.setUniversity(details.getUniversity());
                if (details.getCgpa() != null) existing.setCgpa(details.getCgpa());
                if (details.getPercentage() != null) existing.setPercentage(details.getPercentage());
                
                existing.setUpdatedAt(LocalDateTime.now());
                EducationDetails updated = educationDetailsService.updateEducationDetails(existing);
                
                // ✅ ADD POINTS: 10 points for education form update
                PointsResponse pointsResponse = pointsService.addPoints(
                    details.getUserId(), 
                    "education_update", 
                    "Updated education details form"
                );
                logger.info("🎉 10 points added for education form update: {}", pointsResponse.getMessage());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Education details updated successfully");
                response.put("data", updated);
                response.put("pointsEarned", 10);
                response.put("pointsMessage", "Earned 10 points for updating education details!");
                
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Education details not found for user");
            }
            
        } catch (Exception e) {
            logger.error("Error updating education details: {}", e.getMessage());
            return errorResponse("Error updating education details: " + e.getMessage());
        }
    }
    
    private void addActivityCertificateIfPresent(Map<Integer, MultipartFile> map, int index, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            logger.info("📄 Activity certificate {}: {}", index, file.getOriginalFilename());
            map.put(index, file);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getEducationDetailsByUserId(@PathVariable Long userId) {
        try {
            logger.info("Fetching education details for user ID: {}", userId);
            Optional<EducationDetails> details = educationDetailsService.getEducationDetailsByUserId(userId);
            
            if (details.isPresent()) {
                logger.info("Found education details for user ID: {}, Record ID: {}", userId, details.get().getId());
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", details.get());
                return ResponseEntity.ok(response);
            } else {
                logger.info("No education details found for user ID: {}", userId);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Education details not found for user ID: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving education details for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving education details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/user/{userId}/all")
    public ResponseEntity<?> getAllEducationDetailsByUserId(@PathVariable Long userId) {
        try {
            logger.info("Fetching ALL education details for user ID: {}", userId);
            List<EducationDetails> detailsList = educationDetailsService.getAllEducationDetailsByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", detailsList);
            response.put("count", detailsList.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving all education details for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving education details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEducationDetailsById(@PathVariable Integer id) {
        try {
            Optional<EducationDetails> details = educationDetailsService.getEducationDetailsById(id);
            
            if (details.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", details.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Education details not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving education details for ID {}: {}", id, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving education details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllEducationDetails() {
        try {
            List<EducationDetails> details = educationDetailsService.getAllEducationDetails();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", details);
            response.put("count", details.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving all education details: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving all education details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // NEW ENDPOINT: Get users by college name for dashboard
    @GetMapping("/college/{collegeName}")
    public ResponseEntity<?> getUsersByCollege(@PathVariable String collegeName) {
        try {
            logger.info("Fetching users for college: {}", collegeName);
            
            List<EducationDetails> educationRecords = educationDetailsService.getByCollegeName(collegeName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", educationRecords);
            response.put("count", educationRecords.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching college data: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching college data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // NEW ENDPOINT: Get all unique colleges for dropdown
    @GetMapping("/colleges")
    public ResponseEntity<?> getAllColleges() {
        try {
            logger.info("Fetching all unique colleges");
            
            List<String> colleges = educationDetailsService.getAllUniqueColleges();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", colleges);
            response.put("count", colleges.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching colleges: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching colleges: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // NEW ENDPOINT: Get college statistics
    @GetMapping("/college/{collegeName}/stats")
    public ResponseEntity<?> getCollegeStats(@PathVariable String collegeName) {
        try {
            logger.info("Fetching statistics for college: {}", collegeName);
            
            Map<String, Object> stats = educationDetailsService.getCollegeStatistics(collegeName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching college statistics: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching college statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    private Long extractUserIdFromRequest(HttpServletRequest request) {
        // Check header first
        String userIdHeader = request.getHeader("User-ID");
        if (userIdHeader != null) {
            try {
                Long userId = Long.parseLong(userIdHeader);
                logger.info("✅ Extracted User ID from header: {}", userId);
                return userId;
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid user ID format in header");
            }
        }
        
        // Check parameter as fallback
        String userIdParam = request.getParameter("userId");
        if (userIdParam != null) {
            try {
                Long userId = Long.parseLong(userIdParam);
                logger.info("✅ Extracted User ID from parameter: {}", userId);
                return userId;
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid user ID format in parameter");
            }
        }
        
        // For development, you might want to require user ID
        throw new IllegalArgumentException("User ID is required in header or parameter");
    }
    
    private ResponseEntity<?> errorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}