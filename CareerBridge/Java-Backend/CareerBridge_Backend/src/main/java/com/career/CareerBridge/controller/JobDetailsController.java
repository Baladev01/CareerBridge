package com.career.CareerBridge.controller;

import com.career.CareerBridge.dto.PointsResponse;
import com.career.CareerBridge.entity.JobDetails;
import com.career.CareerBridge.service.JobDetailsService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/job")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class JobDetailsController {

    private static final Logger logger = LoggerFactory.getLogger(JobDetailsController.class);

    @Autowired
    private JobDetailsService jobDetailsService;
    
    @Autowired
    private PointsService pointsService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveJobDetails(
            @RequestPart("data") String detailsJson,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            @RequestPart(value = "offerLetter", required = false) MultipartFile offerLetter,
            @RequestPart(value = "experienceLetter", required = false) MultipartFile experienceLetter,
            HttpServletRequest request) {
        
        try {
            logger.info("=== JOB DETAILS SAVE REQUEST ===");
            
            
            Long userId = extractUserIdFromRequest(request);
            logger.info("Processing request for User ID: {}", userId);
            
            JobDetails details = objectMapper.readValue(detailsJson, JobDetails.class);
            details.setUserId(userId);
            
            if (details.getCompanyName() == null || details.getCompanyName().trim().isEmpty()) {
                return errorResponse("Company name is required");
            }
            if (details.getRole() == null || details.getRole().trim().isEmpty()) {
                return errorResponse("Role is required");
            }
            
            // Save job details
            JobDetails savedDetails = jobDetailsService.saveJobDetails(details, resume, offerLetter, experienceLetter);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Job details saved successfully");
            response.put("data", savedDetails);
            response.put("pointsEarned", 10);
            response.put("pointsMessage", "Earned 10 points for completing job form!");
            
            logger.info("=== JOB DETAILS SAVE SUCCESS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("=== ERROR SAVING JOB DETAILS ===", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error saving job details: " + e.getMessage());
            
            // Provide specific error messages
            if (e.getMessage().contains("constraint") || e.getMessage().contains("NULL")) {
                errorResponse.put("message", "Database constraint violation. Please check all required fields.");
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateJobDetails(@RequestBody JobDetails details) {
        try {
            logger.info("=== UPDATE JOB DETAILS REQUEST ===");
            logger.info("Updating job details for User ID: {}", details.getUserId());
            
            if (details.getUserId() == null) {
                return errorResponse("User ID is required");
            }
            
            Optional<JobDetails> existingOpt = jobDetailsService.getJobDetailsByUserId(details.getUserId());
            
            if (existingOpt.isPresent()) {
                JobDetails existing = existingOpt.get();
                if (details.getCompanyName() != null) existing.setCompanyName(details.getCompanyName());
                if (details.getRole() != null) existing.setRole(details.getRole());
                if (details.getExperience() != null) existing.setExperience(details.getExperience());
                if (details.getJobDescription() != null) existing.setJobDescription(details.getJobDescription());
                
                existing.setUpdatedAt(LocalDateTime.now());
                JobDetails updated = jobDetailsService.updateJobDetails(existing);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Job details updated successfully");
                response.put("data", updated);
                
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Job details not found for user ID: " + details.getUserId());
            }
            
        } catch (Exception e) {
            logger.error("Error updating job details: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating job details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getJobDetailsByUserId(@PathVariable Long userId) {
        try {
            logger.info("Fetching job details for user ID: {}", userId);
            Optional<JobDetails> details = jobDetailsService.getJobDetailsByUserId(userId);
            
            if (details.isPresent()) {
                logger.info("Found job details for user ID: {}, Record ID: {}", userId, details.get().getId());
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", details.get());
                return ResponseEntity.ok(response);
            } else {
                logger.info("No job details found for user ID: {}", userId);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Job details not found for user ID: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving job details for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving job details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/user/{userId}/all")
    public ResponseEntity<?> getAllJobDetailsByUserId(@PathVariable Long userId) {
        try {
            var details = jobDetailsService.getAllJobDetailsByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", details);
            response.put("count", details.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving all job details for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving job details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllJobDetails() {
        try {
            var details = jobDetailsService.getAllJobDetails();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", details);
            response.put("count", details.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving all job details: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving all job details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobDetailsById(@PathVariable Integer id) {
        try {
            Optional<JobDetails> details = jobDetailsService.getJobDetailsById(id);
            
            if (details.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", details.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Job details not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving job details for ID {}: {}", id, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving job details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/company/{companyName}")
    public ResponseEntity<?> getUsersByCompany(@PathVariable String companyName) {
        try {
            logger.info("Fetching users for company: {}", companyName);
            
            List<JobDetails> jobRecords = jobDetailsService.getByCompanyName(companyName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", jobRecords);
            response.put("count", jobRecords.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching company data: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching company data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            logger.info("Fetching all unique companies");
            
            List<String> companies = jobDetailsService.getAllUniqueCompanies();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", companies);
            response.put("count", companies.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching companies: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching companies: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/company/{companyName}/stats")
    public ResponseEntity<?> getCompanyStats(@PathVariable String companyName) {
        try {
            logger.info("Fetching statistics for company: {}", companyName);
            
            Map<String, Object> stats = jobDetailsService.getCompanyStatistics(companyName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching company statistics: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching company statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    private Long extractUserIdFromRequest(HttpServletRequest request) {
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
        
        throw new IllegalArgumentException("User ID is required in header or parameter");
    }
    
    private ResponseEntity<?> errorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}