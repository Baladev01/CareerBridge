package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.User;
import com.career.CareerBridge.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public boolean registerUser(User user) {
        try {
            System.out.println("📝 Starting registration for: " + user.getEmail());
            
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                System.out.println("❌ Email already exists: " + user.getEmail());
                return false;
            }

            if (user.getIsActive() == null) {
                user.setIsActive(true);
            }
            if (user.getIsNewUser() == null) {
                user.setIsNewUser(true);
            }
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(LocalDateTime.now());
            }
            if (user.getUpdatedAt() == null) {
                user.setUpdatedAt(LocalDateTime.now());
            }

            System.out.println("💾 Saving user to database...");
            // Save user
            userRepository.save(user);
            System.out.println("✅ User saved successfully: " + user.getEmail());
            return true;
            
        } catch (Exception e) {
            System.err.println("💥 Registration error for " + user.getEmail() + ": " + e.getMessage());
            e.printStackTrace();
            throw e; 
        }
    }

    public Map<String, Object> loginUser(String email, String password) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            System.out.println("🔍 UserService.loginUser called with email: " + email);
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            System.out.println("👤 User found in database: " + userOpt.isPresent());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("📋 User details - Email: " + user.getEmail() + ", Active: " + user.getIsActive());
                System.out.println("🔑 Input password: '" + password + "'");
                System.out.println("🔑 Stored password: '" + user.getPassword() + "'");
                
                // Check if user is active
                if (!user.getIsActive()) {
                    System.out.println("❌ User account is inactive: " + email);
                    return result;
                }
                
                // Check password
                boolean passwordMatches = user.getPassword().equals(password);
                System.out.println("🔐 Password matches: " + passwordMatches);
                
                if (passwordMatches) {
                    result.put("user", user);
                    System.out.println("✅ Login successful in service layer for: " + email);
                    return result;
                }
            }
            
            System.out.println("❌ Login failed in service layer for: " + email);
            return result; // Empty result for invalid login
            
        } catch (Exception e) {
            System.err.println("💥 Error during login: " + e.getMessage());
            e.printStackTrace();
            return result;
        }
    }

    
  
    public User getUserById(Long userId) {
        try {
            return userRepository.findById(userId).orElse(null);
        } catch (Exception e) {
            logger.error("Error fetching user by ID {}: {}", userId, e.getMessage());
            return null;
        }
    }

    public long getUserCount() {
        return userRepository.count();
    }

    public boolean verifyEmailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public boolean resetPasswordDirect(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public void markAsExistingUser(Long userId) {
        userRepository.markAsExistingUser(userId);
    }
}