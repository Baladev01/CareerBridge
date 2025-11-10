import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import UserDetailsModal from './UserDetailsModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    students: 0,
    colleges: 0,
    companies: 0,
    startups: 0,
    jobedPeople: 0,
    joblessPeople: 0,
  });
  
  const [educationStats, setEducationStats] = useState({});
  const [jobStats, setJobStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // UserDetailsModal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('');
  
  // Real user data state
  const [realUserData, setRealUserData] = useState({
    students: [],
    employed: [],
    jobSeekers: [],
    companies: [],
    colleges: []
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchRealUserData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 [AdminDashboard] Fetching dashboard data...');
      
      const overviewResponse = await dashboardAPI.getOverview();
      console.log('📊 [AdminDashboard] Overview response:', overviewResponse);
      
      if (overviewResponse.data.success) {
        const overviewData = overviewResponse.data.data;
        console.log('✅ [AdminDashboard] Overview data:', overviewData);
        
        setStats({
          students: overviewData.totalStudents || 0,
          colleges: overviewData.uniqueColleges || 0,
          companies: overviewData.uniqueCompanies || 0,
          startups: overviewData.uniqueStartups || 0,
          jobedPeople: overviewData.currentlyWorking || 0,
          joblessPeople: Math.max(0, (overviewData.totalEmployees || 0) - (overviewData.currentlyWorking || 0))
        });
      } else {
        console.error('❌ [AdminDashboard] Overview API returned error');
        setStats({
          students: 0,
          colleges: 0,
          companies: 0,
          startups: 0,
          jobedPeople: 0,
          joblessPeople: 0
        });
      }

      const educationResponse = await dashboardAPI.getEducationStats();
      console.log('📊 [AdminDashboard] Education stats response:', educationResponse);
      
      if (educationResponse.data.success) {
        console.log('✅ [AdminDashboard] Education stats:', educationResponse.data.data);
        setEducationStats(educationResponse.data.data);
      } else {
        console.error('❌ [AdminDashboard] Education stats API returned error');
        setEducationStats({});
      }

      const jobResponse = await dashboardAPI.getJobStats();
      console.log('📊 [AdminDashboard] Job stats response:', jobResponse);
      
      if (jobResponse.data.success) {
        console.log('✅ [AdminDashboard] Job stats:', jobResponse.data.data);
        setJobStats(jobResponse.data.data);
      } else {
        console.error('❌ [AdminDashboard] Job stats API returned error');
        setJobStats({});
      }

      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('💥 [AdminDashboard] Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data);
      
      setStats({
        students: 0,
        colleges: 0,
        companies: 0,
        startups: 0,
        jobedPeople: 0,
        joblessPeople: 0
      });
      setEducationStats({});
      setJobStats({});
    } finally {
      setLoading(false);
    }
  };

  const fetchRealUserData = async () => {
    try {
      console.log('🔄 [AdminDashboard] Fetching real user data...');
      
      // Fetch education data (students)
      const educationResponse = await dashboardAPI.getAllEducationData();
      const educationData = educationResponse.data.success ? educationResponse.data.data : [];
      
      // Fetch job data (employed and job seekers)
      const jobResponse = await dashboardAPI.getAllJobData();
      const jobData = jobResponse.data.success ? jobResponse.data.data : [];

      // Helper function to format dates safely
      const getSafeDate = (dateObj, fallback = new Date()) => {
        if (!dateObj) return fallback;
        if (typeof dateObj === 'string') return new Date(dateObj);
        if (dateObj instanceof Date) return dateObj;
        if (dateObj.year && dateObj.month && dateObj.day) {
          return new Date(dateObj.year, dateObj.month - 1, dateObj.day);
        }
        return fallback;
      };

      // Process education data for students
      const students = educationData.map(edu => {
        const userCreatedAt = getSafeDate(edu.user?.createdAt || edu.createdAt);
        const userUpdatedAt = getSafeDate(edu.user?.updatedAt || edu.updatedAt);
        
        return {
          ...edu,
          name: edu.user?.name || 'Unknown User',
          email: edu.user?.email || 'No email',
          phone: edu.user?.phone || '',
          location: edu.collegeLocation || edu.university || 'Not specified',
          role: 'Student',
          type: 'students',
          createdAt: userCreatedAt,
          updatedAt: userUpdatedAt,
          joinDate: userCreatedAt,
          modifiedDate: userUpdatedAt
        };
      });

      // Process job data for employed and job seekers
      const employed = jobData.filter(job => job.currentlyWorking).map(job => {
        const userCreatedAt = getSafeDate(job.user?.createdAt || job.createdAt);
        const userUpdatedAt = getSafeDate(job.user?.updatedAt || job.updatedAt);
        
        return {
          ...job,
          name: job.user?.name || 'Unknown User',
          email: job.user?.email || 'No email',
          phone: job.user?.phone || '',
          location: job.location || 'Not specified',
          role: job.role || 'Employee',
          type: 'employed',
          createdAt: userCreatedAt,
          updatedAt: userUpdatedAt,
          joinDate: userCreatedAt,
          modifiedDate: userUpdatedAt
        };
      });

      const jobSeekers = jobData.filter(job => !job.currentlyWorking).map(job => {
        const userCreatedAt = getSafeDate(job.user?.createdAt || job.createdAt);
        const userUpdatedAt = getSafeDate(job.user?.updatedAt || job.updatedAt);
        
        return {
          ...job,
          name: job.user?.name || 'Unknown User',
          email: job.user?.email || 'No email',
          phone: job.user?.phone || '',
          location: job.preferredLocation || job.location || 'Not specified',
          role: job.role || 'Job Seeker',
          type: 'jobSeekers',
          createdAt: userCreatedAt,
          updatedAt: userUpdatedAt,
          joinDate: userCreatedAt,
          modifiedDate: userUpdatedAt
        };
      });

      // Calculate startup employees (small companies)
      const companyEmployeeCount = {};
      jobData.forEach(job => {
        if (job.companyName) {
          companyEmployeeCount[job.companyName] = (companyEmployeeCount[job.companyName] || 0) + 1;
        }
      });

      const startupEmployees = jobData.filter(job => {
        const company = job.companyName;
        return company && companyEmployeeCount[company] <= 50;
      }).map(job => {
        const userCreatedAt = getSafeDate(job.user?.createdAt || job.createdAt);
        const userUpdatedAt = getSafeDate(job.user?.updatedAt || job.updatedAt);
        
        return {
          ...job,
          name: job.user?.name || 'Unknown User',
          email: job.user?.email || 'No email',
          phone: job.user?.phone || '',
          location: job.location || 'Not specified',
          role: job.role || 'Startup Employee',
          type: 'startups',
          createdAt: userCreatedAt,
          updatedAt: userUpdatedAt,
          joinDate: userCreatedAt,
          modifiedDate: userUpdatedAt
        };
      });

      setRealUserData({
        students,
        employed,
        jobSeekers,
        companies: employed,
        colleges: students,
        startups: startupEmployees
      });

      console.log('✅ [AdminDashboard] Real user data loaded with dates:', {
        students: students.length,
        employed: employed.length,
        jobSeekers: jobSeekers.length,
        startups: startupEmployees.length
      });

    } catch (error) {
      console.error('💥 [AdminDashboard] Error fetching real user data:', error);
      setRealUserData({
        students: [],
        employed: [],
        jobSeekers: [],
        companies: [],
        colleges: [],
        startups: []
      });
    }
  };

  // UserDetailsModal functions
  const openUserModal = (users, title, type) => {
    setSelectedUsers(users);
    setModalTitle(title);
    setModalType(type);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUsers([]);
    setModalTitle('');
    setModalType('');
  };

  // Get real users by type
  const getRealUsersByType = (type) => {
    return realUserData[type] || [];
  };

  // Check if we have any real data
  const hasRealData = stats.students > 0 || stats.colleges > 0 || stats.companies > 0;
  const hasEducationData = educationStats.degreeDistribution && Object.keys(educationStats.degreeDistribution).length > 0;
  const hasJobData = jobStats && Object.keys(jobStats).length > 0;

  // Main statistics bar chart
  const barChartData = {
    labels: ['Students', 'Colleges', 'Companies', 'Startups', 'Employed', 'Seeking Job'],
    datasets: [
      {
        label: 'Statistics Overview',
        data: [
          stats.students,
          stats.colleges,
          stats.companies,
          stats.startups,
          stats.jobedPeople,
          stats.joblessPeople,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(14, 165, 233)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Degree distribution chart - with fallback
  const degreeChartData = hasEducationData ? {
    labels: Object.keys(educationStats.degreeDistribution),
    datasets: [
      {
        label: 'Students by Degree',
        data: Object.values(educationStats.degreeDistribution),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  } : {
    labels: ['No Degree Data Available'],
    datasets: [
      {
        label: 'Students by Degree',
        data: [100],
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Pie chart data
  const pieChartData = {
    labels: ['Students', 'Colleges', 'Companies', 'Startups', 'Employed', 'Seeking Job'],
    datasets: [
      {
        data: [
          stats.students,
          stats.colleges,
          stats.companies,
          stats.startups,
          stats.jobedPeople,
          stats.joblessPeople,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(14, 165, 233)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: 'Dashboard Statistics',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#111827'
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(209, 213, 219, 0.5)',
        },
        ticks: {
          color: '#6B7280'
        },
        title: {
          display: true,
          text: 'Count',
          color: '#374151'
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280'
        }
      },
    },
  };

  const StatCard = ({ title, value, icon, color, description, hasData, type }) => (
    <div 
      className={`
        bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 
        transform hover:-translate-y-1 border border-gray-200 relative cursor-pointer
        ${!hasData ? 'opacity-75' : ''}
      `}
      onClick={() => hasData && openUserModal(getRealUsersByType(type), title, type)}
    >
      {!hasData && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
            No Data
          </span>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 border border-opacity-20`}>
          {icon}
        </div>
        <div className="text-right">
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value.toLocaleString()}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {hasData && (
            <p className="text-xs text-blue-600 font-medium mt-1">
              {getRealUsersByType(type).length} users • Click to view
            </p>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${color}`}
          style={{ 
            width: `${Math.min(100, (value / Math.max(1, stats.students + stats.colleges + stats.companies)) * 100)}%` 
          }}
        ></div>
      </div>
    </div>
  );

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminRememberMe');
      
      if (onLogout) {
        onLogout();
      }
      
      navigate('/adminLogin');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleRefreshData = () => {
    fetchDashboardData();
    fetchRealUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <i className="fas fa-chart-bar text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CareerBridge Analytics</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefreshData}
                className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl transition-colors duration-200 border border-blue-200 font-medium"
              >
                <i className="fas fa-sync-alt"></i>
                <span>Refresh Data</span>
              </button>
              
              <button
                onClick={handleHomeClick}
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-xl transition-colors duration-200 border border-gray-300 font-medium"
              >
                <i className="fas fa-home"></i>
                <span>Home</span>
              </button>
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button
                onClick={handleLogoutClick}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl transition-colors duration-200 border border-red-200 font-medium"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Data Status Indicator */}
        {!hasRealData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mr-4">
                <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-900">No Data Available</h4>
                <p className="text-yellow-700 text-sm">
                  No user data has been submitted yet. The dashboard will automatically update when users start filling out education and job forms.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.students}
            description="Education form submissions"
            icon={<i className="fas fa-user-graduate text-blue-600 text-xl"></i>}
            color="bg-blue-500"
            hasData={stats.students > 0}
            type="students"
          />
          <StatCard
            title="Colleges"
            value={stats.colleges}
            description="Unique institutions"
            icon={<i className="fas fa-university text-purple-600 text-xl"></i>}
            color="bg-purple-500"
            hasData={stats.colleges > 0}
            type="colleges"
          />
          <StatCard
            title="Companies"
            value={stats.companies}
            description="Registered employers"
            icon={<i className="fas fa-building text-green-600 text-xl"></i>}
            color="bg-green-500"
            hasData={stats.companies > 0}
            type="companies"
          />
          <StatCard
            title="Startups"
            value={stats.startups}
            description="Emerging companies"
            icon={<i className="fas fa-rocket text-yellow-600 text-xl"></i>}
            color="bg-yellow-500"
            hasData={stats.startups > 0}
            type="startups"
          />
          <StatCard
            title="Employed"
            value={stats.jobedPeople}
            description="Currently working"
            icon={<i className="fas fa-briefcase text-cyan-600 text-xl"></i>}
            color="bg-cyan-500"
            hasData={stats.jobedPeople > 0}
            type="employed"
          />
          <StatCard
            title="Seeking Jobs"
            value={stats.joblessPeople}
            description="Active job seekers"
            icon={<i className="fas fa-user-clock text-red-600 text-xl"></i>}
            color="bg-red-500"
            hasData={stats.joblessPeople > 0}
            type="jobSeekers"
          />
        </div>

        {/* Quick Action Buttons */}
        {hasRealData && (
          <div className="flex gap-4 mb-8 flex-wrap justify-center">
            <button
              onClick={() => openUserModal(getRealUsersByType('students'), 'Student Analytics', 'students')}
              className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl font-semibold"
            >
              <i className="fas fa-user-graduate"></i>
              View All Students ({getRealUsersByType('students').length})
            </button>

            <button
              onClick={() => openUserModal(getRealUsersByType('employed'), 'Employed Users Analytics', 'employed')}
              className="flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl font-semibold"
            >
              <i className="fas fa-briefcase"></i>
              View Employed Users ({getRealUsersByType('employed').length})
            </button>

            <button
              onClick={() => openUserModal(getRealUsersByType('jobSeekers'), 'Job Seekers Analytics', 'jobSeekers')}
              className="flex items-center gap-3 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl font-semibold"
            >
              <i className="fas fa-search"></i>
              View Job Seekers ({getRealUsersByType('jobSeekers').length})
            </button>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribution Overview
              {!hasRealData && (
                <span className="text-sm font-normal text-yellow-600 ml-2">
                  (No data available)
                </span>
              )}
            </h3>
            <div className="h-80">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
            {!hasRealData && (
              <p className="text-center text-gray-500 mt-2">
                Pie chart will show real data when users submit forms
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistics Comparison
              {!hasRealData && (
                <span className="text-sm font-normal text-yellow-600 ml-2">
                  (No data available)
                </span>
              )}
            </h3>
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            {!hasRealData && (
              <p className="text-center text-gray-500 mt-2">
                Bar chart will show real data when users submit forms
              </p>
            )}
          </div>
        </div>

        {/* Education Distribution */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Education Distribution
            {!hasEducationData && (
              <span className="text-sm font-normal text-yellow-600 ml-2">
                (No degree data available)
              </span>
            )}
          </h3>
          <div className="h-80">
            <Bar data={degreeChartData} options={barChartOptions} />
          </div>
          {!hasEducationData && (
            <p className="text-center text-gray-500 mt-2">
              Degree distribution chart will show real data when users submit education forms
            </p>
          )}
        </div>

        

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to='/adminCompanyDashboard'>
            <button className="
              group bg-gradient-to-r from-blue-500 to-purple-600 text-white 
              px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl 
              transform hover:-translate-y-1 transition-all duration-300 
              hover:from-blue-600 hover:to-purple-700 flex items-center justify-center gap-3
            ">
              <i className="fas fa-building text-white text-xl"></i>
              View Company Analytics
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
          </Link>

          <Link to="/adminCollegeDashboard">  
            <button className="
              group bg-gradient-to-r from-green-500 to-cyan-600 text-white 
              px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl 
              transform hover:-translate-y-1 transition-all duration-300 
              hover:from-green-600 hover:to-cyan-700 flex items-center justify-center gap-3
            ">
              <i className="fas fa-university text-white text-xl"></i>
              View College Analytics
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
          </Link>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        users={selectedUsers}
        title={modalTitle}
        type={modalType}
      />
    </div>
  );
};

export default AdminDashboard;