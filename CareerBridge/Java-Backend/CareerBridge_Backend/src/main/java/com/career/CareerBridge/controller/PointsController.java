package com.career.CareerBridge.controller;

import com.career.CareerBridge.dto.PointsResponse;
import com.career.CareerBridge.dto.UserPointsDTO;
import com.career.CareerBridge.entity.PointsHistory;
import com.career.CareerBridge.service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "http://localhost:5173")
public class PointsController {
    
    @Autowired
    private PointsService pointsService;
    
    @PostMapping("/add")
    public ResponseEntity<?> addPoints(@RequestBody Map<String, String> request) {
        try {
            Long userId = getCurrentUserId();
            String activityType = request.get("activityType");
            String description = request.get("description");
            
            System.out.println("🎯 Adding points request - User: " + userId + 
                             ", Activity: " + activityType + 
                             ", Description: " + description);
            
            PointsResponse response = pointsService.addPoints(userId, activityType, description);
            
            Map<String, Object> apiResponse = new HashMap<>();
            apiResponse.put("success", response.isSuccess());
            apiResponse.put("message", response.getMessage());
            apiResponse.put("data", response.getData());
            
            if (response.isSuccess()) {
                System.out.println("✅ Points added successfully");
                return ResponseEntity.ok(apiResponse);
            } else {
                System.out.println("❌ Points addition failed");
                return ResponseEntity.badRequest().body(apiResponse);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Error adding points: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to add points: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/deduct")
    public ResponseEntity<?> deductPoints(@RequestBody Map<String, Object> request) {
        try {
            Long userId = getCurrentUserId();
            Integer points = (Integer) request.get("points");
            String description = (String) request.get("description");
            
            System.out.println("💰 Deducting points request - User: " + userId + 
                             ", Points: " + points + 
                             ", Description: " + description);
            
            PointsResponse response = pointsService.deductPoints(userId, points, description);
            
            Map<String, Object> apiResponse = new HashMap<>();
            apiResponse.put("success", response.isSuccess());
            apiResponse.put("message", response.getMessage());
            apiResponse.put("data", response.getData());
            
            if (response.isSuccess()) {
                System.out.println("✅ Points deducted successfully");
                return ResponseEntity.ok(apiResponse);
            } else {
                System.out.println("❌ Points deduction failed");
                return ResponseEntity.badRequest().body(apiResponse);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Error deducting points: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to deduct points: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserPoints() {
        try {
            Long userId = getCurrentUserId();
            UserPointsDTO userPoints = pointsService.getUserPoints(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userPoints);
            
            System.out.println("✅ User points retrieved for user ID: " + userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting user points: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<?> getPointsHistory(@RequestParam(defaultValue = "10") int limit) {
        try {
            Long userId = getCurrentUserId();
            List<PointsHistory> history = pointsService.getPointsHistory(userId, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", history);
            
            System.out.println("✅ Points history retrieved for user ID: " + userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting points history: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/overview")
    public ResponseEntity<?> getPointsOverview() {
        try {
            Long userId = getCurrentUserId();
            Map<String, Object> overview = pointsService.getPointsOverview(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", overview);
            
            System.out.println("✅ Points overview retrieved for user ID: " + userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting points overview: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/calculate-cash")
    public ResponseEntity<?> calculateCashValue(@RequestParam Integer points) {
        try {
            double cashValue = pointsService.getCashValue(points);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("points", points);
            response.put("cashValue", cashValue);
            response.put("currency", "INR");
            
            System.out.println("✅ Cash value calculated: " + points + " points = ₹" + cashValue);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error calculating cash value: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/calculate-points")
    public ResponseEntity<?> calculatePointsRequired(@RequestParam Double amount) {
        try {
            Integer pointsRequired = pointsService.getPointsRequiredForAmount(amount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("amount", amount);
            response.put("pointsRequired", pointsRequired);
            response.put("currency", "INR");
            
            System.out.println("✅ Points required calculated: ₹" + amount + " = " + pointsRequired + " points");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error calculating points required: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<Object[]> leaderboard = pointsService.getLeaderboard(limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", leaderboard);
            response.put("limit", limit);
            
            System.out.println("✅ Leaderboard retrieved with " + leaderboard.size() + " users");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting leaderboard: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // TODO: Implement proper authentication to get current user ID
    private Long getCurrentUserId() {
        // For demo purposes, return a default user ID
        // In real application, get from SecurityContext or JWT token
        return 1L; // Replace with actual user ID from authentication
    }
}