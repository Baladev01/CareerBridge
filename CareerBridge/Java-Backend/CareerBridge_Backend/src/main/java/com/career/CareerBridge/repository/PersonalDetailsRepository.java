package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.PersonalDetails;

import jakarta.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Integer> {
    
    // Find the latest personal details by user ID
    Optional<PersonalDetails> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find all personal details by user ID
    List<PersonalDetails> findAllByUserId(Long userId);
    
    // Find by user ID, name, and email combination
    Optional<PersonalDetails> findByUserIdAndNameAndEmail(Long userId, String name, String email);
    
    // Check if personal details exist for user ID
    boolean existsByUserId(Long userId);
    
    // Find by user ID only
    Optional<PersonalDetails> findByUserId(Long userId);
    
    // Custom query to find profile with specific criteria
    @Query("SELECT p FROM PersonalDetails p WHERE p.userId = :userId AND p.name = :name AND p.email = :email")
    Optional<PersonalDetails> findPersonalDetails(@Param("userId") Long userId, 
                                                  @Param("name") String name, 
                                                  @Param("email") String email);
    
    // Count personal details by user ID
    long countByUserId(Long userId);
}