// AdminService.java
package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.Admin;
import com.career.CareerBridge.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Transactional
    public Map<String, Object> registerAdmin(Admin admin) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("🔧 Starting admin registration for: " + admin.getEmail());
            
            // Check if email already exists
            if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
                result.put("success", false);
                result.put("message", "Email already exists!");
                System.out.println("❌ Admin registration failed - Email exists: " + admin.getEmail());
                return result;
            }

            // Set default values for new admin
            admin.setRole("admin");
            admin.setIsActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            // Save admin
            Admin savedAdmin = adminRepository.save(admin);
            
            result.put("success", true);
            result.put("message", "Admin registration successful!");
            result.put("admin", savedAdmin);
            
            System.out.println("✅ Admin registration successful for: " + admin.getEmail());
            return result;
            
        } catch (Exception e) {
            System.err.println("💥 Error registering admin: " + e.getMessage());
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "Registration failed due to server error");
            return result;
        }
    }

    public Map<String, Object> loginAdmin(String email, String password) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("🔍 AdminService.loginAdmin called with email: " + email);
            
            Optional<Admin> adminOpt = adminRepository.findActiveAdminByEmail(email);
            System.out.println("👤 Admin found in database: " + adminOpt.isPresent());
            
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                System.out.println("📋 Admin details - Email: " + admin.getEmail() + ", Password in DB: " + admin.getPassword());
                System.out.println("🔑 Input password: '" + password + "'");
                System.out.println("🔑 Stored password: '" + admin.getPassword() + "'");
                
                // Check password
                boolean passwordMatches = admin.getPassword().equals(password);
                System.out.println("🔐 Password matches: " + passwordMatches);
                
                if (passwordMatches) {
                    // Update last login time
                    admin.setLastLogin(LocalDateTime.now());
                    admin.setUpdatedAt(LocalDateTime.now());
                    adminRepository.save(admin);
                    
                    result.put("success", true);
                    result.put("message", "Login successful!");
                    result.put("admin", admin);
                    
                    System.out.println("✅ Admin login successful for: " + email);
                    return result;
                }
            }
            
            System.out.println("❌ Admin login failed for: " + email);
            result.put("success", false);
            result.put("message", "Invalid email or password");
            return result;
            
        } catch (Exception e) {
            System.err.println("💥 Error during admin login: " + e.getMessage());
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "Login failed due to server error");
            return result;
        }
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public boolean verifyEmailExists(String email) {
        return adminRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public boolean resetPasswordDirect(String email, String newPassword) {
        try {
            Optional<Admin> adminOpt = adminRepository.findByEmail(email);
            
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                admin.setPassword(newPassword);
                admin.setUpdatedAt(LocalDateTime.now());
                adminRepository.save(admin);
                
                System.out.println("✅ Admin password reset successful for: " + email);
                return true;
            }
            
            System.out.println("❌ Admin not found for password reset: " + email);
            return false;
            
        } catch (Exception e) {
            System.err.println("💥 Error resetting admin password: " + e.getMessage());
            return false;
        }
    }

    public long getAdminCount() {
        return adminRepository.count();
    }

    public Optional<Admin> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Integer getAdminPoints(Long adminId) {
        try {
            Optional<Admin> adminOpt = adminRepository.findById(adminId);
            return adminOpt.map(admin -> 100).orElse(0); // Default points for admin
        } catch (Exception e) {
            System.err.println("Error getting admin points: " + e.getMessage());
            return 0;
        }
    }
}