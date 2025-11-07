// src/context/PointsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [points, setPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);

  // Load points data when user changes
  useEffect(() => {
    if (currentUser) {
      loadPointsData();
      checkIfNewUser();
    } else {
      // Reset when user logs out
      setPoints(0);
      setPointsHistory([]);
      setIsNewUser(false);
    }
  }, [currentUser]);

  const loadPointsData = () => {
    if (!currentUser) return;
    
    const userId = currentUser.id.toString();
    const userPointsKey = `userPoints_${userId}`;
    const userHistoryKey = `pointsHistory_${userId}`;
    
    try {
      // Load points
      const storedPoints = localStorage.getItem(userPointsKey);
      if (storedPoints !== null) {
        setPoints(parseInt(storedPoints) || 0);
      } else {
        // Initialize if not exists
        setPoints(0);
        localStorage.setItem(userPointsKey, '0');
      }

      // Load history
      const storedHistory = localStorage.getItem(userHistoryKey);
      if (storedHistory) {
        setPointsHistory(JSON.parse(storedHistory));
      } else {
        setPointsHistory([]);
        localStorage.setItem(userHistoryKey, JSON.stringify([]));
      }
      
      console.log('📊 Points data loaded:', { 
        points: storedPoints, 
        historyCount: JSON.parse(storedHistory || '[]').length 
      });
    } catch (error) {
      console.error('❌ Error loading points data:', error);
      // Initialize with defaults on error
      setPoints(0);
      setPointsHistory([]);
    }
  };

  const checkIfNewUser = () => {
    if (!currentUser) return;
    
    const userId = currentUser.id.toString();
    const userPointsKey = `userPoints_${userId}`;
    
    // Check if this is a new user (no points data or 0 points with no history)
    const storedPoints = localStorage.getItem(userPointsKey);
    const isNew = storedPoints === null || (parseInt(storedPoints) === 0 && pointsHistory.length === 0);
    
    setIsNewUser(isNew);
    console.log('👤 User status:', isNew ? 'New User' : 'Existing User');
  };

  const addPoints = (pointsToAdd, reason = 'Activity completed') => {
    if (!currentUser || pointsToAdd <= 0) return false;

    try {
      const userId = currentUser.id.toString();
      const userPointsKey = `userPoints_${userId}`;
      const userHistoryKey = `pointsHistory_${userId}`;
      
      // Calculate new points total
      const currentPoints = parseInt(localStorage.getItem(userPointsKey) || '0');
      const newPoints = currentPoints + pointsToAdd;
      
      // Update points
      setPoints(newPoints);
      localStorage.setItem(userPointsKey, newPoints.toString());
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        points: pointsToAdd,
        reason: reason,
        time: new Date().toLocaleString(),
        totalPoints: newPoints,
        description: `+${pointsToAdd} points: ${reason}`
      };
      
      const updatedHistory = [newHistoryItem, ...pointsHistory.slice(0, 49)]; // Keep last 50 items
      setPointsHistory(updatedHistory);
      localStorage.setItem(userHistoryKey, JSON.stringify(updatedHistory));
      
      console.log(`✅ Added ${pointsToAdd} points for: ${reason}`);
      console.log(`💰 Total points: ${newPoints}`);
      
      // ✅ FIXED: Dispatch custom event for notifications
      const pointsEvent = new CustomEvent('pointsEarned', {
        detail: {
          points: pointsToAdd,
          reason: reason,
          message: `+${pointsToAdd} points: ${reason}`
        }
      });
      window.dispatchEvent(pointsEvent);
      
      // Update new user status after first points are added
      if (isNewUser) {
        setIsNewUser(false);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error adding points:', error);
      return false;
    }
  };

  // ✅ ADD THIS FUNCTION - deductPoints for withdrawals
  const deductPoints = (pointsToDeduct, reason = 'Points deduction') => {
    if (!currentUser || pointsToDeduct <= 0 || pointsToDeduct > points) {
      console.log('❌ Cannot deduct points:', { currentUser, pointsToDeduct, points });
      return false;
    }

    try {
      const userId = currentUser.id.toString();
      const userPointsKey = `userPoints_${userId}`;
      const userHistoryKey = `pointsHistory_${userId}`;
      
      // Calculate new points total
      const currentPoints = parseInt(localStorage.getItem(userPointsKey) || '0');
      const newPoints = currentPoints - pointsToDeduct;
      
      // Update points
      setPoints(newPoints);
      localStorage.setItem(userPointsKey, newPoints.toString());
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        points: -pointsToDeduct,
        reason: reason,
        time: new Date().toLocaleString(),
        totalPoints: newPoints,
        description: `-${pointsToDeduct} points: ${reason}`
      };
      
      const updatedHistory = [newHistoryItem, ...pointsHistory.slice(0, 49)];
      setPointsHistory(updatedHistory);
      localStorage.setItem(userHistoryKey, JSON.stringify(updatedHistory));
      
      console.log(`✅ Deducted ${pointsToDeduct} points for: ${reason}`);
      console.log(`💰 Remaining points: ${newPoints}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error deducting points:', error);
      return false;
    }
  };

  const refreshPoints = () => {
    loadPointsData();
  };

  const getPointsLevel = () => {
    let level = 0;
    let rank = "Beginner";
    let color = "from-gray-500 to-gray-700";
    let icon = "🌱";

    if (points >= 1000) {
      level = 5;
      rank = "Elite";
      color = "from-purple-600 to-indigo-700";
      icon = "👑";
    } else if (points >= 500) {
      level = 4;
      rank = "Advanced";
      color = "from-blue-500 to-cyan-600";
      icon = "⭐";
    } else if (points >= 200) {
      level = 3;
      rank = "Intermediate";
      color = "from-green-500 to-emerald-600";
      icon = "🚀";
    } else if (points >= 50) {
      level = 2;
      rank = "Rookie";
      color = "from-yellow-500 to-orange-500";
      icon = "🔥";
    } else if (points >= 10) {
      level = 1;
      rank = "Starter";
      color = "from-blue-400 to-teal-500";
      icon = "🌟";
    } else {
      level = 0;
      rank = "Beginner";
      color = "from-gray-500 to-gray-700";
      icon = "🌱";
    }

    return { level, rank, color, icon };
  };

  const getRecentActivity = (limit = 5) => {
    return pointsHistory.slice(0, limit);
  };

  const getTotalPointsEarned = () => {
    return pointsHistory.reduce((total, activity) => total + activity.points, 0);
  };

  const value = {
    points,
    pointsHistory,
    isNewUser,
    addPoints,
    deductPoints, // ✅ ADD THIS TO THE CONTEXT VALUE
    refreshPoints,
    getPointsLevel,
    getRecentActivity,
    getTotalPointsEarned
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};

export default PointsContext;