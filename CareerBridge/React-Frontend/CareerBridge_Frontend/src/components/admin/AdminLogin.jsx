import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';

const AdminLogin = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();

  // If form validation fails
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // ✅ New condition: must check "Remember Me"
  if (!formData.rememberMe) {
    setErrors({ submit: "Please check 'Remember me' before logging in." });
    return;
  }

  setIsSubmitting(true);
  console.log('🔐 Starting admin login for:', formData.email);

  try {
    const response = await axios.post('http://localhost:8080/api/admin/login', {
      email: formData.email,
      password: formData.password
    });

    if (response.data.success) {
      const adminData = response.data.admin;

      // Save admin info
      localStorage.setItem('adminToken', 'admin-authenticated');
      localStorage.setItem('adminData', JSON.stringify(adminData));

      // Save "Remember Me"
      localStorage.setItem('adminRememberMe', 'true');
      localStorage.setItem('adminEmail', formData.email);

      setErrors({ submit: '✅ Login successful! Redirecting...' });
      setTimeout(() => navigate('/adminDashboard'), 1000);
    } else {
      setErrors({ submit: response.data.message || 'Login failed' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    setErrors({
      submit:
        error.response?.data?.message ||
        'Server error. Please try again later.'
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleForgotPassword = () => {
    navigate('/admin-forgot-password');
  };

  React.useEffect(() => {
  // Always clear remembered email on page load
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminRememberMe');
  
  // Reset the form state
  setFormData({
    email: '',
    password: '',
    rememberMe: false
  });
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* 🏠 Home Button */}
    <div className="absolute top-6 right-6">
      <Link
        to="/"
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        <i className="fas fa-home"></i>
        <span>Home</span>
      </Link>
    </div>
    
        {/* Left Section - Title & Info */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Career Bridge</h1>
                <p className="text-slate-600">Admin Portal</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                Admin Login
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Welcome back! Please sign in to access the admin dashboard and manage your platform.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 group cursor-pointer transform hover:translate-x-2 transition-transform duration-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Secure admin access only</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer transform hover:translate-x-2 transition-transform duration-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Full platform management</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer transform hover:translate-x-2 transition-transform duration-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Real-time analytics</span>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Sign In to Dashboard
              </h3>
              <p className="text-slate-600">
                Enter your admin credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                      errors.email 
                        ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500 bg-white/60'
                    }`}
                    placeholder="admin@careerbridge.com"
                  />
                  <i className="fas fa-envelope absolute right-3 top-3 text-slate-400"></i>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-10 text-slate-800 placeholder-slate-400 ${
                      errors.password 
                        ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500 bg-white/60'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-blue-500 transition-colors duration-200 hover:scale-110"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-slate-300 bg-white rounded focus:ring-blue-500 hover:scale-110 transition-transform duration-200"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-center font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:-translate-y-0.5 hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In to Dashboard
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                )}
              </button>
            </form>

        
            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link to="/adminRegister" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200 hover:underline">
                  Request Access
                </Link>
              </p>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
              <div className="flex items-center group cursor-pointer">
                <i className="fas fa-shield-alt mr-1 group-hover:text-blue-500 transition-colors duration-200"></i>
                <span className="group-hover:text-slate-500 transition-colors duration-200">SSL Secured</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <i className="fas fa-lock mr-1 group-hover:text-blue-500 transition-colors duration-200"></i>
                <span className="group-hover:text-slate-500 transition-colors duration-200">Encrypted</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <i className="fas fa-user-shield mr-1 group-hover:text-blue-500 transition-colors duration-200"></i>
                <span className="group-hover:text-slate-500 transition-colors duration-200">Admin Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;