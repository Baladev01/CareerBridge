import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { usePoints } from '../context/PointsContext';
import api from '../services/api';
import profile from '../Images/user.png';

const MyProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { points, getPointsLevel } = usePoints();
  const [loading, setLoading] = useState(true);
  
  const { level, rank, color, icon } = getPointsLevel();
  
  const [userData, setUserData] = useState({
    profileImage: profile,
    name: '',
    email: '',
    phone: '',
    occupation: '',
    company: '',
    experience: '',
    highestEducation: '',
    university: '',
    bio: '',
    location: '',
    joinDate: ''
  });

  // Professional color schemes
  const colorSchemes = {
    primary: 'from-blue-500 to-purple-600',
    secondary: 'from-emerald-500 to-teal-600',
    accent: 'from-slate-600 to-slate-700',
    success: 'from-green-500 to-emerald-600',
    info: 'from-blue-500 to-cyan-600',
    warning: 'from-amber-500 to-orange-600'
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    } else {
      navigate('/loginform');
    }
  }, [currentUser, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const basicInfo = {
        name: currentUser.firstName + ' ' + currentUser.lastName,
        email: currentUser.email,
        joinDate: new Date(currentUser.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      let location = '';
      let occupation = '';
      let company = '';
      let experience = '';
      let highestEducation = '';
      let university = '';
      let bio = '';
      let phone = '';
      
      let profileImage = currentUser.profilePhoto || profile;

      try {
        const personalResponse = await api.get(`/personal/user/${currentUser.id}`);
        if (personalResponse.data.success && personalResponse.data.data) {
          const personalData = personalResponse.data.data;
          location = [personalData.city, personalData.state, personalData.country]
            .filter(Boolean).join(', ');
          phone = personalData.phone || '';
          
          if (personalData.profilePhoto && !currentUser.profilePhoto) {
            profileImage = personalData.profilePhoto;
          }
        }
      } catch (personalError) {
        console.log('No personal details found');
      }

      try {
        const jobResponse = await api.get(`/job/user/${currentUser.id}`);
        if (jobResponse.data.success && jobResponse.data.data) {
          const jobData = jobResponse.data.data;
          occupation = jobData.role || '';
          company = jobData.companyName || '';
          experience = jobData.experience ? jobData.experience + ' years' : '';
          bio = jobData.jobDescription || '';
        }
      } catch (jobError) {
        console.log('No job details found');
      }

      try {
        const educationResponse = await api.get(`/education/user/${currentUser.id}`);
        if (educationResponse.data.success && educationResponse.data.data) {
          const educationData = educationResponse.data.data;
          highestEducation = educationData.degree || '';
          university = educationData.collegeName || educationData.university || '';
        }
      } catch (educationError) {
        console.log('No education details found');
      }

      setUserData({
        ...basicInfo,
        phone,
        occupation,
        company,
        experience,
        highestEducation,
        university,
        bio,
        location,
        profileImage
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail?.profilePhoto) {
        setUserData(prev => ({ ...prev, profileImage: event.detail.profilePhoto }));
        console.log('🔄 MyProfile received profile photo update');
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfileUpdate);
    };
  }, []);

  const handleEditProfile = () => {
    navigate('/AccountPage');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl text-white">👤</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your digital identity • Complete your profile to unlock rewards
            </p>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            
            {/* Profile Header with Gradient */}
            <div className={`bg-gradient-to-r ${colorSchemes.primary} p-6 lg:p-8 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg overflow-hidden transform group-hover:scale-110 transition-all duration-300">
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = profile;
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{userData.name}</h2>
                  <p className="text-white/90 text-lg font-medium mb-4">{userData.occupation || 'Update your occupation'}</p>
                  
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                      <span className="text-sm">📧</span>
                      <span className="text-white text-sm font-medium">{userData.email}</span>
                    </div>
                    {userData.location && (
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                        <span className="text-sm">📍</span>
                        <span className="text-white text-sm font-medium">{userData.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Edit Button */}
                <button
                  onClick={handleEditProfile}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="p-6 border-b border-gray-200 bg-gray-50/50">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { value: points.toLocaleString(), label: 'Points', gradient: 'from-yellow-500 to-orange-500', icon: '⭐', bgColor: 'bg-yellow-50' },
                  { value: rank, label: 'Level', gradient: 'from-blue-500 to-cyan-600', icon: '🚀', bgColor: 'bg-blue-50' },
                  { value: userData.experience || '0', label: 'Experience', gradient: 'from-green-500 to-emerald-600', icon: '📊', bgColor: 'bg-green-50' },
                  { value: userData.joinDate.split(' ')[2], label: 'Member Since', gradient: 'from-purple-500 to-pink-600', icon: '🎉', bgColor: 'bg-purple-50' }
                ].map((stat, index) => (
                  <div key={index} className={`${stat.bgColor} rounded-2xl p-4 text-center shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300`}>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600 text-sm font-semibold">
                      <span className="text-lg">{stat.icon}</span>
                      <span>{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl text-white">👤</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Personal Information
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: '📧', label: 'Email', value: userData.email, gradient: 'from-blue-500 to-cyan-600' },
                      { icon: '📱', label: 'Phone', value: userData.phone || 'Not provided', gradient: 'from-green-500 to-emerald-600' },
                      { icon: '📍', label: 'Location', value: userData.location || 'Not provided', gradient: 'from-orange-500 to-red-600' },
                      { icon: '🎂', label: 'Member Since', value: userData.joinDate, gradient: 'from-purple-500 to-pink-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group">
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-lg text-white">{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                          <p className="text-sm font-bold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl text-white">💼</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Professional Information
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: '💼', label: 'Occupation', value: userData.occupation || 'Not provided', gradient: 'from-blue-500 to-indigo-600' },
                      { icon: '🏢', label: 'Company', value: userData.company || 'Not provided', gradient: 'from-purple-500 to-pink-600' },
                      { icon: '📊', label: 'Experience', value: userData.experience || 'Not provided', gradient: 'from-orange-500 to-amber-600' },
                      { icon: '🎓', label: 'Education', value: userData.highestEducation || 'Not provided', gradient: 'from-green-500 to-teal-600' },
                      { icon: '🏫', label: 'University', value: userData.university || 'Not provided', gradient: 'from-red-500 to-rose-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group">
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-lg text-white">{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                          <p className="text-sm font-bold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {userData.bio && (
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-lg transform hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-xl text-white">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      About Me
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium bg-white/50 p-4 rounded-xl border border-white/50">
                    {userData.bio}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Fill Personal Form', onClick: () => navigate('/persionalForm'), gradient: 'from-blue-500 to-indigo-600', icon: '📝' },
                  { label: 'Complete Forms', onClick: () => navigate('/dashboard'), gradient: 'from-emerald-500 to-teal-600', icon: '📋' },
                  { label: 'View Rewards', onClick: () => navigate('/pointpage'), gradient: 'from-amber-500 to-orange-600', icon: '🏆' },
                  { label: 'Back to Home', onClick: () => navigate('/'), gradient: 'from-gray-500 to-gray-600', icon: '⬅️' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`bg-gradient-to-r ${action.gradient} text-white px-4 py-4 rounded-xl font-semibold text-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 group justify-center`}
                  >
                    <span className="text-lg transform group-hover:scale-110 transition-transform">{action.icon}</span>
                    {action.label}
                    <span className="text-lg opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;