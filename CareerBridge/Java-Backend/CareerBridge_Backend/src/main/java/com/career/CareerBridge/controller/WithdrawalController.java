// controller/WithdrawalController.java
package com.career.CareerBridge.controller;

import com.career.CareerBridge.entity.Withdrawal;
import com.career.CareerBridge.service.WithdrawalService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/withdrawals")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class WithdrawalController {

    private static final Logger logger = LoggerFactory.getLogger(WithdrawalController.class);
    
    @Autowired
    private WithdrawalService withdrawalService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/request")
    public ResponseEntity<?> requestWithdrawal(@RequestBody Map<String, Object> withdrawalRequest, HttpServletRequest request) {
        try {
            logger.info("=== WITHDRAWAL REQUEST ===");
            
            // Extract user ID from request
            Long userId = extractUserIdFromRequest(request);
            logger.info("Processing withdrawal request for User ID: {}", userId);
            
            // Validate withdrawal request
            if (!withdrawalRequest.containsKey("amount") || !withdrawalRequest.containsKey("pointsUsed") || !withdrawalRequest.containsKey("paymentMethod")) {
                return errorResponse("Amount, pointsUsed, and paymentMethod are required");
            }
            
            // Parse and validate amount
            Double amount;
            try {
                amount = Double.valueOf(withdrawalRequest.get("amount").toString());
            } catch (NumberFormatException e) {
                return errorResponse("Invalid amount format");
            }
            
            // Parse and validate points
            Integer pointsUsed;
            try {
                pointsUsed = Integer.valueOf(withdrawalRequest.get("pointsUsed").toString());
            } catch (NumberFormatException e) {
                return errorResponse("Invalid points format");
            }
            
            String paymentMethod = withdrawalRequest.get("paymentMethod").toString();
            
            // Validate minimum amount
            if (amount < 50) {
                return errorResponse("Minimum withdrawal amount is ₹50");
            }
            
            if (pointsUsed <= 0) {
                return errorResponse("Points used must be greater than 0");
            }
            
            // Create withdrawal entity
            Withdrawal withdrawal = new Withdrawal(userId, amount, pointsUsed, paymentMethod);
            
            // Handle bank details
            if ("bank".equals(paymentMethod)) {
                if (!withdrawalRequest.containsKey("bankDetails")) {
                    return errorResponse("Bank details are required for bank transfer");
                }
                
                Object bankDetailsObj = withdrawalRequest.get("bankDetails");
                if (!(bankDetailsObj instanceof Map)) {
                    return errorResponse("Invalid bank details format");
                }
                
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> bankDetails = (Map<String, Object>) bankDetailsObj;
                    withdrawal.setBankDetails(objectMapper.writeValueAsString(bankDetails));
                    logger.info("Bank details processed for user: {}", userId);
                } catch (Exception e) {
                    logger.error("Error processing bank details: {}", e.getMessage());
                    return errorResponse("Invalid bank details format");
                }
            } else if ("upi".equals(paymentMethod)) {
                if (!withdrawalRequest.containsKey("upiId")) {
                    return errorResponse("UPI ID is required for UPI transfer");
                }
                
                String upiId = withdrawalRequest.get("upiId").toString().trim();
                if (upiId.isEmpty() || !upiId.contains("@")) {
                    return errorResponse("Please enter a valid UPI ID");
                }
                
                withdrawal.setUpiId(upiId);
                logger.info("UPI ID processed for user: {}", userId);
            } else {
                return errorResponse("Invalid payment method");
            }
            
            // Save withdrawal
            Withdrawal savedWithdrawal = withdrawalService.createWithdrawal(withdrawal);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Withdrawal request submitted successfully");
            response.put("data", savedWithdrawal);
            
            logger.info("✅ Withdrawal request created: {}", savedWithdrawal.getTransactionId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error processing withdrawal request: {}", e.getMessage());
            return errorResponse("Error processing withdrawal request: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserWithdrawals(HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            logger.info("Fetching withdrawals for User ID: {}", userId);
            
            List<Withdrawal> withdrawals = withdrawalService.getWithdrawalsByUserId(userId);
            Double totalWithdrawn = withdrawalService.getTotalWithdrawnAmount(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", withdrawals);
            response.put("totalWithdrawn", totalWithdrawn);
            response.put("count", withdrawals.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching user withdrawals: {}", e.getMessage());
            return errorResponse("Error fetching withdrawals: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWithdrawalById(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = extractUserIdFromRequest(request);
            Optional<Withdrawal> withdrawal = withdrawalService.getWithdrawalById(id);
            
            if (withdrawal.isPresent() && withdrawal.get().getUserId().equals(userId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", withdrawal.get());
                return ResponseEntity.ok(response);
            } else {
                return errorResponse("Withdrawal not found or access denied");
            }
            
        } catch (Exception e) {
            logger.error("Error fetching withdrawal: {}", e.getMessage());
            return errorResponse("Error fetching withdrawal: " + e.getMessage());
        }
    }

    // Admin endpoints
    @GetMapping("/all")
    public ResponseEntity<?> getAllWithdrawals() {
        try {
            List<Withdrawal> withdrawals = withdrawalService.getAllWithdrawals();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", withdrawals);
            response.put("count", withdrawals.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching all withdrawals: {}", e.getMessage());
            return errorResponse("Error fetching withdrawals: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateWithdrawalStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            String failureReason = statusUpdate.get("failureReason");
            
            if (status == null) {
                return errorResponse("Status is required");
            }
            
            Withdrawal updatedWithdrawal = withdrawalService.updateWithdrawalStatus(id, status, failureReason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Withdrawal status updated successfully");
            response.put("data", updatedWithdrawal);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error updating withdrawal status: {}", e.getMessage());
            return errorResponse("Error updating withdrawal status: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/process")
    public ResponseEntity<?> processWithdrawal(@PathVariable Long id) {
        try {
            Withdrawal processedWithdrawal = withdrawalService.processWithdrawal(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Withdrawal processing started");
            response.put("data", processedWithdrawal);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error processing withdrawal: {}", e.getMessage());
            return errorResponse("Error processing withdrawal: " + e.getMessage());
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