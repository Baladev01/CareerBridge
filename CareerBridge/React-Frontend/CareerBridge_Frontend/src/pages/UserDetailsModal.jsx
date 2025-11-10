import React, { useState } from 'react';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const UserDetailsModal = ({ isOpen, onClose, users = [], title, type }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  if (!isOpen) return null;

  const safeUsers = Array.isArray(users) ? users : [];

  // Filter users based on search
  const filteredUsers = safeUsers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'email':
        return (a.email || '').localeCompare(b.email || '');
      case 'location':
        return (a.location || '').localeCompare(b.location || '');
      default:
        return 0;
    }
  });

  const getRoleSpecificInfo = (user) => {
    const baseFields = [
      { label: 'Name', value: user.name, icon: '👤' },
      { label: 'Email', value: user.email, icon: '📧' },
      { label: 'Phone', value: user.phone, icon: '📱' },
      { label: 'Location', value: user.location, icon: '📍' },
      { label: 'Role', value: user.role, icon: '💼' },
    ];

    switch (type) {
      case 'students':
        return {
          title: '🎓 Student Profile',
          color: 'from-blue-50 to-blue-100 border-blue-200',
          icon: '🎓',
          fields: [
            ...baseFields,
            { label: 'College', value: user.collegeName, icon: '🏫' },
            { label: 'Degree', value: user.degree, icon: '📜' },
            { label: 'Specialization', value: user.specialization, icon: '🎯' },
            { label: 'CGPA', value: user.cgpa, icon: '📊' },
            { label: 'Semester', value: user.semester, icon: '📚' },
            { label: 'University', value: user.university, icon: '🏛️' },
            { label: 'Department', value: user.department, icon: '🔬' },
          ].filter(field => field.value)
        };
      case 'employed':
        return {
          title: '💼 Employed Professional',
          color: 'from-green-50 to-green-100 border-green-200',
          icon: '💼',
          fields: [
            ...baseFields,
            { label: 'Company', value: user.companyName, icon: '🏢' },
            { label: 'Department', value: user.department, icon: '🏗️' },
            { label: 'Experience', value: user.experience ? `${user.experience} years` : null, icon: '⏳' },
            { label: 'Salary', value: user.salary, icon: '💰' },
            { label: 'Employment Type', value: user.employmentType, icon: '📋' },
            { label: 'Industry', value: user.industry, icon: '🏭' },
          ].filter(field => field.value)
        };
      case 'jobSeekers':
        return {
          title: '🔍 Job Seeker',
          color: 'from-yellow-50 to-yellow-100 border-yellow-200',
          icon: '🔍',
          fields: [
            ...baseFields,
            { label: 'Preferred Role', value: user.role, icon: '🎯' },
            { label: 'Expected Salary', value: user.expectedSalary, icon: '💰' },
            { label: 'Preferred Location', value: user.preferredLocation, icon: '📍' },
            { label: 'Experience', value: user.experience ? `${user.experience} years` : null, icon: '⏳' },
            { label: 'Notice Period', value: user.noticePeriod, icon: '⏰' },
          ].filter(field => field.value)
        };
      default:
        return {
          title: '👤 User Profile',
          color: 'from-gray-50 to-gray-100 border-gray-200',
          icon: '👤',
          fields: baseFields.filter(field => field.value)
        };
    }
  };

  const generateUserAnalyticsData = (user) => {
    const skills = user.skills ? (typeof user.skills === 'string' ? 
      user.skills.split(',').map(s => s.trim()).filter(s => s) : 
      Array.isArray(user.skills) ? user.skills : []) : ['No Skills'];

    return {
      skillsData: {
        labels: skills,
        datasets: [{
          data: skills.map(() => Math.floor(Math.random() * 100) + 1),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 20,
        }],
      },
      activityData: {
        labels: ['Profile Strength', 'Skills Match', 'Experience Level', 'Engagement'],
        datasets: [{
          label: 'User Metrics',
          data: [85, 72, 68, 90],
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: '#22C55E',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        }],
      },
      timelineData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Activity Level',
          data: [30, 45, 60, 75, 85, 95],
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 4,
          fill: true,
          tension: 0.4,
        }],
      }
    };
  };

  const renderUserAnalytics = (user) => {
    const userAnalyticsData = generateUserAnalyticsData(user);
    const userInfo = getRoleSpecificInfo(user);

    return (
      <div className="space-y-6">
        {/* User Header */}
        <div className={`bg-gradient-to-r ${userInfo.color} rounded-3xl p-8 text-gray-800 shadow-lg border-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/80 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm shadow-lg">
                {userInfo.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-600 text-lg">{user.email}</p>
                <p className="text-gray-700 font-semibold">{user.role}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-2 text-green-600 border border-green-200">
                📊 Active Profile
              </div>
              <p className="text-gray-500">Last updated: Recently</p>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🎯 Skills Distribution
            </h3>
            <div className="h-80">
              <Doughnut 
                data={userAnalyticsData.skillsData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: { color: '#6B7280', font: { size: 12 } }
                    }
                  },
                  cutout: '60%',
                }} 
              />
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📈 User Metrics
            </h3>
            <div className="h-80">
              <Line 
                data={userAnalyticsData.activityData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: { color: 'rgba(209, 213, 219, 0.5)' },
                      ticks: { color: '#6B7280' }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: '#6B7280' }
                    }
                  },
                  plugins: {
                    legend: { labels: { color: '#6B7280' } }
                  }
                }} 
              />
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📅 Activity Timeline
            </h3>
            <div className="h-64">
              <Line 
                data={userAnalyticsData.timelineData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(209, 213, 219, 0.5)' },
                      ticks: { color: '#6B7280' }
                    },
                    x: {
                      grid: { color: 'rgba(209, 213, 219, 0.5)' },
                      ticks: { color: '#6B7280' }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            ℹ️ User Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userInfo.fields.map((field, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{field.icon}</span>
                  <label className="block text-sm font-semibold text-gray-600">
                    {field.label}
                  </label>
                </div>
                <p className="text-gray-800 font-medium text-lg pl-11">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-gray-300 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {currentView === 'userAnalytics' ? `${selectedUser?.name}'s Analytics` : title}
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              {currentView === 'userAnalytics' 
                ? 'Detailed analytics and insights'
                : `${sortedUsers.length} users found`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {currentView === 'userAnalytics' ? (
              <button
                onClick={() => setCurrentView('list')}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 flex items-center gap-3 text-lg font-semibold border border-gray-300"
              >
                ← Back to List
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 w-80 text-lg"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                    🔍
                  </span>
                </div>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-2xl text-gray-800 focus:outline-none focus:border-blue-500 text-lg"
                >
                  <option value="name">Sort by Name</option>
                  <option value="email">Sort by Email</option>
                  <option value="location">Sort by Location</option>
                </select>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="w-14 h-14 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl flex items-center justify-center transition-all duration-300 text-2xl font-bold hover:scale-110 border border-red-200"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1 p-8 bg-gray-50/50">
          {safeUsers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-300 shadow-lg">
                <span className="text-6xl">😕</span>
              </div>
              <h3 className="text-3xl font-semibold text-gray-600 mb-4">No Users Found</h3>
              <p className="text-gray-500 text-lg mb-8">No user data available for this category.</p>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold"
              >
                Close Modal
              </button>
            </div>
          ) : currentView === 'userAnalytics' ? (
            renderUserAnalytics(selectedUser)
          ) : (
            <div className="grid gap-6">
              {sortedUsers.map((user, index) => {
                const userInfo = getRoleSpecificInfo(user);
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-3xl p-6 border border-gray-300 hover:border-blue-300 transition-all duration-500 cursor-pointer group hover:shadow-xl hover:scale-[1.02]"
                    onClick={() => {
                      setSelectedUser(user);
                      setCurrentView('userAnalytics');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-20 h-20 bg-gradient-to-r ${userInfo.color} rounded-2xl flex items-center justify-center text-gray-700 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 border`}>
                          {userInfo.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                            {user.name}
                          </h3>
                          <p className="text-gray-600 text-lg">{user.email}</p>
                          <p className="text-blue-500 text-lg mt-1">{user.role}</p>
                          {user.location && (
                            <p className="text-gray-500 text-lg flex items-center gap-2 mt-1">
                              📍 {user.location}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="px-6 py-2 bg-green-50 text-green-600 rounded-full text-lg font-semibold mb-3 border border-green-200">
                          Active
                        </div>
                        <p className="text-blue-500 text-lg font-semibold flex items-center gap-2 justify-end">
                          View Analytics →
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">85%</div>
                        <div className="text-gray-500 text-sm">Profile</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {userInfo.fields.length}
                        </div>
                        <div className="text-gray-500 text-sm">Details</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {user.skills ? (typeof user.skills === 'string' ? user.skills.split(',').length : user.skills.length) : 0}
                        </div>
                        <div className="text-gray-500 text-sm">Skills</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">⭐</div>
                        <div className="text-gray-500 text-sm">Rating</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-8 border-t border-gray-200 bg-gray-50">
          <p className="text-gray-600 text-lg">
            {currentView === 'userAnalytics' 
              ? `Viewing detailed analytics for ${selectedUser?.name}`
              : `Showing ${sortedUsers.length} of ${safeUsers.length} users`
            }
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 flex items-center gap-3 text-lg font-semibold border border-gray-300"
            >
              🖨️ Print
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 text-lg font-semibold"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;