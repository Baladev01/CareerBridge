package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    
    // Find all withdrawals by user ID
    List<Withdrawal> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find withdrawal by transaction ID
    Optional<Withdrawal> findByTransactionId(String transactionId);
    
    // Find withdrawals by status
    List<Withdrawal> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find withdrawals by user ID and status
    List<Withdrawal> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);
    
    // Count withdrawals by user ID
    long countByUserId(Long userId);
    
    // Sum total withdrawn amount by user ID
    @Query("SELECT COALESCE(SUM(w.amount), 0) FROM Withdrawal w WHERE w.userId = :userId AND w.status = 'COMPLETED'")
    Double getTotalWithdrawnAmountByUserId(@Param("userId") Long userId);
    
    // Check if user has any withdrawals
    boolean existsByUserId(Long userId);
}