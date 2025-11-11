package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.CollegeActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CollegeActivityRepository extends JpaRepository<CollegeActivity, Long> {
    List<CollegeActivity> findByUserId(Long userId);
    List<CollegeActivity> findByEducationId(Long educationId);
    List<CollegeActivity> findByUserIdAndActivityContainingIgnoreCase(Long userId, String activity);
}