package com.career.CareerBridge.service.impl;

import com.career.CareerBridge.dto.PointsResponse;
import com.career.CareerBridge.dto.PointsData;
import com.career.CareerBridge.dto.UserPointsDTO;
import com.career.CareerBridge.entity.UserPoints;
import com.career.CareerBridge.entity.PointsHistory;
import com.career.CareerBridge.repository.UserPointsRepository;
import com.career.CareerBridge.repository.PointsHistoryRepository;
import com.career.CareerBridge.service.PointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointsServiceImpl implements PointsService {

    @Autowired
    private UserPointsRepository userPointsRepository;

    @Autowired
    private PointsHistoryRepository pointsHistoryRepository;

    @Override
    public PointsResponse addPoints(Long userId, String activityType, String description) {
        try {
            System.out.println("🎯 START: Adding points for User ID: " + userId + ", Activity: " + activityType);
            
            Integer pointsEarned = calculatePoints(activityType);
            
            if (pointsEarned == 0) {
                System.out.println("❌ ERROR: Invalid activity type: " + activityType);
                return PointsResponse.error("Invalid activity type: " + activityType);
            }

            System.out.println("💰 Points to add: " + pointsEarned);

            Optional<UserPoints> userPointsOpt = userPointsRepository.findByUserId(userId);
            UserPoints userPoints;
            
            if (userPointsOpt.isPresent()) {
                userPoints = userPointsOpt.get();
                Integer currentPoints = userPoints.getPoints();
                Integer newPoints = currentPoints + pointsEarned;
                Integer newLevel = calculateLevel(newPoints);
                
                System.out.println("📈 Updating existing points: " + currentPoints + " + " + pointsEarned + " = " + newPoints);
                
                userPoints.setPoints(newPoints);
                userPoints.setLevel(newLevel);
                userPoints.setLastUpdated(LocalDateTime.now());
            } else {
                Integer newLevel = calculateLevel(pointsEarned);
                userPoints = new UserPoints();
                userPoints.setUserId(userId);
                userPoints.setPoints(pointsEarned);
                userPoints.setLevel(newLevel);
                userPoints.setLastUpdated(LocalDateTime.now());
                
                System.out.println("🆕 Creating new points record with: " + pointsEarned + " points");
            }

            UserPoints savedUserPoints = userPointsRepository.save(userPoints);
            System.out.println("✅ User points saved successfully. ID: " + savedUserPoints.getId() + ", Total points: " + savedUserPoints.getPoints());

            PointsHistory pointsHistory = new PointsHistory();
            pointsHistory.setUserId(userId);
            pointsHistory.setPointsEarned(pointsEarned);
            pointsHistory.setActivityType(activityType);
            pointsHistory.setDescription(description);
            pointsHistory.setCreatedAt(LocalDateTime.now());
            
            PointsHistory savedHistory = pointsHistoryRepository.save(pointsHistory);
            System.out.println("✅ Points history recorded. ID: " + savedHistory.getId());

            String rank = calculateRank(savedUserPoints.getPoints());
            PointsData pointsData = new PointsData(
                savedUserPoints.getPoints(), 
                pointsEarned, 
                savedUserPoints.getLevel(), 
                rank
            );

            System.out.println("🎉 SUCCESS: Points added! User: " + userId + 
                             ", Total: " + savedUserPoints.getPoints() + 
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
    public UserPointsDTO getUserPoints(Long userId) {
        try {
            System.out.println("📊 Getting points for User ID: " + userId);
            
            Optional<UserPoints> userPointsOpt = userPointsRepository.findByUserId(userId);
            
            if (userPointsOpt.isPresent()) {
                UserPoints userPoints = userPointsOpt.get();
                String rank = calculateRank(userPoints.getPoints());
                
                System.out.println("✅ Found points: " + userPoints.getPoints() + 
                                 ", Level: " + userPoints.getLevel() + 
                                 ", Rank: " + rank);
                
                return new UserPointsDTO(
                    userPoints.getPoints(),
                    userPoints.getLevel(),
                    rank,
                    userPoints.getLastUpdated()
                );
            } else {
                System.out.println("ℹ️ No points record found for user " + userId + ", returning defaults");
                return new UserPointsDTO(0, 1, "Beginner", LocalDateTime.now());
            }
        } catch (Exception e) {
            System.err.println("💥 ERROR getting user points for " + userId + ": " + e.getMessage());
            return new UserPointsDTO(0, 1, "Beginner", LocalDateTime.now());
        }
    }

    @Override
    public List<PointsHistory> getPointsHistory(Long userId, int limit) {
        try {
            System.out.println("📜 Getting points history for User ID: " + userId + ", Limit: " + limit);
            
            Pageable pageable = PageRequest.of(0, limit);
            List<PointsHistory> history = pointsHistoryRepository.findRecentByUserId(userId, pageable);
            
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
            
            // Use Pageable approach (RECOMMENDED)
            Pageable pageable = PageRequest.of(0, limit);
            List<UserPoints> topUsers = userPointsRepository.findTopUsers(pageable);
            
            List<Object[]> leaderboard = topUsers.stream()
                .map(up -> new Object[]{
                    up.getUserId(),
                    up.getPoints(),
                    up.getLevel(),
                    calculateRank(up.getPoints()),
                    up.getLastUpdated()
                })
                .collect(Collectors.toList());
            
            System.out.println("✅ Leaderboard generated with " + leaderboard.size() + " users");
            return leaderboard;
        } catch (Exception e) {
            System.err.println("💥 ERROR getting leaderboard with Pageable: " + e.getMessage());
            
            // Fallback to manual method
            return getLeaderboardManual(limit);
        }
    }

    @Override
    public List<Object[]> getLeaderboardManual(int limit) {
        try {
            System.out.println("🏆 Getting leaderboard with manual limit: " + limit);
            
            // Get all users and apply limit manually
            List<UserPoints> allUsers = userPointsRepository.findAllOrderByPointsDesc();
            
            // Apply limit
            List<UserPoints> topUsers = allUsers.stream()
                .limit(limit)
                .collect(Collectors.toList());
            
            List<Object[]> leaderboard = topUsers.stream()
                .map(up -> new Object[]{
                    up.getUserId(),
                    up.getPoints(),
                    up.getLevel(),
                    calculateRank(up.getPoints()),
                    up.getLastUpdated()
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

	@Override
	public boolean deductPointsForWithdrawal(Long userId, Integer points, String description) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean addPointsDirect(Long userId, Integer points, String description) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public double getCashValue(Integer points) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Integer getPointsRequiredForAmount(double amount) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> getPointsOverview(Long userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public PointsResponse deductPoints(Long userId, Integer points, String description) {
		// TODO Auto-generated method stub
		return null;
	}
}