// AdminContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on component mount
    const checkAdminAuth = () => {
      try {
        const adminData = localStorage.getItem('adminData');
        const adminToken = localStorage.getItem('adminToken');
        
        if (adminData && adminToken) {
          setAdmin(JSON.parse(adminData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking admin authentication:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const login = (adminData) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('adminToken', 'admin-authenticated');
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};