package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.JobDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobDetailsRepository extends JpaRepository<JobDetails, Integer> {
    
    List<JobDetails> findAllByUserId(Long userId);
    
    Optional<JobDetails> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<JobDetails> findByUserIdAndCompanyNameAndRole(Long userId, String companyName, String role);
    
    boolean existsByUserId(Long userId);
    
    // Find by company name (for dashboard)
    List<JobDetails> findByCompanyNameContainingIgnoreCase(String companyName);
    
    // Get all unique company names
    @Query("SELECT DISTINCT j.companyName FROM JobDetails j WHERE j.companyName IS NOT NULL")
    List<String> findDistinctCompanyNames();
    
    @Query("SELECT j.companyName, COUNT(j) FROM JobDetails j WHERE j.companyName IS NOT NULL GROUP BY j.companyName")
    List<Object[]> findCompanyNamesWithCounts();

    // Find by multiple company names
    List<JobDetails> findByCompanyNameIn(List<String> companyNames);
    
    @Query("SELECT DISTINCT j.companyName FROM JobDetails j WHERE j.companyName IS NOT NULL")
    List<String> findAllUniqueCompanies();
    
    List<JobDetails> findByCompanyName(String companyName);
    
    @Query("SELECT COUNT(j) FROM JobDetails j WHERE j.currentlyWorking = true")
    Long countCurrentlyWorking();
    
    @Query("SELECT j.industry, COUNT(j) FROM JobDetails j WHERE j.industry IS NOT NULL GROUP BY j.industry")
    List<Object[]> getIndustryDistribution();
    
    @Query("SELECT j.role, COUNT(j) FROM JobDetails j WHERE j.role IS NOT NULL GROUP BY j.role")
    List<Object[]> getRoleDistribution();
    
    @Query("SELECT AVG(j.experience) FROM JobDetails j WHERE j.experience IS NOT NULL")
    Double getAverageExperience();
    
    @Query("SELECT j FROM JobDetails j WHERE j.userId = :userId")
    List<JobDetails> findByUserId(@Param("userId") Long userId);
}