package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.EducationDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EducationDetailsRepository extends JpaRepository<EducationDetails, Integer> {
    
    // Find first education record for a user (most recent)
    Optional<EducationDetails> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find all education records for a user
    List<EducationDetails> findAllByUserId(Long userId);
    
    // Find specific education record by user, degree and college
    Optional<EducationDetails> findByUserIdAndDegreeAndCollegeName(Long userId, String degree, String collegeName);
    
    // Check if education record exists for user
    boolean existsByUserId(Long userId);
    
    // Find by college name (for dashboard)
    List<EducationDetails> findByCollegeNameContainingIgnoreCase(String collegeName);
    
    // Get all unique college names
    @Query("SELECT DISTINCT e.collegeName FROM EducationDetails e WHERE e.collegeName IS NOT NULL")
    List<String> findDistinctCollegeNames();
    
    @Query("SELECT e.collegeName, COUNT(e) FROM EducationDetails e WHERE e.collegeName IS NOT NULL GROUP BY e.collegeName")
    List<Object[]> findCollegeNamesWithCounts();
    
    // Find by multiple college names
    List<EducationDetails> findByCollegeNameIn(List<String> collegeNames);
    
    @Query("SELECT DISTINCT e.collegeName FROM EducationDetails e WHERE e.collegeName IS NOT NULL")
    List<String> findAllUniqueColleges();

    List<EducationDetails> findByCollegeName(String collegeName);

    @Query("SELECT COUNT(e) FROM EducationDetails e WHERE e.currentlyStudying = true")
    Long countCurrentlyStudying();

    @Query("SELECT e.degree, COUNT(e) FROM EducationDetails e WHERE e.degree IS NOT NULL GROUP BY e.degree")
    List<Object[]> getDegreeDistribution();

    @Query("SELECT AVG(e.cgpa) FROM EducationDetails e WHERE e.cgpa IS NOT NULL")
    Double getAverageCGPA();
}