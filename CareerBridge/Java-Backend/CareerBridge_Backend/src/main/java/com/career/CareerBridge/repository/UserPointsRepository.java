package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.UserPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {
    
    Optional<UserPoints> findByUserId(Long userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE UserPoints up SET up.points = up.points + :points, up.level = :level, up.lastUpdated = CURRENT_TIMESTAMP WHERE up.userId = :userId")
    int updateUserPoints(@Param("userId") Long userId, @Param("points") Integer points, @Param("level") Integer level);
    
    @Query("SELECT up FROM UserPoints up WHERE up.userId = :userId")
    Optional<UserPoints> findUserPointsByUserId(@Param("userId") Long userId);
    
    // ✅ WORKING: Use Pageable for pagination (BEST APPROACH)
    @Query("SELECT up FROM UserPoints up ORDER BY up.points DESC, up.lastUpdated DESC")
    List<UserPoints> findTopUsers(org.springframework.data.domain.Pageable pageable);
    
    // ✅ WORKING: Simple native query without parameters (use this)
    @Query(value = "SELECT * FROM user_points ORDER BY points DESC, last_updated DESC LIMIT 10", nativeQuery = true)
    List<UserPoints> findTop10Users();
    
    // ✅ WORKING: For dynamic limit, use this approach
    @Query(value = "SELECT * FROM user_points ORDER BY points DESC, last_updated DESC", nativeQuery = true)
    List<UserPoints> findAllUsersNative();
    
    @Query("SELECT up FROM UserPoints up ORDER BY up.points DESC, up.lastUpdated DESC")
    List<UserPoints> findAllOrderByPointsDesc();
    
    // Get user's rank position
    @Query(value = "SELECT COUNT(*) + 1 FROM user_points up2 WHERE up2.points > (SELECT up1.points FROM user_points up1 WHERE up1.user_id = :userId)", nativeQuery = true)
    Integer findUserRank(@Param("userId") Long userId);
    
    // Check if user points record exists
    boolean existsByUserId(Long userId);
}