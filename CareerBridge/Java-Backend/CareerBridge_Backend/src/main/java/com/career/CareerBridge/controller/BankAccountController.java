package com.career.CareerBridge.controller;

import com.career.CareerBridge.entity.BankAccount;
import com.career.CareerBridge.service.BankAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank-accounts")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class BankAccountController {

    private static final Logger logger = LoggerFactory.getLogger(BankAccountController.class);
    
    @Autowired
    private BankAccountService bankAccountService;

    @PostMapping("/save")
    public ResponseEntity<?> saveBankAccount(@RequestBody BankAccount bankAccount, HttpServletRequest request) {
        try {
            logger.info("=== SAVE BANK ACCOUNT REQUEST ===");
            
            Long userId = extractUserIdFromRequest(request);
            bankAccount.setUserId(userId);
            
            logger.info("Saving bank account for User ID: {}", userId);
            
            if (bankAccount.getBankName() == null || bankAccount.getAccountHolder() == null || 
                bankAccount.getAccountNumber() == null || bankAccount.getIfscCode() == null) {
                return errorResponse("All bank account details are required");
            }
            
            BankAccount savedAccount = bankAccountService.saveBankAccount(bankAccount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bank account saved successfully");
            response.put("data", savedAccount);
            
            logger.info("✅ Bank account saved successfully for user {}", userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error saving bank account: {}", e.getMessage());
            return errorResponse("Error saving bank account: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserBankAccounts(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            logger.info("Fetching bank accounts for User ID: {}", userId);
            
            List<BankAccount> bankAccounts = bankAccountService.getBankAccountsByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", bankAccounts);
            response.put("count", bankAccounts.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching bank accounts: {}", e.getMessage());
            return errorResponse("Error fetching bank accounts: " + e.getMessage());
        }
    }

    @GetMapping("/default")
    public ResponseEntity<?> getDefaultBankAccount(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            var defaultAccount = bankAccountService.getDefaultBankAccount(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", defaultAccount.orElse(null));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching default bank account: {}", e.getMessage());
            return errorResponse("Error fetching default bank account: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBankAccount(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            bankAccountService.deleteBankAccount(id, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bank account deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error deleting bank account: {}", e.getMessage());
            return errorResponse("Error deleting bank account: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/set-default")
    public ResponseEntity<?> setDefaultBankAccount(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            BankAccount updatedAccount = bankAccountService.setDefaultBankAccount(id, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Default bank account updated successfully");
            response.put("data", updatedAccount);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error setting default bank account: {}", e.getMessage());
            return errorResponse("Error setting default bank account: " + e.getMessage());
        }
    }

    private Long extractUserIdFromRequest(HttpServletRequest request) {
        try {
            logger.info("🔍 Extracting User ID from request...");
            
            // Check header first
            String userIdHeader = request.getHeader("User-ID");
            logger.info("User-ID header value: {}", userIdHeader);
            
            if (userIdHeader != null && !userIdHeader.trim().isEmpty()) {
                Long userId = Long.parseLong(userIdHeader.trim());
                logger.info("✅ User ID extracted from header: {}", userId);
                return userId;
            }
            
            // Check parameter as fallback
            String userIdParam = request.getParameter("userId");
            logger.info("User-ID parameter value: {}", userIdParam);
            
            if (userIdParam != null && !userIdParam.trim().isEmpty()) {
                Long userId = Long.parseLong(userIdParam.trim());
                logger.info("✅ User ID extracted from parameter: {}", userId);
                return userId;
            }
            
            // Log all headers for debugging
            java.util.Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                logger.info("Header: {} = {}", headerName, request.getHeader(headerName));
            }
            
            throw new IllegalArgumentException("User ID is required. Please provide User-ID header.");
            
        } catch (NumberFormatException e) {
            logger.error("❌ Invalid user ID format", e);
            throw new IllegalArgumentException("Invalid user ID format. Must be a number.");
        }
    }
    
    private ResponseEntity<?> errorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}