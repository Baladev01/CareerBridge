import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheck, FaHeart, FaStar } from 'react-icons/fa';
import axios from 'axios';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [typedText, setTypedText] = useState('');
  const successMessage = "✅ Email verified! Redirecting to reset password...";

  // Typing animation effect
  React.useEffect(() => {
    if (success) {
      let index = 0;
      const typing = setInterval(() => {
        setTypedText(successMessage.substring(0, index + 1));
        index++;
        if (index === successMessage.length) {
          clearInterval(typing);
          setTimeout(() => {
            navigate(`/admin-reset-password?email=${encodeURIComponent(email)}`);
          }, 1500);
        }
      }, 40);
      return () => clearInterval(typing);
    }
  }, [success, navigate, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📧 Admin forgot password request for:', email);
      
      // Create the request object with the correct structure
      const requestData = {
        email: email
      };

      console.log('📤 Sending request data:', requestData);
      
      const response = await axios.post('http://localhost:8080/api/admin/verify-email', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin email verification response:', response.data);

      if (response.data.success) {
        setSuccess(true);
      } else {
        setErrors({ submit: response.data.message });
      }
    } catch (error) {
      console.error('❌ Admin forgot password error:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        setErrors({ 
          submit: error.response.data?.message || 
          `Server error: ${error.response.status} - ${error.response.statusText}`
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrors({ 
          submit: 'No response from server. Please check if the backend is running.' 
        });
      } else {
        console.error('Error setting up request:', error.message);
        setErrors({ 
          submit: 'Request setup failed. Please try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-32 right-20 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>

      {/* Main Card */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 transform hover:scale-[1.01] transition-all duration-300 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 bg-gradient-to-r from-green-500 to-blue-500 text-white text-center relative">
            <div className="absolute -top-2 -left-2 text-yellow-300">
              <FaStar className="animate-spin-slow" />
            </div>
            <div className="absolute -top-2 -right-2 text-pink-300">
              <FaHeart className="animate-pulse" />
            </div>
            
            <Link 
              to="/adminLogin" 
              className="absolute left-6 top-6 text-white hover:text-yellow-200 transition-colors duration-200"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            
            <h2 className="text-3xl font-bold mb-2">Admin Forgot Password</h2>
            <p className="text-blue-100 text-lg">
              {success ? "Email verified successfully!" : "Enter your admin email to continue"}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {success ? (
              // Success State - Redirecting
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
                    Taking you to set your new password...
                  </p>
                </div>
              </div>
            ) : (
              // Form State
              <>
                {/* Info Message */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-700 text-sm text-center">
                    🔒 Enter your admin email address and we'll take you to set a new password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-green-500 text-lg" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@careerbridge.com"
                        className={`pl-12 w-full border-2 py-4 rounded-xl text-lg transition-all ${
                          errors.email
                            ? 'border-red-400 bg-red-50'
                            : 'border-green-200 hover:border-green-400 focus:border-green-500'
                        } focus:ring-2 focus:ring-green-200 focus:outline-none`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">{errors.email}</p>
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
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin mr-3"></div>
                        Verifying Email...
                      </div>
                    ) : (
                      'Continue to Reset Password'
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Remember your password?{' '}
                    <Link 
                      to="/adminLogin" 
                      className="text-green-600 hover:text-blue-600 font-semibold"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>

               

                {/* Security Note */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-yellow-700 text-xs text-center">
                    🔐 You'll be able to set a new password on the next page.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;