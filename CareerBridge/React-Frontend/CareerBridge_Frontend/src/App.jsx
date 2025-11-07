// App.js - Updated version
import './index.css';
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import About from './components/About';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import SignupForm from './components/SignupForm';
import DashboardPage from './components/dashboard/FormCard';
import PointPage from './components/PointPage';
import LoginForm from './components/LoginForm';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { PointsProvider } from './context/PointsContext';
import { UserProvider } from './context/UserContext';
import EducationDetailsForm from './components/forms/EducationDetailsForm';
import JobDetailsForm from './components/forms/JobDetailsForm';
import PersonalDetailsForm from './components/forms/PersonalDetailsForm';
import MyProfile from './pages/MyProfile';
import Layout from './components/Layout';
import HelpSupportPage from './pages/HelpSupportPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegister from './components/admin/AdminRegister';
import AdminLogin from './components/admin/AdminLogin';
import CollegeDashboard from './components/admin/CollegeDashboard';
import CompanyDashboard from './components/admin/CompanyDashboard';
import { AdminProvider } from './context/AdminContext';
import AdminForgotPassword from './components/admin/AdminForgotPassword';
import AdminResetPassword from './components/admin/AdminResetPassword';

const App = () => {
  return (
    <UserProvider>
      <AdminProvider>
        <PointsProvider>
          <Routes>
            {/* Public routes with Layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="/About" element={<About />} />
                  <Route path="/AccountPage" element={<AccountPage />} />
                  <Route path="/loginform" element={<LoginForm />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/job-details" element={<JobDetailsForm />} />
                  <Route path="/pointpage" element={<PointPage />} />
                  <Route path="/educationForm" element={<EducationDetailsForm />} />
                  <Route path="/jobForm" element={<JobDetailsForm />} />
                  <Route path="/persionalForm" element={<PersonalDetailsForm />} />
                  <Route path="/MyProfile" element={<MyProfile />} />
                  <Route path="/help-support" element={<HelpSupportPage />} />
                </Routes>
              </Layout>
            }/>
            
            {/* Admin routes without Layout */}
            <Route path='/adminDashboard' element={<AdminDashboard/>}/>
            <Route path='/adminRegister' element={<AdminRegister />}/>
            <Route path='/adminLogin' element={<AdminLogin />}/>
            <Route path='/adminCollegeDashboard' element={<CollegeDashboard/>}/>
            <Route path='/adminCompanyDashboard' element={<CompanyDashboard/>}/>
            <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin-reset-password" element={<AdminResetPassword />} />
          </Routes>
        </PointsProvider>
      </AdminProvider>
    </UserProvider>
  );
};

export default App;