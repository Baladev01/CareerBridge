import React, { useState, useEffect } from 'react';
import { usePoints } from '../../context/PointsContext';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FORM_POINTS } from '../../config/pointsConfig';

const JobDetailsForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    experience: '',
    employmentType: '',
    industry: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    salary: '',
    location: '',
    jobDescription: '',
    skillsUsed: [''],
    achievements: '',
    managerName: '',
    managerContact: '',
    hrContact: '',
    resume: null,
    offerLetter: null,
    experienceLetter: null,
    noticePeriod: '',
    preferredLocation: '',
    expectedSalary: '',
    reasonForLeaving: ''
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { addPoints } = usePoints();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Check if user is logged in and load existing data
  useEffect(() => {
    const initializeForm = async () => {
      if (!currentUser) {
        alert('Please login first!');
        navigate('/loginform');
        return;
      }

      try {
        console.log('🔄 Loading existing job data for User ID:', currentUser.id);
        
        const response = await api.get(`/job/user/${currentUser.id}`);
        
        if (response.data.success && response.data.data) {
          console.log('✅ Existing job data found:', response.data.data);
          setExistingData(response.data.data);
          
          // Pre-fill form with existing data
          const existingFormData = { ...response.data.data };
          
          // Parse skillsUsed from JSON string if needed
          if (existingFormData.skillsUsed && typeof existingFormData.skillsUsed === 'string') {
            try {
              existingFormData.skillsUsed = JSON.parse(existingFormData.skillsUsed);
            } catch (error) {
              console.log('Error parsing skillsUsed:', error);
              existingFormData.skillsUsed = [''];
            }
          }
          
          // Remove server-generated fields that shouldn't be in form
          delete existingFormData.id;
          delete existingFormData.createdAt;
          delete existingFormData.updatedAt;
          delete existingFormData.userId;
          
          setFormData(prev => ({
            ...prev,
            ...existingFormData
          }));

          // Store original data for comparison
          setOriginalData({
            ...existingFormData,
            resume: null,
            offerLetter: null,
            experienceLetter: null
          });
        } else {
          console.log('ℹ️ No existing job data found');
          setOriginalData({
            companyName: '',
            role: '',
            experience: '',
            employmentType: '',
            industry: '',
            startDate: '',
            endDate: '',
            currentlyWorking: false,
            salary: '',
            location: '',
            jobDescription: '',
            skillsUsed: [''],
            achievements: '',
            managerName: '',
            managerContact: '',
            hrContact: '',
            resume: null,
            offerLetter: null,
            experienceLetter: null,
            noticePeriod: '',
            preferredLocation: '',
            expectedSalary: '',
            reasonForLeaving: ''
          });
        }
      } catch (error) {
        console.log('ℹ️ No existing job data or error loading:', error.message);
        setOriginalData({
          companyName: '',
          role: '',
          experience: '',
          employmentType: '',
          industry: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          salary: '',
          location: '',
          jobDescription: '',
          skillsUsed: [''],
          achievements: '',
          managerName: '',
          managerContact: '',
          hrContact: '',
          resume: null,
          offerLetter: null,
          experienceLetter: null,
          noticePeriod: '',
          preferredLocation: '',
          expectedSalary: '',
          reasonForLeaving: ''
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [currentUser, navigate]);

  // Check for changes whenever formData changes
  useEffect(() => {
    if (originalData && !isLoading) {
      const hasFormChanged = checkFormChanges();
      setHasChanges(hasFormChanged);
    }
  }, [formData, originalData, isLoading]);

  const checkFormChanges = () => {
    if (!originalData) return false;

    // Compare all form fields with original data
    const fieldsToCompare = [
      'companyName', 'role', 'experience', 'employmentType', 'industry',
      'startDate', 'endDate', 'currentlyWorking', 'salary', 'location',
      'jobDescription', 'achievements', 'managerName', 'managerContact',
      'hrContact', 'noticePeriod', 'preferredLocation', 'expectedSalary',
      'reasonForLeaving'
    ];

    for (let field of fieldsToCompare) {
      const currentValue = formData[field] || '';
      const originalValue = originalData[field] || '';
      
      if (currentValue !== originalValue) {
        console.log(`🔄 Field changed: ${field}`, { original: originalValue, current: currentValue });
        return true;
      }
    }

    // Check skills array changes
    const currentSkills = formData.skillsUsed.filter(s => s && s.trim() !== '');
    const originalSkills = originalData.skillsUsed.filter(s => s && s.trim() !== '');
    
    if (currentSkills.length !== originalSkills.length) {
      console.log('🔄 Skills array length changed');
      return true;
    }

    for (let i = 0; i < currentSkills.length; i++) {
      if (currentSkills[i] !== originalSkills[i]) {
        console.log('🔄 Skills content changed');
        return true;
      }
    }

    // Check if files were added
    if ((formData.resume && !existingData?.resume) || 
        (formData.offerLetter && !existingData?.offerLetter) || 
        (formData.experienceLetter && !existingData?.experienceLetter)) {
      console.log('🉴 New files added');
      return true;
    }

    return false;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
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

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skillsUsed];
    updatedSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skillsUsed: updatedSkills
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skillsUsed: [...prev.skillsUsed, '']
    }));
  };

  const removeSkill = (index) => {
    if (formData.skillsUsed.length > 1) {
      const updatedSkills = formData.skillsUsed.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        skillsUsed: updatedSkills
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login first!');
      navigate('/loginform');
      return;
    }

    if (!formData.companyName || !formData.role || !formData.employmentType || 
        !formData.industry || !formData.experience || !formData.startDate || 
        !formData.location || !formData.jobDescription || !formData.resume) {
      alert('Please fill all required fields (*)');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();

      const jobData = {
        ...formData,
        userId: currentUser.id,
        experience: parseFloat(formData.experience) || 0,
        skillsUsed: JSON.stringify(formData.skillsUsed.filter(s => s && s.trim() !== '')),
        
        // FIX: Send null instead of empty string for dates
        startDate: formData.startDate || null,
        endDate: formData.currentlyWorking ? null : (formData.endDate || null),
        
        resume: undefined,
        offerLetter: undefined,
        experienceLetter: undefined
      };

      formDataToSend.append('data', JSON.stringify(jobData));

      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }
      if (formData.offerLetter) {
        formDataToSend.append('offerLetter', formData.offerLetter);
      }
      if (formData.experienceLetter) {
        formDataToSend.append('experienceLetter', formData.experienceLetter);
      }

      const response = await api.post('/job/save', formDataToSend, {
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
        // Update existing data state
        setExistingData(response.data.data);
        
        // 🎯 ADD POINTS ONLY IF USER MADE CHANGES
        if (hasChanges || !existingData) {
          const pointsConfig = FORM_POINTS.job;
          const pointsAdded = addPoints(pointsConfig.points, pointsConfig.reason);
          
          if (pointsAdded) {
            console.log(`✅ ${pointsConfig.points} points added for ${existingData ? 'updating' : 'submitting'} job details`);
            
            // Trigger notification event with config message
            const pointsEvent = new CustomEvent('pointsEarned', {
  detail: {

    reason: pointsConfig.reason,
    message: existingData 
      ? `Job details updated!`
      : pointsConfig.message.replace('+10 points', '').trim()
  }
});

            window.dispatchEvent(pointsEvent);
          }
        } else {
          console.log('ℹ️ No changes detected - no points awarded');
        }
        
        // Update original data to current state
        setOriginalData({ 
          ...formData,
          resume: null,
          offerLetter: null,
          experienceLetter: null
        });
        setHasChanges(false);
        
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/dashboard');
        }, 2000);
      } else {
        alert(response.data.message || "Error saving job details");
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

  // Show loading spinner while checking for existing data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {existingData ? 'Update Job Details' : 'Job Details'}
            </h2>
            <p className="text-gray-600">
              {existingData ? 'Update your comprehensive professional experience' : 'Share your comprehensive professional experience'}
            </p>
           
            {/* User Info Display */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Email:</strong> {currentUser.email}
                {hasChanges && (
                  <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    ✨ Changes detected - {FORM_POINTS.job.points} points on save!
                  </span>
                )}
                {!hasChanges && existingData && (
                  <span className="ml-4 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    ⚡ Make changes to earn {FORM_POINTS.job.points} points
                  </span>
                )}
                {!existingData && (
                  <span className="ml-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    🎯 Complete to earn {FORM_POINTS.job.points} points!
                  </span>
                )}
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl animate-pulse text-center">
              ✅ {existingData 
                ? (hasChanges 
                    ? `Job details updated!` 
                    : 'Job details saved! (No changes detected)'
                  )
                : `${FORM_POINTS.job.message} +${FORM_POINTS.job.points} points added`
              }
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
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Job Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Basic Job Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your role/position"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Remote">Remote</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Industry *
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., IT, Healthcare, Finance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter years of experience"
                  />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.currentlyWorking ? 'Expected End Date' : 'End Date *'}
                  </label>
                  <input
                    type="month"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required={!formData.currentlyWorking}
                    disabled={formData.currentlyWorking}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary (Annual)
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., ₹8,00,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter job location"
                  />
                </div>

                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="currentlyWorking"
                    checked={formData.currentlyWorking}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label className="ml-2 text-sm font-semibold text-gray-700">
                    I am currently working here
                  </label>
                </div>
              </div>
            </div>

            {/* Job Description & Skills */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Job Description & Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe your roles, responsibilities, and key contributions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills Used
                  </label>
                  <div className="space-y-3">
                    {formData.skillsUsed.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter skill used (e.g., React, Project Management)"
                        />
                        {formData.skillsUsed.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all duration-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSkill}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-200"
                    >
                      + Add Another Skill
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Key Achievements
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe your key achievements, projects completed, awards received..."
                  />
                </div>
              </div>
            </div>

            {/* References & Contacts */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                References & Contacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Manager's Name
                  </label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter manager's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Manager's Contact
                  </label>
                  <input
                    type="text"
                    name="managerContact"
                    value={formData.managerContact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Email or phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    HR Contact
                  </label>
                  <input
                    type="text"
                    name="hrContact"
                    value={formData.hrContact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="HR department contact information"
                  />
                </div>
              </div>
            </div>

            {/* Documents Upload */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Documents Upload
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume/CV *
                  </label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {existingData?.resume && !formData.resume && (
                    <p className="text-blue-600 text-sm mt-2">📄 Current resume: {existingData.resume}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Offer Letter (Optional)
                  </label>
                  <input
                    type="file"
                    name="offerLetter"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {existingData?.offerLetter && !formData.offerLetter && (
                    <p className="text-blue-600 text-sm mt-2">📄 Current offer letter: {existingData.offerLetter}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Letter (Optional)
                  </label>
                  <input
                    type="file"
                    name="experienceLetter"
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {existingData?.experienceLetter && !formData.experienceLetter && (
                    <p className="text-blue-600 text-sm mt-2">📄 Current experience letter: {existingData.experienceLetter}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notice Period
                  </label>
                  <input
                    type="text"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 30 days, 60 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Preferred work location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Expected salary for next role"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Leaving
                  </label>
                  <textarea
                    name="reasonForLeaving"
                    value={formData.reasonForLeaving}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Reason for leaving current/previous job"
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
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all fields?')) {
                    setFormData({
                      companyName: '',
                      role: '',
                      experience: '',
                      employmentType: '',
                      industry: '',
                      startDate: '',
                      endDate: '',
                      currentlyWorking: false,
                      salary: '',
                      location: '',
                      jobDescription: '',
                      skillsUsed: [''],
                      achievements: '',
                      managerName: '',
                      managerContact: '',
                      hrContact: '',
                      resume: null,
                      offerLetter: null,
                      experienceLetter: null,
                      noticePeriod: '',
                      preferredLocation: '',
                      expectedSalary: '',
                      reasonForLeaving: ''
                    });
                  }
                }}
                className="px-6 py-4 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                🗑️ Clear Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || (existingData && !hasChanges)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {existingData ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {existingData 
                      ? (hasChanges ? 'Update & Earn Points' : 'No Changes Made')
                      : 'Submit Job Details'
                    }
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

export default JobDetailsForm;