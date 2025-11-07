import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaUser, FaEnvelope, FaPhone, FaLock, FaShieldAlt, FaStar, FaHeart } from 'react-icons/fa';
import axios from 'axios';

const AdminRegister = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [typedText, setTypedText] = useState('');
  const successMessage = "✅ Admin registration successful! Redirecting to login...";

  // Typing animation for success message
  React.useEffect(() => {
    if (success) {
      let index = 0;
      const typing = setInterval(() => {
        setTypedText(successMessage.substring(0, index + 1));
        index++;
        if (index === successMessage.length) {
          clearInterval(typing);
          setTimeout(() => {
            navigate('/adminLogin');
          }, 2000);
        }
      }, 40);
      return () => clearInterval(typing);
    }
  }, [success, navigate]);

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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
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

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('📝 Starting admin registration for:', formData.email);
      
      // Create admin object matching your backend entity
      const adminData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      };

      const response = await axios.post('http://localhost:8080/api/admin/register', adminData);

      console.log('✅ Admin registration response:', response.data);

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          agreeToTerms: false
        });
      } else {
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      console.error('❌ Admin registration error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 
        'Registration failed. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Section - Title & Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Career Bridge</h1>
                <p className="text-slate-600 text-sm">Admin Portal</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                Admin Registration
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Create your admin account to access the dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 group cursor-pointer transform hover:translate-x-1 transition-transform duration-200">
              <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors duration-200">
                <FaStar className="w-2.5 h-2.5 text-teal-600" />
              </div>
              <span className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Secure admin access</span>
            </div>
            <div className="flex items-center space-x-2 group cursor-pointer transform hover:translate-x-1 transition-transform duration-200">
              <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors duration-200">
                <FaStar className="w-2.5 h-2.5 text-teal-600" />
              </div>
              <span className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Full platform control</span>
            </div>
            <div className="flex items-center space-x-2 group cursor-pointer transform hover:translate-x-1 transition-transform duration-200">
              <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors duration-200">
                <FaStar className="w-2.5 h-2.5 text-teal-600" />
              </div>
              <span className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Advanced analytics</span>
            </div>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="max-w-sm w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-500">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-1">
                Create Account
              </h3>
              <p className="text-slate-600 text-sm">
                Fill in your details
              </p>
            </div>

            {success ? (
              // Success State
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-600 text-3xl" />
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                  <p className="text-green-700 font-medium text-lg leading-relaxed">
                    {typedText}
                  </p>
                </div>

                <div className="animate-pulse">
                  <p className="text-gray-600 text-sm">
                    Taking you to login page...
                  </p>
                </div>
              </div>
            ) : (
              // Form State
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-medium text-slate-700 mb-1">
                        First Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                            errors.firstName 
                              ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                              : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500 bg-white/60'
                          }`}
                          placeholder="First name"
                        />
                        <FaUser className="absolute right-2 top-2 text-slate-400 text-sm" />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-xs font-medium text-slate-700 mb-1">
                        Last Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                            errors.lastName 
                              ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                              : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500 bg-white/60'
                          }`}
                          placeholder="Last name"
                        />
                        <FaUser className="absolute right-2 top-2 text-slate-400 text-sm" />
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                          errors.email 
                            ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                            : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500 bg-white/60'
                        }`}
                        placeholder="Enter your email"
                      />
                      <FaEnvelope className="absolute right-2 top-2 text-slate-400 text-sm" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                          errors.phone 
                            ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                            : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500 bg-white/60'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      <FaPhone className="absolute right-2 top-2 text-slate-400 text-sm" />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                          errors.password 
                            ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                            : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500 bg-white/60'
                        }`}
                        placeholder="Create a password (min 6 characters)"
                      />
                      <FaLock className="absolute right-2 top-2 text-slate-400 text-sm" />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 placeholder-slate-400 ${
                          errors.confirmPassword 
                            ? 'border-red-400 focus:ring-red-200 bg-red-50' 
                            : 'border-slate-300 focus:ring-teal-200 focus:border-teal-500 bg-white/60'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <FaLock className="absolute right-2 top-2 text-slate-400 text-sm" />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2 group cursor-pointer">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="mt-0.5 w-3.5 h-3.5 text-teal-600 border-slate-300 bg-white rounded focus:ring-teal-500 hover:scale-110 transition-transform duration-200"
                    />
                    <label htmlFor="agreeToTerms" className="text-xs text-slate-600 flex-1 group-hover:text-slate-700 transition-colors duration-200">
                      I agree to the{' '}
                      <a href="#" className="text-teal-500 hover:text-teal-600 font-medium transition-colors duration-200">
                        Terms
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-teal-500 hover:text-teal-600 font-medium transition-colors duration-200">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
                  )}

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-center text-sm">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform ${
                      isSubmitting 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:-translate-y-0.5 hover:from-teal-600 hover:to-blue-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Admin Account'
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <Link to="/adminLogin" className="text-teal-500 hover:text-teal-600 font-semibold transition-colors duration-200 hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              <FaShieldAlt className="inline mr-1" />
              Enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;