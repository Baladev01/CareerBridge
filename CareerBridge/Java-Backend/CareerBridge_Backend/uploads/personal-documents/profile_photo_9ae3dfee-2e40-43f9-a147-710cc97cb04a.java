package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.User;
import com.career.CareerBridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new user
     * @param user User object containing registration details
     * @return true if registration successful, false if email already exists
     */
    public boolean registerUser(User user) {
        try {
            System.out.println("🔄 Attempting to register user: " + user.getEmail());
            
            // Check if user already exists
            if (userRepository.existsByEmail(user.getEmail())) {
                System.out.println("❌ Registration failed - Email already exists: " + user.getEmail());
                return false;
            }
            
            // Validate required fields
            if (user.getFirstName() == null || user.getFirstName().trim().isEmpty() ||
                user.getLastName() == null || user.getLastName().trim().isEmpty() ||
                user.getEmail() == null || user.getEmail().trim().isEmpty() ||
                user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                System.out.println("❌ Registration failed - Missing required fields");
                return false;
            }
            
            // Save user
            User savedUser = userRepository.save(user);
            
            System.out.println("✅ User Registered Successfully!");
            System.out.println("=====================================");
            System.out.println("ID: " + savedUser.getId());
            System.out.println("Name: " + savedUser.getFirstName() + " " + savedUser.getLastName());
            System.out.println("Email: " + savedUser.getEmail());
            System.out.println("Created At: " + savedUser.getCreatedAt());
            System.out.println("=====================================");
            
            return true;
            
        } catch (Exception e) {
            System.err.println("❌ Error during user registration: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Login user with email and password
     * @param email User's email
     * @param password User's password
     * @return Optional containing User if login successful, empty otherwise
     */
    public Optional<User> loginUser(String email, String password) {
        try {
            System.out.println("🔄 Attempting login for: " + email);
            
            if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                System.out.println("❌ Login failed - Email or password is empty");
                return Optional.empty();
            }
            
            Optional<User> userOpt = userRepository.findByEmailAndPassword(email, password);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("✅ Login Successful!");
                System.out.println("=====================================");
                System.out.println("ID: " + user.getId());
                System.out.println("Name: " + user.getFirstName() + " " + user.getLastName());
                System.out.println("Email: " + user.getEmail());
                System.out.println("=====================================");
            } else {
                System.out.println("❌ Login failed - Invalid credentials for: " + email);
            }
            
            return userOpt;
            
        } catch (Exception e) {
            System.err.println("❌ Error during user login: " + e.getMessage());
            e.printStackTrace();
            return Optional.empty();
        }
    }

    /**
     * Get user by ID
     * @param id User ID
     * @return Optional containing User if found, empty otherwise
     */
    public Optional<User> getUserById(Long id) {
        try {
            System.out.println("🔍 Fetching user by ID: " + id);
            Optional<User> userOpt = userRepository.findById(id);
            
            if (userOpt.isPresent()) {
                System.out.println("✅ User found: " + userOpt.get().getEmail());
            } else {
                System.out.println("❌ User not found with ID: " + id);
            }
            
            return userOpt;
        } catch (Exception e) {
            System.err.println("❌ Error fetching user by ID: " + e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Get user by email
     * @param email User's email
     * @return Optional containing User if found, empty otherwise
     */
    public Optional<User> getUserByEmail(String email) {
        try {
            System.out.println("🔍 Fetching user by email: " + email);
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isPresent()) {
                System.out.println("✅ User found: " + userOpt.get().getEmail());
            } else {
                System.out.println("❌ User not found with email: " + email);
            }
            
            return userOpt;
        } catch (Exception e) {
            System.err.println("❌ Error fetching user by email: " + e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Check if email exists
     * @param email Email to check
     * @return true if email exists, false otherwise
     */
    public boolean isEmailExists(String email) {
        try {
            boolean exists = userRepository.existsByEmail(email);
            System.out.println("📧 Email exists check for " + email + ": " + exists);
            return exists;
        } catch (Exception e) {
            System.err.println("❌ Error checking email existence: " + e.getMessage());
            return false;
        }
    }

    /**
     * Update user profile
     * @param user User object with updated details
     * @return true if update successful, false otherwise
     */
    public boolean updateUser(User user) {
        try {
            if (user.getId() == null) {
                System.out.println("❌ Update failed - User ID is null");
                return false;
            }
            
            Optional<User> existingUserOpt = userRepository.findById(user.getId());
            if (existingUserOpt.isEmpty()) {
                System.out.println("❌ Update failed - User not found with ID: " + user.getId());
                return false;
            }
            
            User existingUser = existingUserOpt.get();
            
            // Update fields if provided
            if (user.getFirstName() != null) existingUser.setFirstName(user.getFirstName());
            if (user.getLastName() != null) existingUser.setLastName(user.getLastName());
            if (user.getPassword() != null) existingUser.setPassword(user.getPassword());
            
            User updatedUser = userRepository.save(existingUser);
            System.out.println("✅ User updated successfully: " + updatedUser.getEmail());
            return true;
            
        } catch (Exception e) {
            System.err.println("❌ Error updating user: " + e.getMessage());
            return false;
        }
    }

    /**
     * Delete user by ID
     * @param id User ID to delete
     * @return true if deletion successful, false otherwise
     */
    public boolean deleteUser(Long id) {
        try {
            if (!userRepository.existsById(id)) {
                System.out.println("❌ Delete failed - User not found with ID: " + id);
                return false;
            }
            
            userRepository.deleteById(id);
            System.out.println("✅ User deleted successfully with ID: " + id);
            return true;
            
        } catch (Exception e) {
            System.err.println("❌ Error deleting user: " + e.getMessage());
            return false;
        }
    }

    /**
     * Get total user count
     * @return Total number of users
     */
    public long getUserCount() {
        try {
            long count = userRepository.count();
            System.out.println("👥 Total users in system: " + count);
            return count;
        } catch (Exception e) {
            System.err.println("❌ Error getting user count: " + e.getMessage());
            return 0;
        }
    }
}