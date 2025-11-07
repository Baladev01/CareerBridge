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

const CompanyDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [companyStats, setCompanyStats] = useState({});
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Fixed locations - empty initially
  const locations = ["Tamil Nadu"];

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyData(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchAllCompanies = async () => {
    try {
      setInitialLoading(true);
      console.log('🔄 [CompanyDashboard] Fetching companies from API...');
      
      const response = await dashboardAPI.getAllCompanies();
      console.log('📊 [CompanyDashboard] API Response:', response);
      
      if (response.data.success) {
        console.log('✅ [CompanyDashboard] Companies data:', response.data.data);
        setAllCompanies(response.data.data || []);
        
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((company, index) => {
            console.log(`🏢 Company ${index + 1}:`, {
              name: company.name,
              employeeCount: company.employeeCount,
              currentEmployees: company.currentEmployees
            });
          });
        } else {
          console.log('❌ [CompanyDashboard] No companies found in response data');
        }
      } else {
        console.error('❌ [CompanyDashboard] API returned error:', response.data.message);
        setAllCompanies([]);
      }
    } catch (error) {
      console.error('💥 [CompanyDashboard] Error fetching companies:', error);
      console.error('Error details:', error.response?.data);
      setAllCompanies([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCompanyData = async (companyName) => {
    setLoading(true);
    try {
      console.log(`🔄 [CompanyDashboard] Fetching data for company: ${companyName}`);
      
      const response = await dashboardAPI.getCompanyDashboardData(companyName);
      console.log(`📊 [CompanyDashboard] Company data response for ${companyName}:`, response);
      
      if (response.data.success) {
        console.log(`✅ [CompanyDashboard] Company data for ${companyName}:`, response.data.data);
        console.log('📈 Company Stats:', {
          totalEmployees: response.data.data.totalEmployees,
          currentEmployees: response.data.data.currentEmployees,
          averageExperience: response.data.data.averageExperience,
          performanceRating: response.data.data.performanceRating,
          roleDistribution: response.data.data.roleDistribution,
          experienceDistribution: response.data.data.experienceDistribution,
          hiringTrend: response.data.data.hiringTrend
        });
        setCompanyStats(response.data.data);
      } else {
        console.error(`❌ [CompanyDashboard] Failed to get company data: ${response.data.message}`);
        setCompanyStats(getEmptyCompanyData());
      }
    } catch (error) {
      console.error(`💥 [CompanyDashboard] Error fetching company data for ${companyName}:`, error);
      console.error('Error details:', error.response?.data);
      setCompanyStats(getEmptyCompanyData());
    } finally {
      setLoading(false);
    }
  };

  const getEmptyCompanyData = () => ({
    totalEmployees: 0,
    currentEmployees: 0,
    averageExperience: 0,
    performanceRating: 0,
    marketShare: 0,
    growthRate: 0,
    roleDistribution: {},
    experienceDistribution: {},
    hiringTrend: {},
    skillStats: {}
  });

  // Real chart data based on API response
  const roleChartData = companyStats.roleDistribution && Object.keys(companyStats.roleDistribution).length > 0 ? {
    labels: Object.keys(companyStats.roleDistribution),
    datasets: [
      {
        data: Object.values(companyStats.roleDistribution),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)',
          'rgb(14, 165, 233)',
          'rgb(236, 72, 153)',
          'rgb(20, 184, 166)',
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  } : {
    labels: ['No Role Data Available'],
    datasets: [
      {
        data: [100],
        backgroundColor: ['rgba(156, 163, 175, 0.8)'],
        borderColor: ['rgb(156, 163, 175)'],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const hiringTrendData = companyStats.hiringTrend && Object.keys(companyStats.hiringTrend).length > 0 ? {
    labels: Object.keys(companyStats.hiringTrend),
    datasets: [
      {
        label: 'Employees Hired',
        data: Object.values(companyStats.hiringTrend),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  } : {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Employees Hired',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const experienceChartData = companyStats.experienceDistribution && Object.keys(companyStats.experienceDistribution).length > 0 ? {
    labels: Object.keys(companyStats.experienceDistribution),
    datasets: [
      {
        data: Object.values(companyStats.experienceDistribution),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  } : {
    labels: ['No Experience Data Available'],
    datasets: [
      {
        data: [100],
        backgroundColor: ['rgba(156, 163, 175, 0.8)'],
        borderColor: ['rgb(156, 163, 175)'],
        borderWidth: 2,
      },
    ],
  };

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const companiesInLocation = selectedLocation ? allCompanies : [];

  const filteredCompanies = companiesInLocation.filter(company =>
    company.name.toLowerCase().includes(searchCompany.toLowerCase())
  );

  const handleBackClick = () => {
    navigate('/adminDashboard');
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchLocation(location);
    setSelectedCompany('');
    setSearchCompany('');
    setCompanyStats({});
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company.name);
    setSearchCompany(company.name);
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
          text: 'Number of Employees'
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
  console.log('📊 Current Company Stats:', {
    roleDistribution: companyStats.roleDistribution,
    experienceDistribution: companyStats.experienceDistribution,
    hiringTrend: companyStats.hiringTrend,
    hasRoleData: companyStats.roleDistribution && Object.keys(companyStats.roleDistribution).length > 0,
    hasExperienceData: companyStats.experienceDistribution && Object.keys(companyStats.experienceDistribution).length > 0,
    hasHiringData: companyStats.hiringTrend && Object.keys(companyStats.hiringTrend).length > 0
  });

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company data...</p>
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
            Tamil Nadu Company Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights and employment metrics based on real user data from CareerBridge
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading company data...</p>
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
                        {allCompanies.length} companies available
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedLocation ? `Select Company in ${selectedLocation}` : 'Select Company'}
            </h3>
            {!selectedLocation ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-building text-4xl mb-3 text-gray-300"></i>
                <p>Please select a location first to view companies</p>
              </div>
            ) : (
              <>
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    placeholder={`Type to search companies in ${selectedLocation}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company, index) => (
                      <div
                        key={index}
                        onClick={() => handleCompanySelect(company)}
                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
                          selectedCompany === company.name ? 'bg-indigo-50 border-indigo-200' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <i className="fas fa-industry text-green-500 mr-3"></i>
                          <div>
                            <p className="font-medium text-gray-900">{company.name}</p>
                            <p className="text-sm text-gray-500">
                              {company.employeeCount || 0} employees • {company.currentEmployees || 0} current
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-building text-4xl mb-3 text-gray-300"></i>
                      <p>No companies found in {selectedLocation}</p>
                      <p className="text-sm">Users haven't submitted any company data yet</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Company Details - Show only when company is selected */}
        {selectedCompany && !loading && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedCompany}
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-indigo-500"></i>
                    {selectedLocation}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <i className="fas fa-chart-line mr-1"></i>
                    Company
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <i className="fas fa-users mr-1"></i>
                    {companyStats.totalEmployees || 0} Employees in Database
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Employees</p>
                    <p className="text-2xl font-bold">{companyStats.totalEmployees || 0}</p>
                  </div>
                  <i className="fas fa-users text-2xl opacity-80"></i>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Current Employees</p>
                    <p className="text-2xl font-bold">{companyStats.currentEmployees || 0}</p>
                  </div>
                  <i className="fas fa-user-check text-2xl opacity-80"></i>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avg Experience</p>
                    <p className="text-2xl font-bold">{companyStats.averageExperience || 0} yrs</p>
                  </div>
                  <i className="fas fa-chart-line text-2xl opacity-80"></i>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Growth Rate</p>
                    <p className="text-2xl font-bold">{companyStats.growthRate || 0}%</p>
                  </div>
                  <i className="fas fa-trending-up text-2xl opacity-80"></i>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Role Distribution
                  {companyStats.roleDistribution && Object.keys(companyStats.roleDistribution).length > 0 && (
                    <span className="text-sm font-normal text-green-600 ml-2">
                      ({Object.keys(companyStats.roleDistribution).length} roles)
                    </span>
                  )}
                </h3>
                <div className="h-80">
                  <Pie data={roleChartData} options={chartOptions} />
                </div>
                {companyStats.roleDistribution && Object.keys(companyStats.roleDistribution).length === 0 && (
                  <p className="text-center text-gray-500 mt-2">No role data available from user submissions</p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hiring Trend (Last 5 Years)
                  {companyStats.hiringTrend && Object.keys(companyStats.hiringTrend).length > 0 && (
                    <span className="text-sm font-normal text-green-600 ml-2">
                      (Real data)
                    </span>
                  )}
                </h3>
                <div className="h-80">
                  <Bar data={hiringTrendData} options={barChartOptions} />
                </div>
                {companyStats.hiringTrend && Object.keys(companyStats.hiringTrend).length === 0 && (
                  <p className="text-center text-gray-500 mt-2">No hiring trend data available from user submissions</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Experience Level Distribution
                  {companyStats.experienceDistribution && Object.keys(companyStats.experienceDistribution).length > 0 && (
                    <span className="text-sm font-normal text-green-600 ml-2">
                      ({Object.keys(companyStats.experienceDistribution).length} levels)
                    </span>
                  )}
                </h3>
                <div className="h-80">
                  <Doughnut data={experienceChartData} options={chartOptions} />
                </div>
                {companyStats.experienceDistribution && Object.keys(companyStats.experienceDistribution).length === 0 && (
                  <p className="text-center text-gray-500 mt-2">No experience data available from user submissions</p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Company Performance
                </h3>
                <div className="grid grid-cols-2 gap-6 h-80 items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {companyStats.performanceRating || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Overall Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {companyStats.marketShare || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Market Share</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center">
                <i className="fas fa-database text-blue-500 text-2xl mr-4"></i>
                <div>
                  <h4 className="text-lg font-semibold text-blue-900">Real Data Source</h4>
                  <p className="text-blue-700 text-sm">
                    Statistics are generated from actual job form submissions. 
                    {companyStats.roleDistribution && Object.keys(companyStats.roleDistribution).length > 0 ? 
                      " Showing real data from user submissions." : 
                      " Currently showing placeholder data as no users have submitted detailed information for this company yet."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No Company Selected State */}
        {!selectedCompany && !loading && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <i className="fas fa-building text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Company Selected</h3>
            <p className="text-gray-500">
              Please select a location and then choose a company to view detailed analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;