import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardAPI = {
  // Overview statistics
  getOverview: () => api.get('/dashboard/overview'),
  
  // Education statistics
  getEducationStats: () => api.get('/dashboard/education/stats'),
  
  // Job statistics
  getJobStats: () => api.get('/dashboard/job/stats'),
  
  // All data endpoints for user details modal
  getAllEducationData: () => api.get('/dashboard/education/all'),
  getAllJobData: () => api.get('/dashboard/job/all'),
  getAllStudents: () => api.get('/dashboard/students/all'),
  getAllEmployed: () => api.get('/dashboard/employed/all'),
  getAllJobSeekers: () => api.get('/dashboard/jobseekers/all'),
  
  // Company and college data
  getAllCompanies: () => api.get('/dashboard/all-companies'),
  getAllColleges: () => api.get('/dashboard/all-colleges'),
  
  // Real-time data
  getRealTimeOverview: () => api.get('/dashboard/realtime-overview'),
  
  // College and company dashboards
  getCollegeDashboardData: (collegeName) => api.get(`/dashboard/college/${collegeName}/dashboard`),
  getCompanyDashboardData: (companyName) => api.get(`/dashboard/company/${companyName}/dashboard`),
  
  // Comparison endpoints
  getCollegeComparison: (collegeNames) => api.get('/dashboard/colleges/comparison', {
    params: { collegeNames: collegeNames.join(',') }
  }),
  getCompanyComparison: (companyNames) => api.get('/dashboard/companies/comparison', {
    params: { companyNames: companyNames.join(',') }
  })
};

// Job APIs
export const jobAPI = {
  getByCompany: (companyName) => api.get(`/job/company/${companyName}`),
  getAllCompanies: () => api.get('/job/companies'),
  getCompanyStats: (companyName) => api.get(`/job/company/${companyName}/stats`)
};

// Education APIs
export const educationAPI = {
  getByCollege: (collegeName) => api.get(`/education/college/${collegeName}`),
  getAllColleges: () => api.get('/education/colleges'),
  getCollegeStats: (collegeName) => api.get(`/education/college/${collegeName}/stats`)
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
    
    // Add User-ID header from currentUser
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.id) {
          config.headers['User-ID'] = user.id.toString();
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('🚨 Backend server not running on port 8080');
    }
    
    return Promise.reject(error);
  }
);

export default api;