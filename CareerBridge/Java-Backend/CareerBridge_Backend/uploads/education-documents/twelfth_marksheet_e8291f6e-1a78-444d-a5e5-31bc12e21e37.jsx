import React, { useState, useEffect } from 'react';
import { usePoints } from '../../context/PointsContext';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EducationDetailsForm = () => {
  const [formData, setFormData] = useState({
    tenthSchool: '',
    tenthBoard: '',
    tenthPercentage: '',
    tenthYear: '',
    twelfthSchool: '',
    twelfthBoard: '',
    twelfthStream: '',
    twelfthPercentage: '',
    twelfthYear: '',
    collegeName: '',
    degree: '',
    specialization: '',
    university: '',
    department: '',
    rollNumber: '',
    cgpa: '',
    percentage: '',
    startDate: '',
    endDate: '',
    currentlyStudying: false,
    semester: '',
    skills: '',
    achievements: '',
    collegeActivities: '',
    extracurricular: '',
    projects: '',
    additionalDegree: '',
    additionalCertifications: ''
  });
  
  const [files, setFiles] = useState({
    tenthMarksheet: null,
    twelfthMarksheet: null,
    activityCertificates: []
  });
  
  const [activities, setActivities] = useState([
    { activityName: '', description: '', certificate: null }
  ]);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { addPoints } = usePoints();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert('Please login first!');
      navigate('/loginform');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files: inputFiles } = e.target;
    
    if (type === 'file') {
      setFiles(prev => ({
        ...prev,
        [name]: inputFiles[0] || null
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index][field] = value;
    setActivities(updatedActivities);
  };

  const handleActivityCertificate = (index, file) => {
    const updatedActivities = [...activities];
    updatedActivities[index].certificate = file;
    setActivities(updatedActivities);
  };

  const addActivity = () => {
    setActivities([...activities, { activityName: '', description: '', certificate: null }]);
  };

  const removeActivity = (index) => {
    if (activities.length > 1) {
      const updatedActivities = activities.filter((_, i) => i !== index);
      setActivities(updatedActivities);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login first!');
      navigate('/loginform');
      return;
    }

    if (!formData.collegeName || !formData.degree || !formData.startDate) {
      alert('Please fill all required fields (*)');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();

      const educationData = {
        ...formData,
        userId: currentUser.id,
        tenthPercentage: formData.tenthPercentage ? parseFloat(formData.tenthPercentage) : null,
        twelfthPercentage: formData.twelfthPercentage ? parseFloat(formData.twelfthPercentage) : null,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
        percentage: formData.percentage ? parseFloat(formData.percentage) : null,
        tenthYear: formData.tenthYear ? parseInt(formData.tenthYear) : null,
        twelfthYear: formData.twelfthYear ? parseInt(formData.twelfthYear) : null,
        collegeActivities: JSON.stringify(activities.filter(a => a.activityName || a.description)),
        endDate: formData.currentlyStudying ? "" : formData.endDate,
        tenthMarksheet: undefined,
        twelfthMarksheet: undefined
      };

      formDataToSend.append('data', JSON.stringify(educationData));

      if (files.tenthMarksheet) {
        formDataToSend.append('tenthMarksheet', files.tenthMarksheet);
      }
      if (files.twelfthMarksheet) {
        formDataToSend.append('twelfthMarksheet', files.twelfthMarksheet);
      }

      activities.forEach((activity, index) => {
        if (activity.certificate) {
          formDataToSend.append(`activityCertificate${index}`, activity.certificate);
        }
      });

      const response = await api.post('/education/save', formDataToSend, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'User-ID': currentUser.id.toString()
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        }
      });

      if (response.data.success) {
        // ADD POINTS HERE - Education details completed
        const pointsAdded = addPoints(10, 'Education details completed');
        
        if (pointsAdded) {
          console.log('✅ 10 points added for education details');
        }
        
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        alert(response.data.message || "Error saving education details");
      }
    } catch (err) {
      console.error('❌ Full error:', err);
      let errorMessage = "Network or server error occurred: ";
      
      if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
        errorMessage += "Cannot connect to server. Make sure backend is running on port 8080.";
      } else if (err.response) {
        errorMessage += `${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage += "No response received from server.";
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      setFormData({
        tenthSchool: '',
        tenthBoard: '',
        tenthPercentage: '',
        tenthYear: '',
        twelfthSchool: '',
        twelfthBoard: '',
        twelfthStream: '',
        twelfthPercentage: '',
        twelfthYear: '',
        collegeName: '',
        degree: '',
        specialization: '',
        university: '',
        department: '',
        rollNumber: '',
        cgpa: '',
        percentage: '',
        startDate: '',
        endDate: '',
        currentlyStudying: false,
        semester: '',
        skills: '',
        achievements: '',
        collegeActivities: '',
        extracurricular: '',
        projects: '',
        additionalDegree: '',
        additionalCertifications: ''
      });
      setFiles({
        tenthMarksheet: null,
        twelfthMarksheet: null,
        activityCertificates: []
      });
      setActivities([{ activityName: '', description: '', certificate: null }]);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Education Details
            </h2>
            <p className="text-gray-600">Share your comprehensive educational background</p>
           
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
              ✅ Education details submitted successfully! +10 points added
            </div>
          )}

          {/* Upload Progress Bar */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading documents...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 10th Grade Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                10th Grade (SSC) Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    name="tenthSchool"
                    value={formData.tenthSchool}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Board
                  </label>
                  <input
                    type="text"
                    name="tenthBoard"
                    value={formData.tenthBoard}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., CBSE, State Board"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="tenthPercentage"
                    value={formData.tenthPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter percentage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year of Passing
                  </label>
                  <input
                    type="number"
                    name="tenthYear"
                    value={formData.tenthYear}
                    onChange={handleChange}
                    min="1950"
                    max="2030"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="YYYY"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    10th Marksheet (Optional)
                  </label>
                  <input
                    type="file"
                    name="tenthMarksheet"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>
            </div>

            {/* 12th Grade Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                12th Grade (HSC) Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    School/College Name
                  </label>
                  <input
                    type="text"
                    name="twelfthSchool"
                    value={formData.twelfthSchool}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter school/college name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Board
                  </label>
                  <input
                    type="text"
                    name="twelfthBoard"
                    value={formData.twelfthBoard}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., CBSE, State Board"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stream
                  </label>
                  <select
                    name="twelfthStream"
                    value={formData.twelfthStream}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="twelfthPercentage"
                    value={formData.twelfthPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter percentage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year of Passing
                  </label>
                  <input
                    type="number"
                    name="twelfthYear"
                    value={formData.twelfthYear}
                    onChange={handleChange}
                    min="1950"
                    max="2030"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="YYYY"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    12th Marksheet (Optional)
                  </label>
                  <input
                    type="file"
                    name="twelfthMarksheet"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              </div>
            </div>

            {/* College/University Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                College/University Details *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College/University Name *
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter college/university name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Degree/Course *
                  </label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Degree</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E.">B.E.</option>
                    <option value="B.Sc.">B.Sc.</option>
                    <option value="B.Com">B.Com</option>
                    <option value="B.A.">B.A.</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="M.Sc.">M.Sc.</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="Ph.D">Ph.D</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Computer Science, Mechanical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Affiliated university"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Department name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="College roll number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CGPA
                  </label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 8.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Overall percentage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.currentlyStudying ? 'Expected End Date' : 'End Date *'}
                  </label>
                  <input
                    type="month"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required={!formData.currentlyStudying}
                    disabled={formData.currentlyStudying}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Semester
                  </label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 6th Semester"
                  />
                </div>

                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="currentlyStudying"
                    checked={formData.currentlyStudying}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-semibold text-gray-700">
                    I am currently studying here
                  </label>
                </div>
              </div>
            </div>

            {/* Skills & Achievements */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Skills & Achievements
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Technical Skills
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="List your technical skills (e.g., Java, Python, React, SQL...)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Achievements & Awards
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Academic achievements, awards, scholarships..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Projects
                  </label>
                  <textarea
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Academic projects, research work..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Extracurricular Activities
                  </label>
                  <textarea
                    name="extracurricular"
                    value={formData.extracurricular}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Sports, clubs, volunteering, hobbies..."
                  />
                </div>
              </div>
            </div>

            {/* College Activities with Certificates */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                College Activities & Certificates
              </h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Activity Name
                        </label>
                        <input
                          type="text"
                          value={activity.activityName}
                          onChange={(e) => handleActivityChange(index, 'activityName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., Technical Fest, Sports Event"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Certificate (Optional)
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleActivityCertificate(index, e.target.files[0])}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={activity.description}
                        onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Describe your role and participation..."
                      />
                    </div>
                    {activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all duration-200"
                      >
                        Remove Activity
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addActivity}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-red-500 hover:text-red-600 transition-all duration-200"
                >
                  + Add Another Activity
                </button>
              </div>
            </div>

            {/* Additional Education */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Additional Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Degrees/Certifications
                  </label>
                  <textarea
                    name="additionalCertifications"
                    value={formData.additionalCertifications}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Online courses, certifications, workshops..."
                  />
                </div>
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
              {!isEditing && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
                >
                  🗑️ Clear Form
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {isEditing ? 'Update Education Details' : 'Submit Education Details'}
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

export default EducationDetailsForm;