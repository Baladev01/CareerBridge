package com.career.CareerBridge.controller;

import com.career.CareerBridge.dto.AdminForgotPasswordRequest;
import com.career.CareerBridge.dto.AdminResetPasswordRequest;
import com.career.CareerBridge.entity.Admin;
import com.career.CareerBridge.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Admin admin) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("📝 Admin registration request received for: " + admin.getEmail());
            
            var registrationResult = adminService.registerAdmin(admin);
            
            if ((Boolean) registrationResult.get("success")) {
                response.put("success", true);
                response.put("message", registrationResult.get("message"));
                System.out.println("✅ Admin registration successful for: " + admin.getEmail());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", registrationResult.get("message"));
                System.out.println("❌ Admin registration failed for: " + admin.getEmail());
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Admin registration error: " + e.getMessage());
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
            
            System.out.println("🎯 ADMIN LOGIN API CALLED - Email: " + email);
            System.out.println("📧 Email received: " + email);
            System.out.println("🔑 Password received: " + (password != null ? "***" : "null"));
            
            if (email == null || password == null) {
                response.put("success", false);
                response.put("message", "Email and password are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            var loginResult = adminService.loginAdmin(email, password);
            
            if (loginResult.get("success").equals(true)) {
                Admin admin = (Admin) loginResult.get("admin");
                
                Map<String, Object> adminData = new HashMap<>();
                adminData.put("id", admin.getId());
                adminData.put("firstName", admin.getFirstName());
                adminData.put("lastName", admin.getLastName());
                adminData.put("email", admin.getEmail());
                adminData.put("role", admin.getRole());
                adminData.put("phone", admin.getPhone());
                adminData.put("isActive", admin.getIsActive());
                adminData.put("lastLogin", admin.getLastLogin());
                adminData.put("createdAt", admin.getCreatedAt());
                
                response.put("success", true);
                response.put("message", "Admin login successful!");
                response.put("admin", adminData);
                
                System.out.println("✅ Admin login successful for: " + email);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", loginResult.get("message"));
                System.out.println("❌ Admin login failed for: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Admin login error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Login failed due to server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            System.out.println("📧 Admin email verification request for: " + email);
            
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean emailExists = adminService.verifyEmailExists(email);
            
            if (emailExists) {
                response.put("success", true);
                response.put("message", "Email verified successfully");
                System.out.println("✅ Admin email verified: " + email);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Admin email not found. Please check your email address.");
                System.out.println("❌ Admin email not found: " + email);
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Admin email verification error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Server error during email verification");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password-direct")
    public ResponseEntity<Map<String, Object>> resetPasswordDirect(@RequestBody AdminResetPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.getEmail();
            String newPassword = request.getNewPassword();
            
            System.out.println("🔄 Admin direct password reset request for: " + email);
            
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
            
            boolean success = adminService.resetPasswordDirect(email, newPassword);
            
            if (success) {
                response.put("success", true);
                response.put("message", "Password has been reset successfully!");
                System.out.println("✅ Admin password reset completed successfully for: " + email);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to reset password. Admin not found.");
                System.out.println("❌ Admin password reset failed for: " + email);
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            System.err.println("💥 Admin reset password error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Server error during password reset");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAdminById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            var adminOpt = adminService.getAdminById(id);
            
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                
                Map<String, Object> adminData = new HashMap<>();
                adminData.put("id", admin.getId());
                adminData.put("firstName", admin.getFirstName());
                adminData.put("lastName", admin.getLastName());
                adminData.put("email", admin.getEmail());
                adminData.put("role", admin.getRole());
                adminData.put("phone", admin.getPhone());
                adminData.put("isActive", admin.getIsActive());
                adminData.put("lastLogin", admin.getLastLogin());
                adminData.put("createdAt", admin.getCreatedAt());
                adminData.put("updatedAt", admin.getUpdatedAt());
                
                response.put("success", true);
                response.put("admin", adminData);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Admin not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching admin");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getAdminCount() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long count = adminService.getAdminCount();
            response.put("success", true);
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error getting admin count");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}/points")
    public ResponseEntity<Map<String, Object>> getAdminPoints(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Integer points = adminService.getAdminPoints(id);
            
            response.put("success", true);
            response.put("points", points);
            response.put("adminId", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("💥 Error getting admin points: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Error fetching admin points");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}