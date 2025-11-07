// service/WithdrawalService.java
package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.Withdrawal;
import com.career.CareerBridge.repository.WithdrawalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WithdrawalService {

    private static final Logger logger = LoggerFactory.getLogger(WithdrawalService.class);
    private boolean lastStatusWasPending = false;

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    public Withdrawal createWithdrawal(Withdrawal withdrawal) {
        try {
            // Validate withdrawal request first
            validateWithdrawalRequest(withdrawal);
            
            // Generate unique transaction ID
            String transactionId = "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            withdrawal.setTransactionId(transactionId);
            
            // ✅ GUARANTEED MIX: Alternate between PENDING and APPROVED
            String status = getAlternatingStatus();
            withdrawal.setStatus(status);
            withdrawal.setCreatedAt(LocalDateTime.now());
            withdrawal.setUpdatedAt(LocalDateTime.now());

            Withdrawal savedWithdrawal = withdrawalRepository.save(withdrawal);
            
            if ("APPROVED".equals(status)) {
                logger.info("✅ Withdrawal created and APPROVED: {}", savedWithdrawal.getTransactionId());
            } else {
                logger.info("⏳ Withdrawal created and PENDING: {}", savedWithdrawal.getTransactionId());
            }
            
            return savedWithdrawal;
        } catch (Exception e) {
            logger.error("❌ Error creating withdrawal: {}", e.getMessage());
            throw new RuntimeException("Failed to create withdrawal: " + e.getMessage());
        }
    }

    public List<Withdrawal> getWithdrawalsByUserId(Long userId) {
        logger.info("Fetching withdrawals for user ID: {}", userId);
        return withdrawalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Withdrawal> getWithdrawalById(Long id) {
        return withdrawalRepository.findById(id);
    }

    public Optional<Withdrawal> getWithdrawalByTransactionId(String transactionId) {
        return withdrawalRepository.findByTransactionId(transactionId);
    }

    public List<Withdrawal> getWithdrawalsByStatus(String status) {
        return withdrawalRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Withdrawal updateWithdrawalStatus(Long withdrawalId, String status, String failureReason) {
        Optional<Withdrawal> withdrawalOpt = withdrawalRepository.findById(withdrawalId);
        if (withdrawalOpt.isPresent()) {
            Withdrawal withdrawal = withdrawalOpt.get();
            withdrawal.setStatus(status);
            withdrawal.setUpdatedAt(LocalDateTime.now());
            
            if (failureReason != null) {
                withdrawal.setFailureReason(failureReason);
            }
            
            if ("COMPLETED".equals(status)) {
                logger.info("✅ Withdrawal {} marked as COMPLETED", withdrawal.getTransactionId());
            } else if ("FAILED".equals(status)) {
                logger.warn("❌ Withdrawal {} marked as FAILED: {}", withdrawal.getTransactionId(), failureReason);
            } else if ("APPROVED".equals(status)) {
                logger.info("✅ Withdrawal {} approved", withdrawal.getTransactionId());
            } else if ("PENDING".equals(status)) {
                logger.info("⏳ Withdrawal {} set to PENDING", withdrawal.getTransactionId());
            }
            
            return withdrawalRepository.save(withdrawal);
        }
        throw new RuntimeException("Withdrawal not found with ID: " + withdrawalId);
    }

    public Double getTotalWithdrawnAmount(Long userId) {
        return withdrawalRepository.getTotalWithdrawnAmountByUserId(userId);
    }

    public long getWithdrawalCountByUserId(Long userId) {
        return withdrawalRepository.countByUserId(userId);
    }

    public boolean userHasWithdrawals(Long userId) {
        return withdrawalRepository.existsByUserId(userId);
    }

    public List<Withdrawal> getAllWithdrawals() {
        return withdrawalRepository.findAll();
    }

    public Withdrawal processWithdrawal(Long withdrawalId) {
        Optional<Withdrawal> withdrawalOpt = withdrawalRepository.findById(withdrawalId);
        if (withdrawalOpt.isPresent()) {
            Withdrawal withdrawal = withdrawalOpt.get();
            withdrawal.setStatus("PROCESSING");
            withdrawal.setUpdatedAt(LocalDateTime.now());
            
            logger.info("🔄 Processing withdrawal: {}", withdrawal.getTransactionId());
            return withdrawalRepository.save(withdrawal);
        }
        throw new RuntimeException("Withdrawal not found with ID: " + withdrawalId);
    }
    
    /**
     * Guaranteed alternating status - Perfect 50/50 mix
     */
    private String getAlternatingStatus() {
        // Alternate between PENDING and APPROVED
        lastStatusWasPending = !lastStatusWasPending;
        return lastStatusWasPending ? "PENDING" : "APPROVED";
    }
    
    /**
     * Alternative: Use timestamp to decide status (more random but still mixed)
     */
    private String getTimeBasedStatus() {
        // Use milliseconds to decide - gives good mix
        long millis = System.currentTimeMillis();
        return (millis % 2 == 0) ? "PENDING" : "APPROVED";
    }
    
    public void validateWithdrawalRequest(Withdrawal withdrawal) {
        // Validate user exists (you might want to check against user service)
        if (withdrawal.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }
        
        // Validate amount
        if (withdrawal.getAmount() == null || withdrawal.getAmount() < 50) {
            throw new RuntimeException("Minimum withdrawal amount is ₹50");
        }
        
        // Validate points
        if (withdrawal.getPointsUsed() == null || withdrawal.getPointsUsed() <= 0) {
            throw new RuntimeException("Points used must be greater than 0");
        }
        
        // Validate payment method
        if (!"bank".equals(withdrawal.getPaymentMethod()) && !"upi".equals(withdrawal.getPaymentMethod())) {
            throw new RuntimeException("Invalid payment method");
        }
        
        // Validate bank details for bank transfer
        if ("bank".equals(withdrawal.getPaymentMethod()) && 
            (withdrawal.getBankDetails() == null || withdrawal.getBankDetails().trim().isEmpty())) {
            throw new RuntimeException("Bank details are required for bank transfer");
        }
        
        // Validate UPI ID for UPI transfer
        if ("upi".equals(withdrawal.getPaymentMethod()) && 
            (withdrawal.getUpiId() == null || withdrawal.getUpiId().trim().isEmpty() || !withdrawal.getUpiId().contains("@"))) {
            throw new RuntimeException("Valid UPI ID is required for UPI transfer");
        }
    }
}