package com.career.CareerBridge.controller;

import com.career.CareerBridge.dto.PointsResponse;
import com.career.CareerBridge.entity.PersonalDetails;
import com.career.CareerBridge.service.PersonalDetailsService;
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
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class PersonalDetailsController {

    private static final Logger logger = LoggerFactory.getLogger(PersonalDetailsController.class);
    
    @Autowired
    private PersonalDetailsService personalDetailsService;
    
    @Autowired
    private PointsService pointsService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> savePersonalDetails(
            @RequestPart("data") String detailsJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            HttpServletRequest request) {
        
        try {
            logger.info("=== PERSONAL DETAILS SAVE REQUEST ===");
            
           
            Long userId = extractUserIdFromRequest(request);
            logger.info("Processing request for User ID: {}", userId);
            
            PersonalDetails details = objectMapper.readValue(detailsJson, PersonalDetails.class);
            details.setUserId(userId);
            
            PersonalDetails savedDetails = personalDetailsService.savePersonalDetails(details, profilePhoto);
            
            PointsResponse pointsResponse = pointsService.addPoints(
                userId, 
                "personal_form", 
                "Completed personal details form"
            );
            logger.info("🎉 10 points added for personal form: {}", pointsResponse.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Personal details saved successfully");
            response.put("data", savedDetails);
            response.put("pointsEarned", 10);
            response.put("pointsMessage", "Earned 10 points for completing personal form!");
            
            logger.info("=== PERSONAL DETAILS SAVE SUCCESS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("=== ERROR SAVING PERSONAL DETAILS ===", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error saving personal details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePersonalDetails(@RequestBody PersonalDetails details) {
        try {
            logger.info("=== UPDATE PERSONAL DETAILS REQUEST ===");
            logger.info("Updating personal details for User ID: {}", details.getUserId());
            
            Optional<PersonalDetails> existingOpt = personalDetailsService.getPersonalDetailsByUserId(details.getUserId());
            
            if (existingOpt.isPresent()) {
                PersonalDetails existing = existingOpt.get();
                if (details.getName() != null) existing.setName(details.getName());
                if (details.getEmail() != null) existing.setEmail(details.getEmail());
                if (details.getPhone() != null) existing.setPhone(details.getPhone());
                if (details.getDateOfBirth() != null) existing.setDateOfBirth(details.getDateOfBirth());
                if (details.getAge() != null) existing.setAge(details.getAge());
                if (details.getGender() != null) existing.setGender(details.getGender());
                if (details.getMaritalStatus() != null) existing.setMaritalStatus(details.getMaritalStatus());
                if (details.getAddress() != null) existing.setAddress(details.getAddress());
                if (details.getCity() != null) existing.setCity(details.getCity());
                if (details.getState() != null) existing.setState(details.getState());
                if (details.getPincode() != null) existing.setPincode(details.getPincode());
                if (details.getCountry() != null) existing.setCountry(details.getCountry());
                
                existing.setUpdatedAt(LocalDateTime.now());
                PersonalDetails updated = personalDetailsService.updatePersonalDetails(existing);
                
                PointsResponse pointsResponse = pointsService.addPoints(
                    details.getUserId(), 
                    "personal_update", 
                    "Updated personal details form"
                );
                logger.info("🎉 10 points added for personal form update: {}", pointsResponse.getMessage());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Personal details updated successfully");
                response.put("data", updated);
                response.put("pointsEarned", 10);
                response.put("pointsMessage", "Earned 10 points for updating personal details!");
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Personal details not found for user");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error updating personal details: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating personal details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPersonalDetailsByUserId(@PathVariable Long userId) {
        try {
            logger.info("Fetching personal details for user ID: {}", userId);
            Optional<PersonalDetails> details = personalDetailsService.getPersonalDetailsByUserId(userId);
            
            if (details.isPresent()) {
                PersonalDetails personalDetails = details.get();
                logger.info("Found personal details for user ID: {}, Record ID: {}", userId, personalDetails.getId());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", personalDetails);
                return ResponseEntity.ok(response);
            } else {
                logger.info("No personal details found for user ID: {}", userId);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Personal details not found for user ID: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving personal details for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving personal details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/user/{userId}/all")
    public ResponseEntity<?> getAllPersonalDetailsByUserId(@PathVariable Long userId) {
        try {
            var details = personalDetailsService.getAllPersonalDetailsByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", details);
            response.put("count", details.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving all personal details for user {}: {}", userId, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving personal details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllPersonalDetails() {
        try {
            var details = personalDetailsService.getAllPersonalDetails();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", details);
            response.put("count", details.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving all personal details: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving all personal details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPersonalDetailsById(@PathVariable Integer id) {
        try {
            Optional<PersonalDetails> details = personalDetailsService.getPersonalDetailsById(id);
            
            if (details.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", details.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Personal details not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving personal details for ID {}: {}", id, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving personal details: " + e.getMessage());
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