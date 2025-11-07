import React, { useState, useEffect } from 'react';
import { usePoints } from '../../context/PointsContext';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useProfileImage } from '../../context/ProfileImageContext';
import { uploadProfilePhoto, savePersonalDetails } from '../../services/api';

const PersonalDetailsForm = () => {
  const { refreshProfileImage, updateProfileImage } = useProfileImage();
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
  const { addPoints } = usePoints();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Enhanced Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableDays, setAvailableDays] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  // Month options
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Initialize years (from 1900 to current year)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    setAvailableYears(years);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('profilePhoto', file);
      formData.append('userId', currentUser.id);

      console.log('📤 Uploading profile photo...');
      
      const response = await api.post('/personal/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000
      });

      console.log('✅ Upload response:', response.data);

      if (response.data.success) {
        const imageUrl = response.data.profilePhotoUrl;
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          profilePhoto: imageUrl
        }));
        
        // Immediately update profile image across app
        updateProfileImage(imageUrl);
        
        // Force refresh all components
        setTimeout(() => {
          refreshProfileImage();
        }, 1000);
        
        alert('✅ Profile photo uploaded successfully!');
      } else {
        alert('❌ Failed to upload profile photo: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      
      // Fallback: Use local URL for immediate preview
      const localImageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profilePhoto: localImageUrl
      }));
      
      alert('⚠️ Photo saved locally. It will be uploaded when you submit the form.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Update days when month or year changes
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const days = [];
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day < 10 ? `0${day}` : `${day}`);
      }
      setAvailableDays(days);
      
      if (selectedDay && parseInt(selectedDay) > daysInMonth) {
        setSelectedDay('');
      }
    } else {
      setAvailableDays([]);
    }
  }, [selectedMonth, selectedYear, selectedDay]);

  // Parse existing date when component loads
  useEffect(() => {
    if (formData.dateOfBirth) {
      const [year, month, day] = formData.dateOfBirth.split('-');
      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDay(day);
    }
  }, [formData.dateOfBirth]);

  // Add useEffect to check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      alert('Please login first!');
      navigate('/loginform');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value
    });
  };

  // Enhanced Date Picker Functions
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);
    updateDateOfBirth(day, selectedMonth, selectedYear);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    updateDateOfBirth(selectedDay, month, selectedYear);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    updateDateOfBirth(selectedDay, selectedMonth, year);
  };

  const updateDateOfBirth = (day, month, year) => {
    if (day && month && year) {
      const formattedDate = `${year}-${month}-${day}`;
      
      setFormData(prev => ({
        ...prev,
        dateOfBirth: formattedDate
      }));
      
      // Calculate age
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }

      setFormData(prev => ({
        ...prev,
        age: calculatedAge
      }));
    }
  };

  const handleSetToday = () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);
    updateDateOfBirth(day, month, year);
  };

  const handleClearDate = () => {
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
    setFormData(prev => ({
      ...prev,
      dateOfBirth: '',
      age: ''
    }));
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

    try {
        const formDataToSend = new FormData();

        const personalData = {
          ...formData,
          userId: currentUser.id,
          profilePhoto: undefined
        };

        console.log('📤 Submitting personal data for User ID:', currentUser.id);

        formDataToSend.append('data', JSON.stringify(personalData));
        
        if (formData.profilePhoto) {
          formDataToSend.append('profilePhoto', formData.profilePhoto);
        }

        const response = await api.post('/personal/save', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'User-ID': currentUser.id.toString()
          }
        });

        console.log('✅ Server response:', response.data);

        if (response.data.success) {
          // ADD POINTS HERE - Personal details completed
          const pointsAdded = addPoints(10, 'Personal details completed');
          
          if (pointsAdded) {
            console.log('✅ 10 points added for personal details');
          }
          
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
      }
  };

  // If no user, don't render the form
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Personal Details</h2>
            <p className="text-gray-600">Share your comprehensive personal information</p>
            
            {/* User Info Display */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>User:</strong> {currentUser.firstName} {currentUser.lastName} | 
                <strong> ID:</strong> {currentUser.id} | 
                <strong> Email:</strong> {currentUser.email}
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl animate-pulse text-center">
              ✅ Personal details submitted successfully! +10 points added
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
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

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onClick={toggleDatePicker}
                      required
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white cursor-pointer"
                      placeholder="Click to select date"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      📅
                    </div>
                  </div>
                  
                  {/* Enhanced Date Picker */}
                  {showDatePicker && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-full max-w-md">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-3 text-center">Select Date of Birth</h4>
                        
                        {/* Day, Month, Year Selectors */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {/* Day Selector */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Day</label>
                            <select
                              value={selectedDay}
                              onChange={handleDayChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="">Select Day</option>
                              {availableDays.map(day => (
                                <option key={day} value={day}>
                                  {parseInt(day)}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Month Selector */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Month</label>
                            <select
                              value={selectedMonth}
                              onChange={handleMonthChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="">Select Month</option>
                              {months.map(month => (
                                <option key={month.value} value={month.value}>
                                  {month.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Year Selector */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Year</label>
                            <select
                              value={selectedYear}
                              onChange={handleYearChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="">Select Year</option>
                              {availableYears.map(year => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {/* Selected Date Display */}
                        {(selectedDay || selectedMonth || selectedYear) && (
                          <div className="p-3 bg-blue-50 rounded-lg mb-3">
                            <div className="text-sm text-gray-600">Selected Date:</div>
                            <div className="font-semibold text-blue-700">
                              {selectedDay && selectedMonth && selectedYear 
                                ? `${selectedDay}-${selectedMonth}-${selectedYear}`
                                : 'Please complete all fields'
                              }
                            </div>
                          </div>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="flex justify-between gap-2">
                          <button
                            type="button"
                            onClick={handleSetToday}
                            className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            onClick={handleClearDate}
                            className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDatePicker(false)}
                            className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                    Guardian Phone
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
                    Guardian Address
                  </label>
                  <textarea
                    name="guardianAddress"
                    value={formData.guardianAddress}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter guardian's complete address"
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
                    placeholder="Enter emergency contact phone"
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
                    placeholder="Enter relation (e.g., Father, Mother, etc.)"
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo Upload */}
          // In the form JSX, update the profile photo preview:
  <div className="border-b border-gray-200 pb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      Profile Photo
    </h3>
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div className="w-24 h-24 bg-gray-200 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
          <img 
            src={formData.profilePhoto || profile} 
            alt="Profile Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image load error, falling back to default');
              e.target.src = profile;
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-2xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
          <span className="text-white text-sm font-semibold">Change</span>
        </div>
      </div>
      
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Profile Photo
        </label>
        <input
          type="file"
          name="profilePhoto"
          onChange={handleImageUpload}
          accept=".jpg,.jpeg,.png,.gif,.webp"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-2">
          {isSubmitting ? 'Uploading...' : 'Recommended: Square image, JPG/PNG format, max 5MB'}
        </p>
      </div>
    </div>
  </div>
    
    // In the profile photo section of PersonalDetailsForm.js:
<div className="flex items-center gap-6">
  <div className="relative group">
    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200 relative">
      <img 
        src={formData.profilePhoto || profile} 
        alt="Profile Preview" 
        className="w-full h-full object-cover absolute inset-0"
        onError={(e) => {
          console.log('Image load error, falling back to default');
          e.target.src = profile;
        }}
      />
    </div>
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-2xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
      <span className="text-white text-sm font-semibold">Change</span>
    </div>
  </div>
  
  <div className="flex-1">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Upload Profile Photo
    </label>
    <input
      type="file"
      name="profilePhoto"
      onChange={handleImageUpload}
      accept=".jpg,.jpeg,.png,.gif,.webp"
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      disabled={isSubmitting}
    />
    <p className="text-xs text-gray-500 mt-2">
      {isSubmitting ? 'Uploading...' : 'Recommended: Square image, JPG/PNG format, max 5MB'}
    </p>
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
                onClick={() => {
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
                    setSelectedDay('');
                    setSelectedMonth('');
                    setSelectedYear('');
                  }
                }}
                className="px-6 py-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                🗑️ Clear Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Personal Details
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