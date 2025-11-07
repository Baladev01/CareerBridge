import React, { useState } from 'react';
import { usePoints } from '../../context/PointsContext';
import { useNavigate } from 'react-router-dom';

const JobDetailsForm = () => {
  const [formData, setFormData] = useState({
    // Basic Job Details
    companyName: '',
    role: '',
    experience: '',
    employmentType: '',
    industry: '',
    
    // Employment Details
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    salary: '',
    location: '',
    
    // Job Description
    jobDescription: '',
    skillsUsed: [''],
    achievements: '',
    
    // References & Contacts
    managerName: '',
    managerContact: '',
    hrContact: '',
    
    // Documents
    resume: null,
    offerLetter: null,
    experienceLetter: null,
    
    // Additional Information
    noticePeriod: '',
    preferredLocation: '',
    expectedSalary: '',
    reasonForLeaving: ''
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const { addPoints } = usePoints();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value
    });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skillsUsed];
    updatedSkills[index] = value;
    setFormData({
      ...formData,
      skillsUsed: updatedSkills
    });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skillsUsed: [...formData.skillsUsed, '']
    });
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.skillsUsed.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      skillsUsed: updatedSkills
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPoints(10);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Job Details</h2>
            <p className="text-gray-600">Share your comprehensive professional experience</p>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl animate-pulse text-center">
              ✅ Job details submitted successfully! +10 points added
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
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                Submit Job Details
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsForm;