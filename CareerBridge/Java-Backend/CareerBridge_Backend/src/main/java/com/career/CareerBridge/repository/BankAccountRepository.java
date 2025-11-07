// repository/BankAccountRepository.java
package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    
    List<BankAccount> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<BankAccount> findByUserIdAndIsDefaultTrue(Long userId);
    
    Optional<BankAccount> findByIdAndUserId(Long id, Long userId);
    
    boolean existsByUserIdAndAccountNumber(Long userId, String accountNumber);
    
    long countByUserId(Long userId);
    
    @Query("SELECT COUNT(ba) FROM BankAccount ba WHERE ba.userId = :userId")
    long countBankAccountsByUserId(@Param("userId") Long userId);
}