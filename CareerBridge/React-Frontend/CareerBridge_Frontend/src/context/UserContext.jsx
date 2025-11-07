// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);

  // Check if user is logged in on app start and fetch profile photo
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          console.log('✅ User loaded from localStorage:', userData.email);
          console.log('👤 User ID:', userData.id);
          
          // Fetch user's profile photo
          await fetchUserProfilePhoto(userData.id);
        } else {
          console.log('ℹ️ No user found in localStorage');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('❌ Error loading user from localStorage:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  // Fetch user profile photo from backend
  const fetchUserProfilePhoto = async (userId) => {
    try {
      console.log('🖼️ Fetching profile photo for user ID:', userId);
      const response = await api.get(`/personal/user/${userId}`);
      
      if (response.data.success && response.data.data) {
        const personalData = response.data.data;
        if (personalData.profilePhoto) {
          // Construct full URL if needed
          const photoUrl = personalData.profilePhoto.startsWith('http') 
            ? personalData.profilePhoto 
            : `${api.defaults.baseURL}${personalData.profilePhoto}`;
          
          setUserProfilePhoto(photoUrl);
          console.log('✅ Profile photo loaded:', photoUrl);
          
          // Also update currentUser with profile photo
          if (currentUser) {
            const updatedUser = { ...currentUser, profilePhoto: photoUrl };
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        } else {
          console.log('ℹ️ No profile photo found for user');
          setUserProfilePhoto(null);
        }
      }
    } catch (error) {
      console.log('❌ Error fetching profile photo:', error.message);
      setUserProfilePhoto(null);
    }
  };

  // Update user profile photo globally
  const updateUserProfilePhoto = (photoUrl) => {
    // Ensure the URL is complete
    const completePhotoUrl = photoUrl.startsWith('http') 
      ? photoUrl 
      : `${api.defaults.baseURL}${photoUrl}`;
    
    setUserProfilePhoto(completePhotoUrl);
    
    // Also update currentUser with the new profile photo
    if (currentUser) {
      const updatedUser = { ...currentUser, profilePhoto: completePhotoUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    console.log('✅ Profile photo updated globally:', completePhotoUrl);
  };

  // Update user profile data (including photo)
  const updateUserProfile = (updates) => {
    try {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // If profile photo is included in updates, update it
      if (updates.profilePhoto) {
        updateUserProfilePhoto(updates.profilePhoto);
      }
      
      console.log('✅ User profile updated:', updatedUser.email);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  };

  // Login function - Enhanced for new users
  const login = async (userData, token = null) => {
    try {
      console.log('🔐 Logging in user:', userData.email);
      console.log('🆔 User ID:', userData.id);
      
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      if (token) {
        localStorage.setItem('token', token);
      }

      // Fetch user's profile photo after login
      await fetchUserProfilePhoto(userData.id);

      console.log('✅ User logged in successfully:', userData.email);
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  };

  // Logout function - Enhanced cleanup
  const logout = () => {
    try {
      const userEmail = currentUser?.email;
      const userId = currentUser?.id;
      
      console.log('🚪 Logging out user:', userEmail);
      
      setCurrentUser(null);
      setUserProfilePhoto(null); // Clear profile photo
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      
      console.log('✅ User logged out successfully:', userEmail);
    } catch (error) {
      console.error('❌ Error during logout:', error);
      localStorage.clear();
    }
  };

  // Update user function
  const updateUser = (userData) => {
    try {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      console.log('✅ User updated:', updatedUser.email);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!localStorage.getItem('token');
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!currentUser) return 'Guest User';
    return `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email;
  };

  // Get user join date (approximate based on first login)
  const getJoinDate = () => {
    if (!currentUser) return "Recently";
    
    const joinDate = currentUser.joinDate || new Date().toISOString();
    return new Date(joinDate).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Get user profile photo
  const getUserProfilePhoto = () => {
    return userProfilePhoto;
  };

  // Refresh user profile data (including photo)
  const refreshUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      console.log('🔄 Refreshing user profile data...');
      await fetchUserProfilePhoto(currentUser.id);
      console.log('✅ User profile data refreshed');
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
    }
  };

  // Force refresh profile photo (for immediate updates)
  const forceRefreshProfilePhoto = async () => {
    if (!currentUser) return;
    
    try {
      console.log('🔄 Force refreshing profile photo...');
      await fetchUserProfilePhoto(currentUser.id);
      console.log('✅ Profile photo force refreshed');
    } catch (error) {
      console.error('❌ Error force refreshing profile photo:', error);
    }
  };

  const value = {
    currentUser,
    userProfilePhoto,
    login,
    logout,
    updateUser,
    updateUserProfile,
    updateUserProfilePhoto,
    refreshUserProfile,
    forceRefreshProfilePhoto,
    getUserProfilePhoto,
    loading,
    isAuthenticated,
    getUserDisplayName,
    getJoinDate
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;