import { useAuth } from '../context/AuthContext';

export const usePoints = () => {
  const { addPoints } = useAuth();

  const awardPoints = (formType) => {
    const pointsMap = {
      personal: 100,
      education: 150,
      job: 200
    };

    const points = pointsMap[formType] || 0;
    
    // Add points with animation trigger
    addPoints(points, formType);
    
    // Return points for immediate feedback
    return points;
  };

  return { awardPoints };
};