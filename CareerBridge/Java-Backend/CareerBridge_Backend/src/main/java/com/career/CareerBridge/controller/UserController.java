package com.career.CareerBridge.controller;

import com.career.CareerBridge.entity.User;
import com.career.CareerBridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("📝 Registration request received for: " + user.getEmail());
            
            boolean success = userService.registerUser(user);
            
            if (success) {
                response.put("success", true);
                response.put("message", "Registration successful!");
                System.out.println("✅ Registration successful for: " + user.getEmail());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Email already exists!");
                System.out.println("❌ Registration failed for: " + user.getEmail());
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Registration error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Registration failed due to server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            System.out.println("🎯 LOGIN API CALLED - Email: " + email);
            System.out.println("📧 Email received: " + email);
            System.out.println("🔑 Password received: " + (password != null ? "***" : "null"));
            System.out.println("📝 Credentials map: " + credentials);
            System.out.println("🔐 Login attempt for: " + email);
            
            if (email == null || password == null) {
                response.put("success", false);
                response.put("message", "Email and password are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            var loginResult = userService.loginUser(email, password);
            
            if (loginResult.containsKey("user")) {
                User user = (User) loginResult.get("user");
                
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("firstName", user.getFirstName());
                userData.put("lastName", user.getLastName());
                userData.put("email", user.getEmail());
                userData.put("isActive", user.getIsActive());
                userData.put("isNewUser", user.getIsNewUser());
                userData.put("createdAt", user.getCreatedAt());
                
                
                response.put("success", true);
                response.put("message", "Login successful!");
                response.put("user", userData);
                
                System.out.println("✅ Login successful for: " + email);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                System.out.println("❌ Login failed for: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Login error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Login failed due to server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userService.getUserById(id);
            
            if (user != null) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("firstName", user.getFirstName());
                userData.put("lastName", user.getLastName());
                userData.put("email", user.getEmail());
                userData.put("createdAt", user.getCreatedAt());
                userData.put("updatedAt", user.getUpdatedAt());
                
                response.put("success", true);
                response.put("user", userData);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching user");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/users/count")
    public ResponseEntity<Map<String, Object>> getUserCount() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long count = userService.getUserCount();
            response.put("success", true);
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error getting user count");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            System.out.println("📧 Email verification request for: " + email);
            
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean emailExists = userService.verifyEmailExists(email);
            
            if (emailExists) {
                response.put("success", true);
                response.put("message", "Email verified successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Email not found. Please check your email address.");
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Email verification error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Server error during email verification");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password-direct")
    public ResponseEntity<Map<String, Object>> resetPasswordDirect(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            
            System.out.println("🔄 Direct password reset request for: " + email);
            
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "New password is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (newPassword.length() < 6) {
                response.put("success", false);
                response.put("message", "Password must be at least 6 characters");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean success = userService.resetPasswordDirect(email, newPassword);
            
            if (success) {
                response.put("success", true);
                response.put("message", "Password has been reset successfully!");
                System.out.println("✅ Direct password reset completed successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to reset password. User not found.");
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Direct reset password error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Server error during password reset");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}