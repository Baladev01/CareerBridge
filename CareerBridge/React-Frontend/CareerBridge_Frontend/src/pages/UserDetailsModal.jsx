import React, { useState, useEffect } from 'react';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UserDetailsModal = ({ isOpen, onClose, users = [], title, type }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'analytics', 'userAnalytics'

  if (!isOpen) return null;

  console.log('🔔 [UserDetailsModal] Modal opened with:', { 
    isOpen, 
    usersCount: users?.length, 
    title, 
    type,
    users: users 
  });

  // Extract unique locations from users
  const locations = [...new Set(users.map(user => user.location).filter(Boolean))];

  // Filter users based on selections
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const usersInLocation = selectedLocation ? 
    users.filter(user => user.location === selectedLocation) : [];

  const filteredUsers = usersInLocation.filter(user =>
    user.name?.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Generate analytics data for individual user
  const generateUserAnalyticsData = (user) => {
    if (!user) return null;

    const analyticsData = {
      // Skills distribution
      skillsData: {
        labels: user.skills ? (typeof user.skills === 'string' ? 
          user.skills.split(',').map(s => s.trim()).filter(s => s) : 
          Array.isArray(user.skills) ? user.skills : []) : ['No Skills'],
        datasets: [
          {
            data: user.skills ? Array((typeof user.skills === 'string' ? 
              user.skills.split(',').length : user.skills.length)).fill(1) : [1],
            backgroundColor: [
              '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
              '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
            ],
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      },

      // Experience level
      experienceData: {
        labels: ['Current Experience'],
        datasets: [
          {
            label: 'Years of Experience',
            data: [user.experience || 0],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      },

      // Education metrics (for students)
      educationData: user.cgpa ? {
        labels: ['CGPA Score'],
        datasets: [
          {
            label: 'CGPA',
            data: [user.cgpa],
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      } : null,

      // Employment metrics (for employed)
      employmentData: user.salary ? {
        labels: ['Salary Level'],
        datasets: [
          {
            label: 'Salary',
            data: [parseInt(user.salary.replace(/[^\d]/g, '')) || 0],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      } : null,
    };

    return analyticsData;
  };

  // Get role-specific info
  const getRoleSpecificInfo = (user) => {
    switch (type) {
      case 'students':
        return {
          title: 'Student Details',
          fields: [
            { label: 'College', value: user.collegeName },
            { label: 'Degree', value: user.degree },
            { label: 'Specialization', value: user.specialization },
            { label: 'CGPA', value: user.cgpa },
            { label: 'Current Semester', value: user.semester },
            { label: 'Skills', value: user.skills },
            { label: 'Percentage', value: user.percentage ? `${user.percentage}%` : null },
            { label: 'University', value: user.university },
            { label: 'Department', value: user.department },
            { label: 'Roll Number', value: user.rollNumber }
          ].filter(field => field.value !== null && field.value !== undefined && field.value !== '')
        };
      case 'employed':
        return {
          title: 'Employed User Details',
          fields: [
            { label: 'Company', value: user.companyName },
            { label: 'Role', value: user.role },
            { label: 'Department', value: user.department },
            { label: 'Experience', value: user.experience ? `${user.experience} years` : null },
            { label: 'Salary', value: user.salary },
            { label: 'Location', value: user.location },
            { label: 'Employment Type', value: user.employmentType },
            { label: 'Industry', value: user.industry }
          ].filter(field => field.value !== null && field.value !== undefined && field.value !== '')
        };
      case 'jobSeekers':
        return {
          title: 'Job Seeker Details',
          fields: [
            { label: 'Preferred Role', value: user.role },
            { label: 'Expected Salary', value: user.expectedSalary },
            { label: 'Preferred Location', value: user.preferredLocation },
            { label: 'Skills', value: user.skills },
            { label: 'Notice Period', value: user.noticePeriod },
            { label: 'Experience', value: user.experience ? `${user.experience} years` : null },
            { label: 'Reason for Leaving', value: user.reasonForLeaving }
          ].filter(field => field.value !== null && field.value !== undefined && field.value !== '')
        };
      case 'companies':
        return {
          title: 'Company Employees',
          fields: [
            { label: 'Company', value: user.companyName },
            { label: 'Role', value: user.role },
            { label: 'Department', value: user.department },
            { label: 'Experience', value: user.experience ? `${user.experience} years` : null },
            { label: 'Employment Type', value: user.employmentType },
            { label: 'Industry', value: user.industry },
            { label: 'Location', value: user.location }
          ].filter(field => field.value !== null && field.value !== undefined && field.value !== '')
        };
      case 'colleges':
        return {
          title: 'College Students',
          fields: [
            { label: 'College', value: user.collegeName },
            { label: 'Degree', value: user.degree },
            { label: 'Specialization', value: user.specialization },
            { label: 'CGPA', value: user.cgpa },
            { label: 'Current Semester', value: user.semester },
            { label: 'University', value: user.university },
            { label: 'Department', value: user.department },
            { label: 'Roll Number', value: user.rollNumber },
            { label: '10th Percentage', value: user.tenthPercentage ? `${user.tenthPercentage}%` : null },
            { label: '12th Percentage', value: user.twelfthPercentage ? `${user.twelfthPercentage}%` : null }
          ].filter(field => field.value !== null && field.value !== undefined && field.value !== '')
        };
      case 'startups':
        return {
          title: 'Startup Employees',
          fields: [
            { label: 'Company', value: user.companyName },
            { label: 'Role', value: user.role },
            { label: 'Department', value: user.department },
            { label: 'Experience', value: user.experience ? `${user.experience} years` : null },
            { label: 'Employment Type', value: user.employmentType },
            { label: 'Industry', value: user.industry }
          ].filter(field => field.value !== null && field.value !== undefined && field.value !== '')
        };
      default:
        return { 
          title: title || 'User Details', 
          fields: [] 
        };
    }
  };

  const getStatusBadge = (user, userType) => {
    switch (userType) {
      case 'employed':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Employed</span>;
      case 'jobSeekers':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Seeking Job</span>;
      case 'students':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Student</span>;
      case 'colleges':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">College Student</span>;
      case 'companies':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Company Employee</span>;
      case 'startups':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">Startup Employee</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Active</span>;
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'Unknown';
    
    try {
      let date;
      
      if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      } else if (dateInput instanceof Date) {
        date = dateInput;
      } else if (dateInput.year && dateInput.month && dateInput.day) {
        date = new Date(dateInput.year, dateInput.monthValue - 1, dateInput.dayOfMonth);
      } else if (dateInput.$date) {
        date = new Date(dateInput.$date);
      } else {
        return 'Invalid Date';
      }
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
    } catch (error) {
      console.warn('Date formatting error:', error, 'Input:', dateInput);
      return 'Date Error';
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchLocation(location);
    setSelectedUser(null);
    setSearchUser('');
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchUser(user.name);
  };

  const handleViewUserAnalytics = (user) => {
    setSelectedUser(user);
    setCurrentView('userAnalytics');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedUser(null);
  };

  const handleBackToAnalytics = () => {
    setCurrentView('analytics');
    setSelectedUser(null);
  };

  const safeUsers = Array.isArray(users) ? users : [];

  // Individual User Analytics View
  const renderUserAnalytics = (user) => {
    const userAnalyticsData = generateUserAnalyticsData(user);
    const userInfo = getRoleSpecificInfo(user);

    return (
      <div className="space-y-6">
        {/* User Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name || 'Unknown User'}</h2>
                <p className="text-gray-600">{user.role || 'No role specified'}</p>
                <p className="text-gray-500 text-sm">{user.email || 'No email'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(user, type)}
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>

        {/* User Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Distribution</h3>
            <div className="h-64">
              {userAnalyticsData.skillsData.labels.length > 1 ? (
                <Doughnut 
                  data={userAnalyticsData.skillsData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: `${user.name}'s Skills`,
                        font: { size: 16, weight: 'bold' }
                      }
                    }
                  }} 
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No skills data available
                </div>
              )}
            </div>
          </div>

          {/* Experience Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Level</h3>
            <div className="h-64">
              <Bar 
                data={userAnalyticsData.experienceData} 
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Years' }
                    }
                  },
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Years of Experience',
                      font: { size: 16, weight: 'bold' }
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Education Chart (for students) */}
          {userAnalyticsData.educationData && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
              <div className="h-64">
                <Bar 
                  data={userAnalyticsData.educationData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 10,
                        title: { display: true, text: 'CGPA' }
                      }
                    },
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'CGPA Score',
                        font: { size: 16, weight: 'bold' }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          )}

          {/* Employment Chart (for employed) */}
          {userAnalyticsData.employmentData && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h3>
              <div className="h-64">
                <Bar 
                  data={userAnalyticsData.employmentData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Salary' }
                      }
                    },
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Salary Level',
                        font: { size: 16, weight: 'bold' }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          )}

          {/* User Details Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userInfo.fields.map((field, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <p className="text-gray-800 font-medium text-lg">
                    {field.value || 'Not specified'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentView === 'userAnalytics' && selectedUser 
                ? `${selectedUser.name}'s Analytics` 
                : getRoleSpecificInfo(safeUsers[0] || {}).title
              }
            </h2>
            <p className="text-gray-600 mt-1">
              {currentView === 'userAnalytics' 
                ? 'Individual User Analytics'
                : `Total ${safeUsers.length} ${safeUsers.length === 1 ? 'user' : 'users'} found`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle - Only show when not in user analytics view */}
            {currentView !== 'userAnalytics' && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${
                    currentView === 'list' 
                      ? 'bg-white shadow-sm text-indigo-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <i className="fas fa-list"></i>
                  List View
                </button>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${
                    currentView === 'analytics' 
                      ? 'bg-white shadow-sm text-indigo-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <i className="fas fa-chart-bar"></i>
                  Analytics
                </button>
              </div>
            )}

            {/* Back button for user analytics view */}
            {currentView === 'userAnalytics' && (
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Back to List
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {safeUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-gray-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
              <p className="text-gray-500 mb-4">No user data available for this category.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          ) : currentView === 'userAnalytics' ? (
            // Individual User Analytics View
            renderUserAnalytics(selectedUser)
          ) : currentView === 'analytics' ? (
            // Group Analytics View (your existing analytics code)
            <div className="space-y-6">
              {/* Your existing group analytics code here */}
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Group Analytics</h3>
                <p className="text-gray-500">Click on individual users in list view to see their personal analytics.</p>
              </div>
            </div>
          ) : (
            // List View with clickable users
            <div className="grid gap-6">
              {safeUsers.map((user, index) => {
                const userInfo = getRoleSpecificInfo(user);
                const userFields = userInfo.fields || [];
                
                return (
                  <div 
                    key={user.id || user._id || `user-${index}`} 
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white cursor-pointer"
                    onClick={() => handleViewUserAnalytics(user)}
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                            {user.name || 'Unknown User'}
                          </h3>
                          <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                            <i className="fas fa-envelope text-gray-400"></i>
                            {user.email || 'No email provided'}
                          </p>
                          {user.phone && (
                            <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                              <i className="fas fa-phone text-gray-400"></i>
                              {user.phone}
                            </p>
                          )}
                          <p className="text-blue-500 text-sm mt-2 flex items-center gap-1">
                            <i className="fas fa-chart-line"></i>
                            Click to view analytics
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(user, type)}
                        {user.currentlyWorking && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Currently Working
                          </span>
                        )}
                        {user.currentlyStudying && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Currently Studying
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {user.experience && (
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-blue-600">{user.experience}</p>
                          <p className="text-xs text-blue-800">Years Exp</p>
                        </div>
                      )}
                      {user.cgpa && (
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-green-600">{user.cgpa}</p>
                          <p className="text-xs text-green-800">CGPA</p>
                        </div>
                      )}
                      {user.skills && (
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {typeof user.skills === 'string' ? user.skills.split(',').length : user.skills.length}
                          </p>
                          <p className="text-xs text-purple-800">Skills</p>
                        </div>
                      )}
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {userFields.length}
                        </p>
                        <p className="text-xs text-orange-800">Details</p>
                      </div>
                    </div>

                    {/* Role Specific Fields (collapsed preview) */}
                    {userFields.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {userFields.slice(0, 4).map((field, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{field.label}:</span>
                              <span className="font-medium text-gray-800 truncate ml-2 max-w-[150px]">
                                {field.value || 'Not specified'}
                              </span>
                            </div>
                          ))}
                        </div>
                        {userFields.length > 4 && (
                          <p className="text-blue-500 text-xs mt-2 text-center">
                            +{userFields.length - 4} more fields - Click to view full details
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <p className="text-gray-600 text-sm">
            {currentView === 'userAnalytics' 
              ? `Viewing analytics for ${selectedUser?.name || 'selected user'}`
              : currentView === 'analytics'
              ? `Showing analytics for ${selectedLocation || 'all locations'}`
              : `Showing ${safeUsers.length} of ${safeUsers.length} users - Click any user for individual analytics`
            }
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
            >
              <i className="fas fa-print"></i>
              Print
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <i className="fas fa-times"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;