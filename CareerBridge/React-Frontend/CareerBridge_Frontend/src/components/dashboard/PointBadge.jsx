import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCoins } from 'react-icons/fa';

const PointsBadge = () => {
  const { user } = useAuth();
  const [animate, setAnimate] = useState(false);
  const [displayPoints, setDisplayPoints] = useState(user.points);

  useEffect(() => {
    const handlePointsEarned = () => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
    };

    window.addEventListener('pointsEarned', handlePointsEarned);
    return () => window.removeEventListener('pointsEarned', handlePointsEarned);
  }, []);

  // Animate points counter
  useEffect(() => {
    if (displayPoints !== user.points) {
      const timer = setTimeout(() => {
        setDisplayPoints(prev => {
          const diff = user.points - prev;
          return prev + Math.ceil(diff / 10);
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayPoints, user.points]);

  return (
    <div className={`fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 transform transition-all duration-500 ${
      animate ? 'scale-110 -translate-y-2' : 'scale-100'
    }`}>
      <FaCoins className="text-yellow-300 text-xl" />
      <div>
        <div className="text-sm font-semibold opacity-90">Total Points</div>
        <div className="text-xl font-bold">{displayPoints}</div>
      </div>
      
      {/* Completion indicator */}
      <div className="flex space-x-1 ml-2">
        {['personal', 'education', 'job'].map((form) => (
          <div
            key={form}
            className={`w-2 h-2 rounded-full ${
              user.completedForms[form] ? 'bg-green-400' : 'bg-white opacity-30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PointsBadge;