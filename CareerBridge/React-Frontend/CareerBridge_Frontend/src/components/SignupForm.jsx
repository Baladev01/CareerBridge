import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaHome, FaShieldAlt, FaUserShield, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    console.log('📝 Starting registration for:', formData.email);

    try {
      const res = await axios.post('http://localhost:8080/api/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      console.log('📨 Registration response:', res.data);

      if (res.data.success) {
        setRegistrationSuccess(true);
        setErrors({ submit: '✅ Registration successful! Redirecting to login...' });
        
        setTimeout(() => {
          navigate('/loginform');
        }, 2000);
      } else {
        setErrors({ submit: res.data.message || 'Registration failed' });
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      setErrors({ 
        submit: err.response?.data?.message || 'Server error. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset the form state
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
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
            <FaHome className="text-sm" />
            <span>Home</span>
          </Link>
        </div>
        
        {/* Left Section - Title & Info */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Career Bridge</h1>
                <p className="text-slate-600">Professional Network</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                Join Career Bridge
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Create your professional account and start your career journey with exclusive opportunities.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 group cursor-pointer transform hover:translate-x-2 transition-transform duration-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <FaCheck className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Build your professional profile</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer transform hover:translate-x-2 transition-transform duration-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <FaCheck className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Connect with industry professionals</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer transform hover:translate-x-2 transition-transform duration-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <FaCheck className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Access exclusive career opportunities</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer transform hover:translate-x-2 transition-transform duration-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <FaCheck className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Grow your professional network</span>
            </div>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Create Your Account
              </h3>
              <p className="text-slate-600">
                Start your professional journey today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                        errors.firstName 
                          ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                          : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500 bg-white/60'
                      }`}
                      placeholder="John"
                    />
                    <FaUser className="absolute right-3 top-3 text-slate-400" />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                        errors.lastName 
                          ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                          : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500 bg-white/60'
                      }`}
                      placeholder="Doe"
                    />
                    <FaUser className="absolute right-3 top-3 text-slate-400" />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

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
                    placeholder="your@email.com"
                  />
                  <FaEnvelope className="absolute right-3 top-3 text-slate-400" />
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
                    placeholder="Create your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-blue-500 transition-colors duration-200 hover:scale-110"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-10 text-slate-800 placeholder-slate-400 ${
                      errors.confirmPassword 
                        ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                        : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500 bg-white/60'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-blue-500 transition-colors duration-200 hover:scale-110"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-3 group cursor-pointer">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 bg-white rounded focus:ring-blue-500 hover:scale-110 transition-transform duration-200 mt-1"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-center font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 ${
                  isLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:-translate-y-0.5 hover:from-blue-600 hover:to-cyan-600'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Create Career Bridge Account
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link to="/loginform" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200 hover:underline">
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
              <div className="flex items-center group cursor-pointer">
                <FaShieldAlt className="mr-1 group-hover:text-blue-500 transition-colors duration-200" />
                <span className="group-hover:text-slate-500 transition-colors duration-200">SSL Secured</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <FaLock className="mr-1 group-hover:text-blue-500 transition-colors duration-200" />
                <span className="group-hover:text-slate-500 transition-colors duration-200">Encrypted</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <FaUserShield className="mr-1 group-hover:text-blue-500 transition-colors duration-200" />
                <span className="group-hover:text-slate-500 transition-colors duration-200">Secure Signup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;