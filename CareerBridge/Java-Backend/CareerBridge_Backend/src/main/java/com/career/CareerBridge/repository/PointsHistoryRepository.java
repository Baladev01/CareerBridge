package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.PointsHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointsHistoryRepository extends JpaRepository<PointsHistory, Long> {
    
    List<PointsHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT ph FROM PointsHistory ph WHERE ph.userId = :userId ORDER BY ph.createdAt DESC")
    List<PointsHistory> findRecentByUserId(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT COUNT(ph) FROM PointsHistory ph WHERE ph.userId = :userId AND ph.activityType = :activityType")
    Long countByUserIdAndActivityType(@Param("userId") Long userId, @Param("activityType") String activityType);
    
    @Query("SELECT ph FROM PointsHistory ph WHERE ph.userId = :userId AND DATE(ph.createdAt) = CURRENT_DATE")
    List<PointsHistory> findTodayPointsHistory(@Param("userId") Long userId);
    
    // ✅ NEW: Check if activity was performed recently
    @Query("SELECT ph FROM PointsHistory ph WHERE ph.userId = :userId AND ph.activityType = :activityType ORDER BY ph.createdAt DESC")
    List<PointsHistory> findRecentByUserIdAndActivityType(@Param("userId") Long userId, @Param("activityType") String activityType, org.springframework.data.domain.Pageable pageable);
}