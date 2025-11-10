import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
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
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { dashboardAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CollegeDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCollege, setSearchCollege] = useState('');
  const [collegeData, setCollegeData] = useState({});
  const [userStats, setUserStats] = useState({});
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Fixed locations - empty initially
  const locations = ["Tamil Nadu"];

  useEffect(() => {
    fetchAllColleges();
  }, []);

  useEffect(() => {
    if (selectedCollege) {
      fetchCollegeData(selectedCollege);
    }
  }, [selectedCollege]);

  const fetchAllColleges = async () => {
    try {
      setInitialLoading(true);
      console.log('🔄 [CollegeDashboard] Fetching colleges from API...');
      
      const response = await dashboardAPI.getAllColleges();
      console.log('📊 [CollegeDashboard] API Response:', response);
      
      if (response.data.success) {
        console.log('✅ [CollegeDashboard] Colleges data:', response.data.data);
        setAllColleges(response.data.data || []);
        
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((college, index) => {
            console.log(`🏫 College ${index + 1}:`, {
              name: college.name,
              studentCount: college.studentCount,
              currentStudents: college.currentStudents
            });
          });
        } else {
          console.log('❌ [CollegeDashboard] No colleges found in response data');
        }
      } else {
        console.error('❌ [CollegeDashboard] API returned error:', response.data.message);
        setAllColleges([]);
      }
    } catch (error) {
      console.error('💥 [CollegeDashboard] Error fetching colleges:', error);
      console.error('Error details:', error.response?.data);
      setAllColleges([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCollegeData = async (collegeName) => {
    setLoading(true);
    try {
      console.log(`🔄 [CollegeDashboard] Fetching data for college: ${collegeName}`);
      
      const response = await dashboardAPI.getCollegeDashboardData(collegeName);
      console.log(`📊 [CollegeDashboard] College data response for ${collegeName}:`, response);
      
      if (response.data.success) {
        console.log(`✅ [CollegeDashboard] College data for ${collegeName}:`, response.data.data);
        console.log('📈 College Stats:', {
          totalStudents: response.data.data.totalStudents,
          averageCGPA: response.data.data.averageCGPA,
          currentlyStudying: response.data.data.currentlyStudying,
          performanceRating: response.data.data.performanceRating,
          activityStats: response.data.data.activityStats,
          eventStats: response.data.data.eventStats,
          degreeDistribution: response.data.data.degreeDistribution
        });
        setUserStats(response.data.data);
      } else {
        console.error(`❌ [CollegeDashboard] Failed to get college data: ${response.data.message}`);
        setUserStats(getEmptyCollegeData());
      }
    } catch (error) {
      console.error(`💥 [CollegeDashboard] Error fetching college data for ${collegeName}:`, error);
      console.error('Error details:', error.response?.data);
      setUserStats(getEmptyCollegeData());
    } finally {
      setLoading(false);
    }
  };

  const getEmptyCollegeData = () => ({
    totalStudents: 0,
    averageCGPA: 0,
    performanceRating: 0,
    currentlyStudying: 0,
    activityStats: {
      academic: 0,
      sports: 0,
      cultural: 0,
      technical: 0,
      social: 0
    },
    eventStats: {
      workshops: 0,
      seminars: 0,
      conferences: 0,
      competitions: 0,
      festivals: 0
    },
    degreeDistribution: {}
  });

  // Real chart data based on API response
  const activityChartData = userStats.activityStats && Object.values(userStats.activityStats).some(val => val > 0) ? {
    labels: ['Academic', 'Sports', 'Cultural', 'Technical', 'Social'],
    datasets: [
      {
        data: [
          userStats.activityStats.academic || 0,
          userStats.activityStats.sports || 0,
          userStats.activityStats.cultural || 0,
          userStats.activityStats.technical || 0,
          userStats.activityStats.social || 0
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  } : {
    labels: ['Academic', 'Sports', 'Cultural', 'Technical', 'Social'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(156, 163, 175)',
          'rgb(156, 163, 175)',
          'rgb(156, 163, 175)',
          'rgb(156, 163, 175)'
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const eventChartData = userStats.eventStats && Object.values(userStats.eventStats).some(val => val > 0) ? {
    labels: ['Workshops', 'Seminars', 'Conferences', 'Competitions', 'Festivals'],
    datasets: [
      {
        label: 'Number of Events',
        data: [
          userStats.eventStats.workshops || 0,
          userStats.eventStats.seminars || 0,
          userStats.eventStats.conferences || 0,
          userStats.eventStats.competitions || 0,
          userStats.eventStats.festivals || 0
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  } : {
    labels: ['Workshops', 'Seminars', 'Conferences', 'Competitions', 'Festivals'],
    datasets: [
      {
        label: 'Number of Events',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const degreeChartData = userStats.degreeDistribution && Object.keys(userStats.degreeDistribution).length > 0 ? {
    labels: Object.keys(userStats.degreeDistribution),
    datasets: [
      {
        label: 'Students by Degree',
        data: Object.values(userStats.degreeDistribution),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  } : {
    labels: ['No Degree Data Available'],
    datasets: [
      {
        label: 'Students by Degree',
        data: [0],
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const collegesInLocation = selectedLocation ? allColleges : [];

  const filteredColleges = collegesInLocation.filter(college =>
    college.name.toLowerCase().includes(searchCollege.toLowerCase())
  );

  const handleBackClick = () => {
    navigate('/adminDashboard');
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchLocation(location);
    setSelectedCollege('');
    setSearchCollege('');
    setUserStats({});
  };

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college.name);
    setSearchCollege(college.name);
  };

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
          text: 'Number of Students/Events'
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Debug current data
  console.log('📊 Current College Stats:', {
    activityStats: userStats.activityStats,
    eventStats: userStats.eventStats,
    degreeDistribution: userStats.degreeDistribution,
    hasActivityData: userStats.activityStats && Object.values(userStats.activityStats).some(val => val > 0),
    hasEventData: userStats.eventStats && Object.values(userStats.eventStats).some(val => val > 0),
    hasDegreeData: userStats.degreeDistribution && Object.keys(userStats.degreeDistribution).length > 0
  });

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading college data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
        >
          <IoArrowBackSharp className="text-xl" />
          <span>Back to Admin Dashboard</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tamil Nadu College Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights and performance metrics based on real user data
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading college data...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Location Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Location</h3>
            <div className="relative mb-4">
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Type to search locations in Tamil Nadu..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredLocations.map((location) => (
                <div
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
                    selectedLocation === location ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-indigo-500 mr-3"></i>
                    <div>
                      <p className="font-medium text-gray-900">{location}</p>
                      <p className="text-sm text-gray-500">
                        {allColleges.length} colleges available
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* College Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedLocation ? `Select College in ${selectedLocation}` : 'Select College'}
            </h3>
            {!selectedLocation ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-university text-4xl mb-3 text-gray-300"></i>
                <p>Please select a location first to view colleges</p>
              </div>
            ) : (
              <>
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchCollege}
                    onChange={(e) => setSearchCollege(e.target.value)}
                    placeholder={`Type to search colleges in ${selectedLocation}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredColleges.length > 0 ? (
                    filteredColleges.map((college, index) => (
                      <div
                        key={index}
                        onClick={() => handleCollegeSelect(college)}
                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
                          selectedCollege === college.name ? 'bg-indigo-50 border-indigo-200' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <i className="fas fa-graduation-cap text-green-500 mr-3"></i>
                          <div>
                            <p className="font-medium text-gray-900">{college.name}</p>
                            <p className="text-sm text-gray-500">
                              {college.studentCount || 0} students
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-university text-4xl mb-3 text-gray-300"></i>
                      <p>No colleges found in {selectedLocation}</p>
                      <p className="text-sm">Users haven't submitted any college data yet</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* College Details - Show only when college is selected */}
        {selectedCollege && !loading && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedCollege}
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-indigo-500"></i>
                    {selectedLocation}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <i className="fas fa-star mr-1 text-yellow-500"></i>
                    College
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <i className="fas fa-users mr-1"></i>
                    {userStats.totalStudents || 0} Students in Database
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Students</p>
                    <p className="text-2xl font-bold">{userStats.totalStudents || 0}</p>
                  </div>
                  <i className="fas fa-users text-2xl opacity-80"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Average CGPA</p>
                    <p className="text-2xl font-bold">{userStats.averageCGPA || 0}</p>
                  </div>
                  <i className="fas fa-graduation-cap text-2xl opacity-80"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Current Students</p>
                    <p className="text-2xl font-bold">{userStats.currentlyStudying || 0}</p>
                  </div>
                  <i className="fas fa-user-graduate text-2xl opacity-80"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Performance</p>
                    <p className="text-2xl font-bold">{userStats.performanceRating || 0}%</p>
                  </div>
                  <i className="fas fa-trophy text-2xl opacity-80"></i>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Student Activity Distribution
                  {userStats.activityStats && Object.values(userStats.activityStats).some(val => val > 0) && (
                    <span className="text-sm font-normal text-green-600 ml-2">
                      (Real data)
                    </span>
                  )}
                </h3>
                <div className="h-80">
                  <Pie data={activityChartData} options={chartOptions} />
                </div>
                {userStats.activityStats && !Object.values(userStats.activityStats).some(val => val > 0) && (
                  <p className="text-center text-gray-500 mt-2">No activity data available from user submissions</p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Statistics
                  {userStats.eventStats && Object.values(userStats.eventStats).some(val => val > 0) && (
                    <span className="text-sm font-normal text-green-600 ml-2">
                      (Real data)
                    </span>
                  )}
                </h3>
                <div className="h-80">
                  <Bar data={eventChartData} options={barChartOptions} />
                </div>
                {userStats.eventStats && !Object.values(userStats.eventStats).some(val => val > 0) && (
                  <p className="text-center text-gray-500 mt-2">No event data available from user submissions</p>
                )}
              </div>
            </div>

            {/* Degree Distribution Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Degree Distribution
                {userStats.degreeDistribution && Object.keys(userStats.degreeDistribution).length > 0 && (
                  <span className="text-sm font-normal text-green-600 ml-2">
                    ({Object.keys(userStats.degreeDistribution).length} degrees)
                  </span>
                )}
              </h3>
              <div className="h-80">
                <Bar data={degreeChartData} options={barChartOptions} />
              </div>
              {userStats.degreeDistribution && Object.keys(userStats.degreeDistribution).length === 0 && (
                <p className="text-center text-gray-500 mt-2">No degree data available from user submissions</p>
              )}
            </div>

          </>
        )}

        {/* No College Selected State */}
        {!selectedCollege && !loading && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <i className="fas fa-university text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No College Selected</h3>
            <p className="text-gray-500">
              Please select a location and then choose a college to view detailed analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDashboard;