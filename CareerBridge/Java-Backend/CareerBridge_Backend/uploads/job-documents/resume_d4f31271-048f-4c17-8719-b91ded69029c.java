package com.career.CareerBridge.service.impl;

import com.career.CareerBridge.dto.PointsResponse;
import com.career.CareerBridge.dto.PointsData;
import com.career.CareerBridge.dto.UserPointsDTO;
import com.career.CareerBridge.entity.PointsHistory;
import com.career.CareerBridge.entity.User;
import com.career.CareerBridge.repository.PointsHistoryRepository;
import com.career.CareerBridge.repository.UserRepository;
import com.career.CareerBridge.service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointsServiceImpl implements PointsService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PointsHistoryRepository pointsHistoryRepository;
    
    private static final double POINT_TO_RUPEE_RATE = 4.0; // 1 point = 4 Rs
    
    // Level configuration
    private final Map<Integer, Map<String, Object>> LEVEL_CONFIG = Map.of(
        0, Map.of("minPoints", 0, "rank", "Beginner", "color", "text-gray-600", "icon", "🌱"),
        1, Map.of("minPoints", 100, "rank", "Starter", "color", "text-cyan-600", "icon", "🌟"),
        2, Map.of("minPoints", 300, "rank", "Rookie", "color", "text-orange-600", "icon", "🔥"),
        3, Map.of("minPoints", 600, "rank", "Intermediate", "color", "text-green-600", "icon", "🚀"),
        4, Map.of("minPoints", 1000, "rank", "Advanced", "color", "text-blue-600", "icon", "⭐"),
        5, Map.of("minPoints", 1500, "rank", "Elite", "color", "text-purple-600", "icon", "👑")
    );

    @Override
    public PointsResponse addPoints(Long userId, String activityType, String description) {
        try {
            System.out.println("🎯 START: Adding points for User ID: " + userId + ", Activity: " + activityType);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        System.out.println("❌ User not found with ID: " + userId);
                        return new RuntimeException("User not found");
                    });
            
            Integer pointsEarned = calculatePoints(activityType);
            
            if (pointsEarned == 0) {
                System.out.println("❌ ERROR: Invalid activity type: " + activityType);
                return PointsResponse.error("Invalid activity type: " + activityType);
            }

            System.out.println("💰 Points to add: " + pointsEarned);

            // Add points to user
            userRepository.addPoints(userId, pointsEarned);
            
            // Get updated user
            User updatedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found after points update"));
            
            Integer currentPoints = updatedUser.getPoints();
            Integer newLevel = calculateLevel(currentPoints);
            String rank = calculateRank(currentPoints);

            System.out.println("📈 Points updated: " + currentPoints + " points, Level: " + newLevel + ", Rank: " + rank);

            // Create points history record
            PointsHistory pointsHistory = new PointsHistory();
            pointsHistory.setUser(updatedUser);
            pointsHistory.setPoints(pointsEarned);
            pointsHistory.setTransactionType(activityType);
            pointsHistory.setDescription(description);
            PointsHistory savedHistory = pointsHistoryRepository.save(pointsHistory);
            
            System.out.println("✅ Points history recorded. ID: " + savedHistory.getId());

            PointsData pointsData = new PointsData(
                currentPoints, 
                pointsEarned, 
                newLevel, 
                rank
            );

            System.out.println("🎉 SUCCESS: Points added! User: " + userId + 
                             ", Total: " + currentPoints + 
                             ", Earned: " + pointsEarned + 
                             ", Rank: " + rank);

            return PointsResponse.success("Earned " + pointsEarned + " points!", pointsData);

        } catch (Exception e) {
            System.err.println("💥 ERROR adding points for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return PointsResponse.error("Failed to add points: " + e.getMessage());
        }
    }

    @Override
    public PointsResponse deductPoints(Long userId, Integer points, String description) {
        try {
            System.out.println("💰 START: Deducting points for User ID: " + userId + ", Points: " + points);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        System.out.println("❌ User not found with ID: " + userId);
                        return new RuntimeException("User not found");
                    });
            
            if (user.getPoints() < points) {
                System.out.println("❌ ERROR: Insufficient points. Available: " + user.getPoints() + ", Required: " + points);
                return PointsResponse.error("Insufficient points. Available: " + user.getPoints() + ", Required: " + points);
            }

            // Deduct points from user
            int updated = userRepository.deductPoints(userId, points);
            if (updated == 0) {
                System.out.println("❌ ERROR: Failed to deduct points for user: " + userId);
                return PointsResponse.error("Failed to deduct points");
            }
            
            // Get updated user
            User updatedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found after points deduction"));
            
            Integer currentPoints = updatedUser.getPoints();
            Integer newLevel = calculateLevel(currentPoints);
            String rank = calculateRank(currentPoints);

            System.out.println("📉 Points deducted: " + points + ", Remaining: " + currentPoints + ", Level: " + newLevel);

            // Create points history record for deduction
            PointsHistory pointsHistory = new PointsHistory();
            pointsHistory.setUser(updatedUser);
            pointsHistory.setPoints(-points); // Negative for deduction
            pointsHistory.setTransactionType("WITHDRAWAL");
            pointsHistory.setDescription(description);
            PointsHistory savedHistory = pointsHistoryRepository.save(pointsHistory);
            
            System.out.println("✅ Points deduction history recorded. ID: " + savedHistory.getId());

            PointsData pointsData = new PointsData(
                currentPoints, 
                -points, 
                newLevel, 
                rank
            );

            System.out.println("✅ SUCCESS: Points deducted! User: " + userId + 
                             ", Remaining: " + currentPoints + 
                             ", Deducted: " + points);

            return PointsResponse.success("Deducted " + points + " points for withdrawal", pointsData);

        } catch (Exception e) {
            System.err.println("💥 ERROR deducting points for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return PointsResponse.error("Failed to deduct points: " + e.getMessage());
        }
    }

    @Override
    public UserPointsDTO getUserPoints(Long userId) {
        try {
            System.out.println("📊 Getting points for User ID: " + userId);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Integer totalPoints = user.getPoints();
            String rank = calculateRank(totalPoints);
            Integer level = calculateLevel(totalPoints);
            
            System.out.println("✅ Found points: " + totalPoints + 
                             ", Level: " + level + 
                             ", Rank: " + rank);
            
            return new UserPointsDTO(
                totalPoints,
                level,
                rank,
                user.getUpdatedAt() != null ? user.getUpdatedAt() : LocalDateTime.now()
            );
            
        } catch (Exception e) {
            System.err.println("💥 ERROR getting user points for " + userId + ": " + e.getMessage());
            return new UserPointsDTO(0, 1, "Beginner", LocalDateTime.now());
        }
    }

    @Override
    public List<PointsHistory> getPointsHistory(Long userId, int limit) {
        try {
            System.out.println("📜 Getting points history for User ID: " + userId + ", Limit: " + limit);
            
            List<PointsHistory> history = pointsHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
            
            if (limit > 0 && history.size() > limit) {
                history = history.subList(0, limit);
            }
            
            System.out.println("✅ Found " + history.size() + " history records for user " + userId);
            return history;
            
        } catch (Exception e) {
            System.err.println("💥 ERROR getting points history for user " + userId + ": " + e.getMessage());
            return List.of();
        }
    }

    @Override
    public List<Object[]> getLeaderboard(int limit) {
        try {
            System.out.println("🏆 Getting leaderboard with limit: " + limit);
            
            // Use manual method since we don't have UserPoints entity
            return getLeaderboardManual(limit);
            
        } catch (Exception e) {
            System.err.println("💥 ERROR getting leaderboard: " + e.getMessage());
            return getLeaderboardManual(limit);
        }
    }

    @Override
    public List<Object[]> getLeaderboardManual(int limit) {
        try {
            System.out.println("🏆 Getting leaderboard with manual limit: " + limit);
            
            // Get all users and apply limit manually
            List<User> allUsers = userRepository.findAll();
            
            // Sort by points descending and apply limit
            List<User> topUsers = allUsers.stream()
                .sorted((u1, u2) -> u2.getPoints().compareTo(u1.getPoints()))
                .filter(user -> user.getPoints() > 0) // Only users with points
                .limit(limit > 0 ? limit : 10)
                .collect(Collectors.toList());
            
            List<Object[]> leaderboard = topUsers.stream()
                .map(user -> new Object[]{
                    user.getId(),
                    user.getFirstName() + " " + user.getLastName(),
                    user.getEmail(),
                    user.getPoints(),
                    calculateLevel(user.getPoints()),
                    calculateRank(user.getPoints()),
                    user.getUpdatedAt()
                })
                .collect(Collectors.toList());
            
            System.out.println("✅ Leaderboard generated manually with " + leaderboard.size() + " users");
            return leaderboard;
            
        } catch (Exception e) {
            System.err.println("💥 ERROR getting leaderboard manually: " + e.getMessage());
            return List.of();
        }
    }

    @Override
    public Integer calculatePoints(String activityType) {
        System.out.println("🎯 Calculating points for activity: " + activityType);
        
        // Only personal, education, and job forms give 10 points each for both first-time and updates
        switch (activityType.toLowerCase()) {
            case "personal_form":
                return 10;
            case "education_form":
                return 10;
            case "job_form":
                return 10;
            case "personal_update":
                return 10;
            case "education_update":
                return 10;
            case "job_update":
                return 10;
            default:
                System.out.println("⚠️ Unknown activity type: " + activityType);
                return 0;
        }
    }

    @Override
    public String calculateRank(Integer points) {
        if (points >= 1000) return "Elite";
        if (points >= 500) return "Advanced";
        if (points >= 200) return "Intermediate";
        if (points >= 50) return "Rookie";
        if (points >= 10) return "Starter";
        return "Beginner";
    }

    @Override
    public Integer calculateLevel(Integer points) {
        if (points >= 1000) return 5;
        if (points >= 500) return 4;
        if (points >= 200) return 3;
        if (points >= 50) return 2;
        if (points >= 10) return 1;
        return 1;
    }
    
    // New methods for withdrawal integration
    
    @Override
    public boolean deductPointsForWithdrawal(Long userId, Integer points, String description) {
        PointsResponse response = deductPoints(userId, points, description);
        return response.isSuccess();
    }
    
    @Override
    public boolean addPointsDirect(Long userId, Integer points, String description) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            userRepository.addPoints(userId, points);
            
            // Create points history record
            PointsHistory pointsHistory = new PointsHistory();
            pointsHistory.setUser(user);
            pointsHistory.setPoints(points);
            pointsHistory.setTransactionType("DIRECT_ADD");
            pointsHistory.setDescription(description);
            pointsHistoryRepository.save(pointsHistory);
            
            System.out.println("✅ Points added directly - User: " + user.getEmail() + 
                             ", Points: +" + points);
            
            return true;
            
        } catch (Exception e) {
            System.err.println("❌ Error adding points directly: " + e.getMessage());
            return false;
        }
    }
    
    @Override
    public double getCashValue(Integer points) {
        return points * POINT_TO_RUPEE_RATE;
    }
    
    @Override
    public Integer getPointsRequiredForAmount(double amount) {
        return (int) Math.ceil(amount / POINT_TO_RUPEE_RATE);
    }
    
    @Override
    public Map<String, Object> getPointsOverview(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Integer totalPoints = user.getPoints();
            String rank = calculateRank(totalPoints);
            Integer level = calculateLevel(totalPoints);
            Map<String, Object> levelConfig = LEVEL_CONFIG.get(level);
            
            // Calculate progress to next level
            Integer nextLevelPoints = level < LEVEL_CONFIG.size() - 1 ? 
                (Integer) LEVEL_CONFIG.get(level + 1).get("minPoints") : totalPoints;
            Integer currentLevelPoints = (Integer) levelConfig.get("minPoints");
            double progress = level < LEVEL_CONFIG.size() - 1 ? 
                ((double) (totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100 : 100;
            
            Map<String, Object> overview = new HashMap<>();
            overview.put("totalPoints", totalPoints);
            overview.put("rank", rank);
            overview.put("level", level);
            overview.put("levelColor", levelConfig.get("color"));
            overview.put("levelIcon", levelConfig.get("icon"));
            overview.put("cashValue", getCashValue(totalPoints));
            overview.put("progressToNextLevel", Math.min(100, Math.max(0, progress)));
            overview.put("nextLevel", level < LEVEL_CONFIG.size() - 1 ? LEVEL_CONFIG.get(level + 1).get("rank") : "Max");
            overview.put("pointsToNextLevel", level < LEVEL_CONFIG.size() - 1 ? nextLevelPoints - totalPoints : 0);
            overview.put("pointToRupeeRate", POINT_TO_RUPEE_RATE);
            
            // Activity breakdown (simplified)
            Map<String, Integer> activityBreakdown = new HashMap<>();
            activityBreakdown.put("formsCompleted", Math.max(0, totalPoints / 10));
            activityBreakdown.put("referrals", Math.max(0, totalPoints / 25));
            overview.put("activityBreakdown", activityBreakdown);
            
            System.out.println("✅ Points overview generated for user: " + user.getEmail());
            return overview;
            
        } catch (Exception e) {
            System.err.println("❌ Error generating points overview: " + e.getMessage());
            return Collections.emptyMap();
        }
    }
}