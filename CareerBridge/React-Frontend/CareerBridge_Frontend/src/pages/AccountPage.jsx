import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import profile from '../Images/user.png';

const AccountPage = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [userData, setUserData] = useState({
    profileImage: profile,
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
    occupation: '',
    company: '',
    experience: '',
    highestEducation: '',
    university: '',
    bio: '',
    interests: ['Programming', 'Reading', 'Traveling', 'Photography']
  });

  // Professional color schemes matching Navbar
  const colorSchemes = {
    primary: 'from-blue-600 to-indigo-700',
    secondary: 'from-emerald-600 to-teal-700',
    accent: 'from-slate-700 to-slate-800',
    success: 'from-green-600 to-emerald-700',
    info: 'from-blue-600 to-cyan-700',
    warning: 'from-amber-600 to-orange-700'
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Set basic user info first
      setUserData(prev => ({
        ...prev,
        name: currentUser.firstName + ' ' + currentUser.lastName,
        email: currentUser.email,
        profileImage: currentUser.profilePhoto || profile
      }));

      // Fetch personal details for updated photo
      try {
        const personalResponse = await api.get(`/personal/user/${currentUser.id}`);
        if (personalResponse.data.success && personalResponse.data.data) {
          const personalData = personalResponse.data.data;
          
          let profileImage = currentUser.profilePhoto || profile;
          if (personalData.profilePhoto) {
            const photoUrl = personalData.profilePhoto.startsWith('http') 
              ? personalData.profilePhoto 
              : `${api.defaults.baseURL}${personalData.profilePhoto}`;
            profileImage = photoUrl;
          }
          
          setUserData(prev => ({
            ...prev,
            profileImage: profileImage,
            name: personalData.name || currentUser.firstName + ' ' + currentUser.lastName,
            email: personalData.email || currentUser.email,
            phone: personalData.phone || '',
            dateOfBirth: personalData.dateOfBirth || '',
            age: personalData.age || '',
            gender: personalData.gender || '',
            maritalStatus: personalData.maritalStatus || '',
            address: personalData.address || '',
            city: personalData.city || '',
            state: personalData.state || '',
            pincode: personalData.pincode || '',
            country: personalData.country || ''
          }));
        }
      } catch (personalError) {
        console.log('No personal details found');
      }

      // Fetch job details
      try {
        const jobResponse = await api.get(`/job/user/${currentUser.id}`);
        if (jobResponse.data.success && jobResponse.data.data) {
          const jobData = jobResponse.data.data;
          setUserData(prev => ({
            ...prev,
            occupation: jobData.role || '',
            company: jobData.companyName || '',
            experience: jobData.experience ? jobData.experience + ' years' : '',
            bio: jobData.jobDescription || ''
          }));
        }
      } catch (jobError) {
        console.log('No job details found');
      }

      // Fetch education details
      try {
        const educationResponse = await api.get(`/education/user/${currentUser.id}`);
        if (educationResponse.data.success && educationResponse.data.data) {
          const educationData = educationResponse.data.data;
          setUserData(prev => ({
            ...prev,
            highestEducation: educationData.degree || '',
            university: educationData.collegeName || educationData.university || ''
          }));
        }
      } catch (educationError) {
        console.log('No education details found');
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      
      const updateData = {
        userId: currentUser.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        age: userData.age,
        gender: userData.gender,
        maritalStatus: userData.maritalStatus,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        pincode: userData.pincode,
        country: userData.country
      };

      const response = await api.put('/personal/update', updateData);
      
      if (response.data.success) {
        alert('✅ Profile updated successfully!');
        setIsEditing(false);
        fetchUserData();
      } else {
        alert('❌ Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('❌ Error updating profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);
      formData.append('userId', currentUser.id);

      const response = await api.post('/personal/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        const newImageUrl = response.data.profilePhotoUrl;
        setUserData(prev => ({ ...prev, profileImage: newImageUrl }));
        updateUserProfile({ profilePhoto: newImageUrl });
        
        const profileUpdateEvent = new CustomEvent('profilePhotoUpdated', {
          detail: { profilePhoto: newImageUrl }
        });
        window.dispatchEvent(profileUpdateEvent);
        
        alert('✅ Profile photo updated successfully!');
      } else {
        alert('❌ Failed to upload profile photo');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('❌ Error uploading profile photo. Please try again.');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail?.profilePhoto) {
        setUserData(prev => ({ ...prev, profileImage: event.detail.profilePhoto }));
        console.log('🔄 AccountPage received profile photo update');
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfileUpdate);
    };
  }, []);

  const tabs = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8">
            {/* Profile Photo Section */}
            <div className="flex items-center gap-6 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-gray-200 shadow-lg">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-300"
                    onError={(e) => {
                      e.target.src = profile;
                    }}
                  />
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-50 transition-all duration-300 border border-blue-300 transform hover:scale-110">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </label>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Profile Photo</h4>
                <p className="text-gray-600 text-sm font-medium">
                  {isEditing 
                    ? "Click the camera icon to upload a new profile photo"
                    : "Your profile photo appears across all pages"
                  }
                </p>
                {isEditing && (
                  <p className="text-gray-500 text-xs mt-2">
                    Recommended: Square image, max 5MB
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true, icon: '👤' },
                { label: 'Email Address', name: 'email', type: 'email', required: true, icon: '📧' },
                { label: 'Phone Number', name: 'phone', type: 'tel', icon: '📱' },
                { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', icon: '🎂' },
                { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], icon: '⚧️' },
                { label: 'Marital Status', name: 'maritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], icon: '💍' }
              ].map((field) => (
                <div key={field.name} className="space-y-2 transform hover:scale-[1.02] transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="mr-2">{field.icon}</span>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {isEditing ? (
                    field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={userData[field.name] || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm font-medium"
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={userData[field.name] || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm font-medium"
                        required={field.required}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    )
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200 min-h-[48px] flex items-center text-sm font-semibold">
                      {userData[field.name] || <span className="text-gray-400 font-medium">Not provided</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Occupation/Role', name: 'occupation', type: 'text', icon: '💼' },
                { label: 'Company', name: 'company', type: 'text', icon: '🏢' },
                { label: 'Experience', name: 'experience', type: 'text', icon: '📊' },
                { label: 'Location', name: 'city', type: 'text', icon: '📍' }
              ].map((field) => (
                <div key={field.name} className="space-y-2 transform hover:scale-[1.02] transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="mr-2">{field.icon}</span>
                    {field.label}
                  </label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      name={field.name}
                      value={userData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm font-medium"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200 min-h-[48px] flex items-center text-sm font-semibold">
                      {userData[field.name] || <span className="text-gray-400 font-medium">Not provided</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="space-y-2 transform hover:scale-[1.01] transition-all duration-300">
              <label className="block text-sm font-semibold text-gray-700">
                <span className="mr-2">📝</span>
                Professional Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={userData.bio || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm font-medium resize-none"
                  placeholder="Describe your professional background, skills, and expertise..."
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200 min-h-[96px] flex items-center text-sm font-semibold">
                  {userData.bio || <span className="text-gray-400 font-medium">Not provided</span>}
                </div>
              )}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Highest Education', name: 'highestEducation', type: 'text', icon: '🎓' },
                { label: 'University/College', name: 'university', type: 'text', icon: '🏫' },
                { label: 'Field of Study', name: 'occupation', type: 'text', icon: '📚' },
                { label: 'Graduation Year', name: 'dateOfBirth', type: 'text', icon: '📅' }
              ].map((field) => (
                <div key={field.name} className="space-y-2 transform hover:scale-[1.02] transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="mr-2">{field.icon}</span>
                    {field.label}
                  </label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      name={field.name}
                      value={userData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm font-medium"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200 min-h-[48px] flex items-center text-sm font-semibold">
                      {userData[field.name] || <span className="text-gray-400 font-medium">Not provided</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 transform hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center">
                <div className="text-2xl mr-4">💡</div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Education details are automatically synced</p>
                  <p className="text-gray-600 text-sm font-medium">Your education information is pulled from the Education Details form you submitted</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <span className="mr-2">🎯</span>
                Interests & Skills
              </label>
              <div className="flex flex-wrap gap-3">
                {userData.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white shadow-sm transform hover:scale-105 transition-all duration-300"
                  >
                    {interest}
                    {isEditing && (
                      <button 
                        onClick={() => {
                          const newInterests = userData.interests.filter((_, i) => i !== index);
                          setUserData(prev => ({ ...prev, interests: newInterests }));
                        }}
                        className="text-white hover:text-gray-200 text-lg font-bold"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newInterest = prompt('Enter a new interest or skill:');
                      if (newInterest && newInterest.trim()) {
                        setUserData(prev => ({ 
                          ...prev, 
                          interests: [...prev.interests, newInterest.trim()] 
                        }));
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                  >
                    + Add Interest
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Notification Preferences', value: 'Email & Push', icon: '🔔' },
                { label: 'Language', value: 'English', icon: '🌐' },
                { label: 'Time Zone', value: 'EST (UTC-5)', icon: '⏰' },
                { label: 'Privacy Settings', value: 'Public', icon: '🛡️' }
              ].map((item) => (
                <div key={item.label} className="space-y-2 transform hover:scale-[1.02] transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200 text-sm font-semibold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm font-medium">Loading your profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background decorative elements matching Navbar style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header - Matching Navbar font style */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 text-sm font-medium">Manage your profile information</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col lg:flex-row">
              
              {/* Sidebar */}
              <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200">
                {/* Profile Summary */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border-2 border-white shadow-md overflow-hidden transform group-hover:scale-110 transition-all duration-300">
                        <img 
                          src={userData.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = profile;
                          }}
                        />
                      </div>
                      {isEditing && (
                        <label className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-1.5 rounded-full shadow-md cursor-pointer hover:bg-blue-50 transition-all duration-300 border border-blue-300 transform hover:scale-110">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                        </label>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">
                        {userData.name || 'Your Name'}
                      </h2>
                      <p className="text-sm text-gray-600 font-medium truncate">
                        {userData.occupation || 'Update your occupation'}
                      </p>
                      <p className="text-gray-500 text-xs truncate">{userData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs - Matching Navbar style */}
                <nav className="p-4">
                  <div className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </nav>

                {/* Action Buttons - Matching Navbar button style */}
                <div className="p-4 border-t border-gray-200">
                  {isEditing ? (
                    <div className="space-y-3">
                      <button
                        onClick={handleSave}
                        disabled={saveLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {saveLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                      <button
                        onClick={fetchUserData}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-700 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Data
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-xl">{tabs.find(tab => tab.id === activeTab)?.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {tabs.find(tab => tab.id === activeTab)?.label} Information
                        </h3>
                        <p className="text-gray-600 text-sm font-medium mt-1">
                          {activeTab === 'personal' && 'Manage your personal details and contact information'}
                          {activeTab === 'professional' && 'Update your professional background and work experience'}
                          {activeTab === 'education' && 'Edit your educational qualifications and achievements'}
                          {activeTab === 'preferences' && 'Customize your interests and account preferences'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-4xl">
                    {renderContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Status Info */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-start">
              <div className="text-2xl mr-4">💡</div>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-2">Automatic Data Sync</p>
                <p className="text-gray-600 text-sm font-medium mb-4">
                  Your profile automatically pulls data from the forms you've submitted. 
                  Fill out the Personal, Education, and Job forms to see your information here.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'Fill Personal Form', onClick: () => navigate('/persionalForm'), gradient: 'from-blue-600 to-indigo-700' },
                    { label: 'Fill Education Form', onClick: () => navigate('/educationForm'), gradient: 'from-emerald-600 to-teal-700' },
                    { label: 'Fill Job Form', onClick: () => navigate('/jobForm'), gradient: 'from-amber-600 to-orange-700' },
                    { label: 'Back to Home', onClick: () => navigate('/'), gradient: 'from-gray-600 to-gray-700' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`bg-gradient-to-r ${action.gradient} text-white px-6 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 group`}
                    >
                      {action.label}
                      <span className="text-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;