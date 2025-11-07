package com.career.CareerBridge.service;

import com.career.CareerBridge.dto.PointsResponse;
import com.career.CareerBridge.dto.UserPointsDTO;
import com.career.CareerBridge.entity.PointsHistory;
import com.career.CareerBridge.entity.User;

import java.util.List;
import java.util.Map;

public interface PointsService {
    PointsResponse addPoints(Long userId, String activityType, String description);
    UserPointsDTO getUserPoints(Long userId);
    List<PointsHistory> getPointsHistory(Long userId, int limit);
    List<Object[]> getLeaderboard(int limit);
    List<Object[]> getLeaderboardManual(int limit);
    
    Integer calculatePoints(String activityType);
    String calculateRank(Integer points);
    Integer calculateLevel(Integer points);
    
    // New methods for withdrawal integration
    boolean deductPointsForWithdrawal(Long userId, Integer points, String description);
    boolean addPointsDirect(Long userId, Integer points, String description);
    double getCashValue(Integer points);
    Integer getPointsRequiredForAmount(double amount);
    Map<String, Object> getPointsOverview(Long userId);
    PointsResponse deductPoints(Long userId, Integer points, String description);
}