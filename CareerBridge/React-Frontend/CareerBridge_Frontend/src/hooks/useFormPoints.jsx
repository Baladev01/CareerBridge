// src/hooks/useFormPoints.js
import { usePoints } from '../context/PointsContext';
import { FORM_POINTS } from '../config/pointsConfig';

export const useFormPoints = () => {
  const { addPoints } = usePoints();

  const awardFormPoints = (formType, customMessage = null) => {
    const formConfig = FORM_POINTS[formType];
    
    if (!formConfig) {
      console.warn(`❌ No points configuration found for form type: ${formType}`);
      return false;
    }

    const success = addPoints(formConfig.points, formConfig.reason);
    
    if (success) {
      // Trigger custom event for navbar notifications
      window.dispatchEvent(new CustomEvent('pointsEarned', {
        detail: {
          points: formConfig.points,
          reason: formConfig.reason,
          message: customMessage || formConfig.message,
          formType: formType
        }
      }));
      
      console.log(`✅ Points awarded: +${formConfig.points} for ${formType}`);
      return true;
    }
    
    return false;
  };

  const awardCompletionBonus = () => {
    const completionConfig = FORM_POINTS.complete_profile;
    const success = addPoints(completionConfig.points, completionConfig.reason);
    
    if (success) {
      window.dispatchEvent(new CustomEvent('pointsEarned', {
        detail: {
          points: completionConfig.points,
          reason: completionConfig.reason,
          message: completionConfig.message,
          formType: 'complete_profile'
        }
      }));
      
      console.log(`🎉 Completion bonus awarded: +${completionConfig.points}`);
      return true;
    }
    
    return false;
  };

  return {
    awardFormPoints,
    awardCompletionBonus,
    FORM_POINTS
  };
};