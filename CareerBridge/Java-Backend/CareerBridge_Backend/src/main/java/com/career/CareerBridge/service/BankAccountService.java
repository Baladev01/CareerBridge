package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.BankAccount;
import com.career.CareerBridge.repository.BankAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BankAccountService {

    private static final Logger logger = LoggerFactory.getLogger(BankAccountService.class);

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public BankAccount saveBankAccount(BankAccount bankAccount) {
        try {
            if (bankAccountRepository.existsByUserIdAndAccountNumber(bankAccount.getUserId(), bankAccount.getAccountNumber())) {
                throw new RuntimeException("Bank account already exists for this user");
            }

            long accountCount = bankAccountRepository.countByUserId(bankAccount.getUserId());
            if (accountCount == 0) {
                bankAccount.setIsDefault(true);
            }

            BankAccount savedAccount = bankAccountRepository.save(bankAccount);
            logger.info("✅ Bank account saved successfully for user {}: {}", bankAccount.getUserId(), savedAccount.getAccountNumber());
            return savedAccount;
        } catch (Exception e) {
            logger.error("❌ Error saving bank account: {}", e.getMessage());
            throw new RuntimeException("Failed to save bank account: " + e.getMessage());
        }
    }

    public List<BankAccount> getBankAccountsByUserId(Long userId) {
        logger.info("Fetching bank accounts for user ID: {}", userId);
        return bankAccountRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<BankAccount> getDefaultBankAccount(Long userId) {
        return bankAccountRepository.findByUserIdAndIsDefaultTrue(userId);
    }

    public Optional<BankAccount> getBankAccountById(Long id, Long userId) {
        return bankAccountRepository.findByIdAndUserId(id, userId);
    }

    public void deleteBankAccount(Long id, Long userId) {
        Optional<BankAccount> accountOpt = bankAccountRepository.findByIdAndUserId(id, userId);
        if (accountOpt.isPresent()) {
            BankAccount account = accountOpt.get();
            
            // If deleting default account, set another account as default
            if (account.getIsDefault()) {
                List<BankAccount> otherAccounts = bankAccountRepository.findByUserIdOrderByCreatedAtDesc(userId);
                otherAccounts.remove(account);
                
                if (!otherAccounts.isEmpty()) {
                    BankAccount newDefault = otherAccounts.get(0);
                    newDefault.setIsDefault(true);
                    bankAccountRepository.save(newDefault);
                }
            }
            
            bankAccountRepository.delete(account);
            logger.info("✅ Bank account deleted: {}", account.getAccountNumber());
        } else {
            throw new RuntimeException("Bank account not found or access denied");
        }
    }

    public BankAccount setDefaultBankAccount(Long accountId, Long userId) {
        List<BankAccount> userAccounts = bankAccountRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (BankAccount account : userAccounts) {
            account.setIsDefault(false);
        }
        bankAccountRepository.saveAll(userAccounts);

        Optional<BankAccount> accountOpt = bankAccountRepository.findByIdAndUserId(accountId, userId);
        if (accountOpt.isPresent()) {
            BankAccount account = accountOpt.get();
            account.setIsDefault(true);
            BankAccount updatedAccount = bankAccountRepository.save(account);
            logger.info("✅ Default bank account set for user {}: {}", userId, account.getAccountNumber());
            return updatedAccount;
        }
        throw new RuntimeException("Bank account not found or access denied");
    }

    public boolean bankAccountExists(Long userId, String accountNumber) {
        return bankAccountRepository.existsByUserIdAndAccountNumber(userId, accountNumber);
    }

    public long getBankAccountCount(Long userId) {
        return bankAccountRepository.countByUserId(userId);
    }
}