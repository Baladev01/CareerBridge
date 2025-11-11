package com.career.CareerBridge.controller;

import com.career.CareerBridge.entity.CollegeActivity;
import com.career.CareerBridge.service.CollegeActivityService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class CollegeActivityController {
    
    @Autowired
    private CollegeActivityService service;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveActivity(
            @RequestPart("data") String activityJson,
            @RequestPart(value = "certificate", required = false) MultipartFile certificate) {
        
        try {
            CollegeActivity activity = objectMapper.readValue(activityJson, CollegeActivity.class);
            CollegeActivity savedActivity = service.saveActivity(activity, certificate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Activity saved successfully");
            response.put("data", savedActivity);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error saving activity: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserActivities(@PathVariable Long userId) {
        try {
            List<CollegeActivity> activities = service.getUserActivities(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activities);
            response.put("count", activities.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching activities");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{activityId}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long activityId) {
        try {
            service.deleteActivity(activityId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Activity deleted successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error deleting activity");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}