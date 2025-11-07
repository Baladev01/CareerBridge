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
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 [AdminDashboard] Fetching dashboard data...');
      
      // Fetch overview statistics - REAL DATA ONLY
      const overviewResponse = await dashboardAPI.getOverview();
      console.log('📊 [AdminDashboard] Overview response:', overviewResponse);
      
      if (overviewResponse.data.success) {
        const overviewData = overviewResponse.data.data;
        console.log('✅ [AdminDashboard] Overview data:', overviewData);
        
        setStats({
          students: overviewData.totalStudents || 0,
          colleges: overviewData.uniqueColleges || 0,
          companies: overviewData.uniqueCompanies || 0,
          startups: overviewData.uniqueStartups || 0, // Added startups if available
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

      // Fetch education statistics - REAL DATA ONLY
      const educationResponse = await dashboardAPI.getEducationStats();
      console.log('📊 [AdminDashboard] Education stats response:', educationResponse);
      
      if (educationResponse.data.success) {
        console.log('✅ [AdminDashboard] Education stats:', educationResponse.data.data);
        setEducationStats(educationResponse.data.data);
      } else {
        console.error('❌ [AdminDashboard] Education stats API returned error');
        setEducationStats({});
      }

      // Fetch job statistics - REAL DATA ONLY
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
      
      // Set zeros on error - NO MOCK DATA
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
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
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
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgb(99, 102, 241)',
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
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
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
      },
      title: {
        display: true,
        text: 'Dashboard Statistics',
        font: {
          size: 16,
          weight: 'bold',
        },
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
          color: 'rgba(0, 0, 0, 0.1)',
        },
        title: {
          display: true,
          text: 'Count'
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const StatCard = ({ title, value, icon, color, description, hasData }) => (
    <div className={`
      bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 
      transform hover:-translate-y-1 border border-gray-100 relative
      ${!hasData ? 'opacity-75' : ''}
    `}>
      {!hasData && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            No Data
          </span>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-opacity-10 ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value.toLocaleString()}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <i className="fas fa-shield-alt text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CareerBridge Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
                {lastUpdated && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefreshData}
                className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg transition-colors duration-200 border border-green-200"
              >
                <i className="fas fa-sync-alt"></i>
                <span>Refresh Data</span>
              </button>
              
              <button
                onClick={handleHomeClick}
                className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors duration-200 border border-blue-200"
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
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors duration-200 border border-red-200"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Data Status Indicator */}
        {!hasRealData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl mr-4"></i>
              <div>
                <h4 className="text-lg font-semibold text-yellow-900">No Data Available</h4>
                <p className="text-yellow-700 text-sm">
                  No user data has been submitted yet. The dashboard will automatically update when users start filling out education and job forms.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.students}
            description="Registered in system"
            icon={<i className="fas fa-user-graduate text-indigo-500 text-xl"></i>}
            color="bg-indigo-500"
            hasData={stats.students > 0}
          />
          <StatCard
            title="Colleges"
            value={stats.colleges}
            description="Unique institutions"
            icon={<i className="fas fa-university text-purple-500 text-xl"></i>}
            color="bg-purple-500"
            hasData={stats.colleges > 0}
          />
          <StatCard
            title="Companies"
            value={stats.companies}
            description="Registered employers"
            icon={<i className="fas fa-building text-green-500 text-xl"></i>}
            color="bg-green-500"
            hasData={stats.companies > 0}
          />
          <StatCard
            title="Startups"
            value={stats.startups}
            description="Emerging companies"
            icon={<i className="fas fa-rocket text-yellow-500 text-xl"></i>}
            color="bg-yellow-500"
            hasData={stats.startups > 0}
          />
          <StatCard
            title="Employed"
            value={stats.jobedPeople}
            description="Currently working"
            icon={<i className="fas fa-briefcase text-blue-500 text-xl"></i>}
            color="bg-blue-500"
            hasData={stats.jobedPeople > 0}
          />
          <StatCard
            title="Seeking Jobs"
            value={stats.joblessPeople}
            description="Active job seekers"
            icon={<i className="fas fa-user-clock text-red-500 text-xl"></i>}
            color="bg-red-500"
            hasData={stats.joblessPeople > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
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

        {/* Data Source Information */}
        <div className={`border rounded-2xl p-6 mb-8 ${hasRealData ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center">
            <i className={`fas fa-database text-2xl mr-4 ${hasRealData ? 'text-blue-500' : 'text-gray-400'}`}></i>
            <div>
              <h4 className={`text-lg font-semibold ${hasRealData ? 'text-blue-900' : 'text-gray-600'}`}>
                {hasRealData ? 'Real-time Data' : 'Waiting for Data'}
              </h4>
              <p className={`text-sm ${hasRealData ? 'text-blue-700' : 'text-gray-500'}`}>
                {hasRealData 
                  ? 'This dashboard displays real statistics collected from user-submitted forms. Data updates automatically as users complete their profiles.'
                  : 'No user data has been submitted yet. Statistics will appear here once users start filling out education and job forms.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to='/adminCompanyDashboard'>
            <button className="
              group bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
              px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl 
              transform hover:-translate-y-1 transition-all duration-300 
              hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-3
              disabled:opacity-50 disabled:cursor-not-allowed
            ">
              <i className="fas fa-building text-white text-xl"></i>
              View Company Analytics
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
          </Link>

          <Link to="/adminCollegeDashboard">  
            <button className="
              group bg-gradient-to-r from-blue-500 to-cyan-600 text-white 
              px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl 
              transform hover:-translate-y-1 transition-all duration-300 
              hover:from-blue-600 hover:to-cyan-700 flex items-center justify-center gap-3
              disabled:opacity-50 disabled:cursor-not-allowed
            ">
              <i className="fas fa-university text-white text-xl"></i>
              View College Analytics
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;