// components/Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages where we DON'T want navbar
  const noNavbarPaths = ['/adminCollegeDasboard','/adminCompanyDasboard','/adminPhage','/adminLogin'];
  
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};

export default Layout;