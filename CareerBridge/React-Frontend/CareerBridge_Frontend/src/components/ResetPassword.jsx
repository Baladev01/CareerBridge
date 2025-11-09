import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaArrowLeft, FaHeart, FaStar, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [typedText, setTypedText] = useState('');
  const successMessage = "✅ Password reset successfully! Redirecting to login...";

  // Check if email is present
  useEffect(() => {
    if (!email) {
      setErrors({ submit: 'Email parameter missing. Please start over from forgot password.' });
    }
  }, [email]);

  // Typing animation for success
  useEffect(() => {
    if (success) {
      let index = 0;
      const typing = setInterval(() => {
        setTypedText(successMessage.substring(0, index + 1));
        index++;
        if (index === successMessage.length) {
          clearInterval(typing);
          setTimeout(() => navigate('/loginform'), 2000);
        }
      }, 40);
      return () => clearInterval(typing);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔄 Resetting password for email:', email);
      
      const res = await axios.post('http://localhost:8080/api/reset-password-direct', {
        email: email,
        newPassword: formData.newPassword
      });

      console.log('✅ Reset password response:', res.data);

      if (res.data.success) {
        setSuccess(true);
      } else {
        setErrors({ submit: res.data.message });
      }
    } catch (err) {
      console.error('❌ Reset password error:', err);
      setErrors({ 
        submit: err.response?.data?.message || 
        'Unable to reset password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If no email, show error
  if (!email) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500 relative overflow-hidden">
        <div className="w-full bg-white shadow-md py-4 text-center text-gray-800 text-xl font-semibold tracking-wide">
          🌐 CareerBridge — Invalid Request
        </div>
        
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Request</h2>
            <p className="text-gray-600 mb-6">Please start the password reset process from the beginning.</p>
            <Link 
              to="/forgot-password" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-block"
            >
              Go to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden">
    

      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-20 h-20 bg-green-300 rounded-full opacity-30 animate-pulse"></div>

      {/* Main Card */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 transform hover:scale-[1.01] transition-all duration-300 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center relative">
            <div className="absolute -top-2 -left-2 text-yellow-300">
              <FaStar className="animate-spin-slow" />
            </div>
            <div className="absolute -top-2 -right-2 text-red-300">
              <FaHeart className="animate-pulse" />
            </div>
            
            <Link 
              to="/forgot-password" 
              className="absolute left-6 top-6 text-white hover:text-yellow-200 transition-colors duration-200"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            
            <h2 className="text-3xl font-bold mb-2">Set New Password</h2>
            <p className="text-pink-100 text-lg">
              {success ? "Password updated successfully!" : "Create your new password"}
            </p>
            
            {/* Show email */}
            <div className="mt-3 flex items-center justify-center bg-white/20 rounded-lg py-2 px-4">
              <FaEnvelope className="mr-2" />
              <span className="text-sm">{email}</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
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
              </div>
            ) : (
              // Form State
              <>
                {/* Info Message */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-700 text-sm text-center">
                    🔒 Enter your new password below. Make sure it's strong and secure.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-purple-500 text-lg" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password (min 6 characters)"
                        className={`pl-12 pr-12 w-full border-2 py-4 rounded-xl text-lg transition-all ${
                          errors.newPassword
                            ? 'border-red-400 bg-red-50'
                            : 'border-purple-200 hover:border-purple-400 focus:border-purple-500'
                        } focus:ring-2 focus:ring-purple-200 focus:outline-none`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-pink-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-2">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-purple-500 text-lg" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        className={`pl-12 pr-12 w-full border-2 py-4 rounded-xl text-lg transition-all ${
                          errors.confirmPassword
                            ? 'border-red-400 bg-red-50'
                            : 'border-purple-200 hover:border-purple-400 focus:border-purple-500'
                        } focus:ring-2 focus:ring-purple-200 focus:outline-none`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-pink-500"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
                    )}
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
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin mr-3"></div>
                        Updating Password...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>

               
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;