import React, { useState, useEffect } from 'react';
import { usePoints } from '../../context/PointsContext';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FORM_POINTS } from '../../config/pointsConfig';

const PersonalDetailsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    maritalStatus: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    aadharNumber: '',
    nationality: '',
    religion: '',
    category: '',
    bloodGroup: '',
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    profilePhoto: null,
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { addPoints } = usePoints();
  const { currentUser, updateUserProfile } = useUser();
  const navigate = useNavigate();

  // Check if user is logged in and load existing data
  useEffect(() => {
    const initializeForm = async () => {
      if (!currentUser) {
        alert('Please login first!');
        navigate('/loginform');
        return;
      }

      try {
        console.log('🔄 Loading existing personal data for User ID:', currentUser.id);
        
        const response = await api.get(`/personal/user/${currentUser.id}`);
        
        if (response.data.success && response.data.data) {
          console.log('✅ Existing personal data found:', response.data.data);
          setExistingData(response.data.data);
          
          // Pre-fill form with existing data
          const existingFormData = { ...response.data.data };
          
          // Remove server-generated fields that shouldn't be in form
          delete existingFormData.id;
          delete existingFormData.createdAt;
          delete existingFormData.updatedAt;
          delete existingFormData.userId;
          
          setFormData(prev => ({
            ...prev,
            ...existingFormData
          }));

          // Store original data for comparison
          setOriginalData({
            ...existingFormData,
            profilePhoto: null
          });
        } else {
          console.log('ℹ️ No existing personal data found');
          setOriginalData({
            name: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            age: '',
            gender: '',
            maritalStatus: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            aadharNumber: '',
            nationality: '',
            religion: '',
            category: '',
            bloodGroup: '',
            fatherName: '',
            fatherOccupation: '',
            fatherPhone: '',
            motherName: '',
            motherOccupation: '',
            motherPhone: '',
            guardianName: '',
            guardianRelation: '',
            guardianPhone: '',
            guardianAddress: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelation: '',
            profilePhoto: null,
          });
        }
      } catch (error) {
        console.log('ℹ️ No existing personal data or error loading:', error.message);
        setOriginalData({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          age: '',
          gender: '',
          maritalStatus: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: '',
          aadharNumber: '',
          nationality: '',
          religion: '',
          category: '',
          bloodGroup: '',
          fatherName: '',
          fatherOccupation: '',
          fatherPhone: '',
          motherName: '',
          motherOccupation: '',
          motherPhone: '',
          guardianName: '',
          guardianRelation: '',
          guardianPhone: '',
          guardianAddress: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelation: '',
          profilePhoto: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [currentUser, navigate]);

  // Check for changes whenever formData changes
  useEffect(() => {
    if (originalData && !isLoading) {
      const hasFormChanged = checkFormChanges();
      setHasChanges(hasFormChanged);
    }
  }, [formData, originalData, isLoading]);

  const checkFormChanges = () => {
    if (!originalData) return false;

    // Compare all form fields with original data
    const fieldsToCompare = [
      'name', 'email', 'phone', 'dateOfBirth', 'age', 'gender', 'maritalStatus',
      'address', 'city', 'state', 'pincode', 'country', 'aadharNumber', 
      'nationality', 'religion', 'category', 'bloodGroup', 'fatherName', 
      'fatherOccupation', 'fatherPhone', 'motherName', 'motherOccupation', 
      'motherPhone', 'guardianName', 'guardianRelation', 'guardianPhone', 
      'guardianAddress', 'emergencyContactName', 'emergencyContactPhone', 
      'emergencyContactRelation'
    ];

    for (let field of fieldsToCompare) {
      const currentValue = formData[field] || '';
      const originalValue = originalData[field] || '';
      
      if (currentValue !== originalValue) {
        console.log(`🔄 Field changed: ${field}`, { original: originalValue, current: currentValue });
        return true;
      }
    }

    // Check if profile photo was added
    if (formData.profilePhoto && !existingData?.profilePhoto) {
      console.log('🔄 New profile photo added');
      return true;
    }

    return false;
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : files ? files[0] : value
      };
      
      // Auto-calculate age when dateOfBirth changes
      if (name === 'dateOfBirth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        
        newData.age = calculatedAge > 0 ? calculatedAge : '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!currentUser) {
    alert('Please login first!');
    navigate('/loginform');
    return;
  }

  // Basic validation
  const errors = [];

  if (!formData.name?.trim()) errors.push('Full Name is required');
  if (!formData.email?.trim()) errors.push('Email Address is required');
  if (!formData.phone?.trim()) errors.push('Phone Number is required');
  if (!formData.dateOfBirth) errors.push('Date of Birth is required');
  if (!formData.gender) errors.push('Gender is required');
  if (!formData.address?.trim()) errors.push('Address is required');

  if (errors.length > 0) {
    alert(`Please fix the following:\n\n• ${errors.join('\n• ')}`);
    return;
  }

  setIsSubmitting(true);
  setUploadProgress(0);

  try {
      const formDataToSend = new FormData();

      const personalData = {
        ...formData,
        userId: currentUser.id,
        profilePhoto: undefined
      };

      console.log('📤 Submitting personal data for User ID:', currentUser.id);
      console.log('📝 Form data:', personalData);
      console.log('🔄 Has changes:', hasChanges);

      formDataToSend.append('data', JSON.stringify(personalData));
      
      if (formData.profilePhoto) {
        formDataToSend.append('profilePhoto', formData.profilePhoto);
        console.log('📸 Profile photo attached:', formData.profilePhoto.name);
      }

      const response = await api.post('/personal/save', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'User-ID': currentUser.id.toString()
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        }
      });

      console.log('✅ Server response:', response.data);

      // ✅ CORRECTED SUCCESS HANDLER
      if (response.data.success) {
        // Update user context with new profile photo if uploaded
        if (formData.profilePhoto && response.data.data?.profilePhoto) {
          updateUserProfile({ 
            profilePhoto: response.data.data.profilePhoto 
          });
        }
        
        // Update existing data state
        setExistingData(response.data.data);
        
        // 🎯 ADD POINTS ONLY IF USER MADE CHANGES
        if (hasChanges || !existingData) {
          const pointsConfig = FORM_POINTS.personal;
          const pointsAdded = addPoints(pointsConfig.points, pointsConfig.reason);
          
          if (pointsAdded) {
            console.log(`✅ ${pointsConfig.points} points added for ${existingData ? 'updating' : 'submitting'} personal details`);
            
            // Debugging log
            console.log('🎯 Triggering points event for personal details:', {
              points: pointsConfig.points,
              reason: pointsConfig.reason,
              message: `+${pointsConfig.points} points: ${existingData ? 'Updated Personal Details' : 'Added Personal Details'}`,
              hasChanges: hasChanges,
              existingData: !!existingData
            });
            
            // ✅ CORRECTED EVENT WITH PROPER STRUCTURE
            const pointsEvent = new CustomEvent('pointsEarned', {
              detail: {
                points: pointsConfig.points,
                reason: pointsConfig.reason,
                message: `+${pointsConfig.points} points: ${existingData ? 'Updated Personal Details' : 'Added Personal Details'}`
              }
            });
            window.dispatchEvent(pointsEvent);
            console.log('✅ Points event dispatched for personal details');
          }
        } else {
          console.log('ℹ️ No changes detected - no points awarded');
        }
        
        // Update original data to current state
        setOriginalData({ 
          ...formData,
          profilePhoto: null
        });
        setHasChanges(false);
        
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard');
        }, 2000);
      } else {
        alert(response.data.message || "Error saving personal details");
      }
    } catch (error) {
      console.error('❌ Full error:', error);
      let errorMessage = "Network or server error occurred: ";
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        errorMessage += "Cannot connect to server. Make sure backend is running on port 8080.";
      } else if (error.response) {
        errorMessage += `${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage += "No response received from server.";
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
};

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        age: '',
        gender: '',
        maritalStatus: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        aadharNumber: '',
        nationality: '',
        religion: '',
        category: '',
        bloodGroup: '',
        fatherName: '',
        fatherOccupation: '',
        fatherPhone: '',
        motherName: '',
        motherOccupation: '',
        motherPhone: '',
        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',
        guardianAddress: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        profilePhoto: null,
      });
    }
  };

  // Show loading spinner while checking for existing data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {existingData ? 'Update Personal Details' : 'Personal Details'}
            </h2>
            <p className="text-gray-600">
              {existingData ? 'Update your comprehensive personal information' : 'Share your comprehensive personal information'}
            </p>
            
            {/* User Info Display */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Email:</strong> {currentUser.email}
                {hasChanges && (
                  <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    ✨ Changes detected - {FORM_POINTS.personal.points} points on save!
                  </span>
                )}
                {!hasChanges && existingData && (
                  <span className="ml-4 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    ⚡ Make changes to earn {FORM_POINTS.personal.points} points
                  </span>
                )}
                {!existingData && (
                  <span className="ml-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    🎯 Complete to earn {FORM_POINTS.personal.points} points!
                  </span>
                )}
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl animate-pulse text-center">
              ✅ {existingData 
                ? (hasChanges 
                    ? `Personal details updated!` 
                    : 'Personal details saved! (No changes detected)'
                  )
                : `${FORM_POINTS.personal.message} +${FORM_POINTS.personal.points} points added`
              }
            </div>
          )}

          {/* Upload Progress Bar */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading profile photo...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Simple Date Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                    placeholder="Auto-calculated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marital Status *
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter pincode"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Aadhar Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Aadhar Details
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aadhar Number *
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required
                  maxLength="12"
                  pattern="[0-9]{12}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter 12-digit Aadhar number"
                />
                <p className="text-xs text-gray-500 mt-1">12-digit Aadhar number without spaces</p>
              </div>
            </div>

            {/* Additional Personal Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Additional Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter nationality"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter religion"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parent Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Parent Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter father's name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Father's Occupation *
                  </label>
                  <input
                    type="text"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter occupation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Father's Phone
                  </label>
                  <input
                    type="tel"
                    name="fatherPhone"
                    value={formData.fatherPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter father's phone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mother's Name *
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter mother's name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mother's Occupation *
                  </label>
                  <input
                    type="text"
                    name="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter occupation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mother's Phone
                  </label>
                  <input
                    type="tel"
                    name="motherPhone"
                    value={formData.motherPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter mother's phone"
                  />
                </div>
              </div>
            </div>

            {/* Guardian Details Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                Guardian Details (If different from parents)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter guardian's name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Relation with Guardian
                  </label>
                  <select
                    name="guardianRelation"
                    value={formData.guardianRelation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guardian's Phone
                  </label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter guardian's phone"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guardian's Address
                  </label>
                  <textarea
                    name="guardianAddress"
                    value={formData.guardianAddress}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter guardian's address (if different from yours)"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter emergency contact name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter emergency phone number"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Relation with Emergency Contact *
                  </label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Father, Mother, Spouse, etc."
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Profile Photo
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Profile Photo
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, JPEG. Max size: 5MB</p>
                {formData.profilePhoto && (
                  <p className="text-green-600 text-sm mt-2">✅ Photo selected: {formData.profilePhoto.name}</p>
                )}
                {existingData?.profilePhoto && !formData.profilePhoto && (
                  <p className="text-blue-600 text-sm mt-2">📷 Current photo: {existingData.profilePhoto}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                ← Back to Dashboard
              </button>
              
              {/* Clear Form Button */}
              <button 
                type="button" 
                onClick={clearForm}
                className="px-6 py-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                🗑️ Clear Form
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting || (existingData && !hasChanges)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {existingData ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {existingData 
                      ? (hasChanges ? 'Update & Earn Points' : 'No Changes Made')
                      : 'Submit Personal Details'
                    }
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;