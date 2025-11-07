

import React, { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const StudentEnrollForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Academic Information
    collegeCategory: '',
    collegeName: '',
    course: '',
    semester: '',
    enrollmentYear: '',
    
    // Educational Background
    highSchoolMarks: '',
    intermediateMarks: '',
    entranceExamScore: '',
    
    // Documents
    photo: null,
    marksheets: [],
    certificates: [],
    idProof: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // College Categories
  const collegeCategories = [
    { value: 'engineering', label: 'Engineering & Technology', colleges: [
      'IIT Delhi', 'IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore', 'SRM University'
    ]},
    { value: 'medical', label: 'Medical & Health Sciences', colleges: [
      'AIIMS Delhi', 'CMC Vellore', 'KMC Manipal', 'MAMC Delhi', 'JIPMER Puducherry'
    ]},
    { value: 'arts', label: 'Arts, Science & Commerce', colleges: [
      'St. Stephen\'s College', 'Loyola College', 'Christ University', 'St. Xavier\'s College', 'Hindu College'
    ]}
  ];

  const courses = {
    engineering: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics & Communication'],
    medical: ['MBBS', 'BDS', 'BPT', 'B.Pharm', 'Nursing'],
    arts: ['B.A. Economics', 'B.Com', 'B.Sc Physics', 'B.Sc Chemistry', 'B.A. English']
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      if (name === 'marksheets' || name === 'certificates') {
        setFormData(prev => ({
          ...prev,
          [name]: Array.from(files)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Information Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Academic Information Validation
    if (!formData.collegeCategory) newErrors.collegeCategory = 'College category is required';
    if (!formData.collegeName) newErrors.collegeName = 'College name is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.enrollmentYear) newErrors.enrollmentYear = 'Enrollment year is required';

    // Educational Background Validation
    if (!formData.highSchoolMarks) newErrors.highSchoolMarks = 'High school marks are required';
    if (!formData.intermediateMarks) newErrors.intermediateMarks = 'Intermediate marks are required';

    // Document Validation
    if (!formData.photo) newErrors.photo = 'Photo is required';
    if (formData.marksheets.length === 0) newErrors.marksheets = 'At least one marksheet is required';
    if (!formData.idProof) newErrors.idProof = 'ID proof is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      alert('Enrollment submitted successfully!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        collegeCategory: '',
        collegeName: '',
        course: '',
        semester: '',
        enrollmentYear: '',
        highSchoolMarks: '',
        intermediateMarks: '',
        entranceExamScore: '',
        photo: null,
        marksheets: [],
        certificates: [],
        idProof: null
      });
      
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentColleges = () => {
    const category = collegeCategories.find(cat => cat.value === formData.collegeCategory);
    return category ? category.colleges : [];
  };

  const getCurrentCourses = () => {
    return courses[formData.collegeCategory] || [];
  };

  return (
    <div className="min-h-screen flex  bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">

      <div className='fixed'>
             <Link to='/forms'><h1 className='text-2xl hover:text-blue-700 rounded-full hover:scale-110'><IoMdArrowRoundBack /></h1></Link>
       </div>


      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Student Registration</h1>
          <p className="text-lg text-gray-600">Complete all sections for successful enrollment</p>
          <div className="mt-4 bg-green-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
            <p className="font-semibold">🔷 You're not just a student, you're a story in the making.</p>
            <p className="text-sm">Empowering students with the skills and opportunities to turn education into employment.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-blue-200">
              <i className="fas fa-user text-blue-500 mr-3"></i>
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-green-200">
              <i className="fas fa-graduation-cap text-green-500 mr-3"></i>
              Academic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College Category *
                </label>
                <select
                  name="collegeCategory"
                  value={formData.collegeCategory}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.collegeCategory ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {collegeCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.collegeCategory && <p className="text-red-500 text-sm mt-1">{errors.collegeCategory}</p>}
              </div>

              {/* College Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College Name *
                </label>
                <select
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  disabled={!formData.collegeCategory}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.collegeName ? 'border-red-500' : 'border-gray-300'
                  } ${!formData.collegeCategory ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select College</option>
                  {getCurrentColleges().map(college => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                {errors.collegeName && <p className="text-red-500 text-sm mt-1">{errors.collegeName}</p>}
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  disabled={!formData.collegeCategory}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.course ? 'border-red-500' : 'border-gray-300'
                  } ${!formData.collegeCategory ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select Course</option>
                  {getCurrentCourses().map(course => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.semester ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Year *
                </label>
                <select
                  name="enrollmentYear"
                  value={formData.enrollmentYear}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.enrollmentYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Year</option>
                  {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.enrollmentYear && <p className="text-red-500 text-sm mt-1">{errors.enrollmentYear}</p>}
              </div>
            </div>
          </div>

          {/* Educational Background */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-yellow-200">
              <i className="fas fa-book text-yellow-500 mr-3"></i>
              Educational Background
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  High School (%) *
                </label>
                <input
                  type="number"
                  name="highSchoolMarks"
                  value={formData.highSchoolMarks}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.highSchoolMarks ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter percentage"
                />
                {errors.highSchoolMarks && <p className="text-red-500 text-sm mt-1">{errors.highSchoolMarks}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intermediate (%) *
                </label>
                <input
                  type="number"
                  name="intermediateMarks"
                  value={formData.intermediateMarks}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.intermediateMarks ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter percentage"
                />
                {errors.intermediateMarks && <p className="text-red-500 text-sm mt-1">{errors.intermediateMarks}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entrance Exam Score
                </label>
                <input
                  type="number"
                  name="entranceExamScore"
                  value={formData.entranceExamScore}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter score"
                />
              </div>
            </div>
          </div>

          {/* Documents Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-purple-200">
              <i className="fas fa-file-upload text-purple-500 mr-3"></i>
              Documents Upload
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Photo *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                  errors.photo ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="hidden"
                    id="photo"
                  />
                  <label htmlFor="photo" className="cursor-pointer">
                    <i className="fas fa-camera text-2xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">
                      {formData.photo ? formData.photo.name : 'Click to upload photo'}
                    </p>
                    <p className="text-xs text-gray-500">JPEG, PNG (Max 2MB)</p>
                  </label>
                </div>
                {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
              </div>

              {/* ID Proof Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Proof (Aadhar/Passport) *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                  errors.idProof ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <input
                    type="file"
                    name="idProof"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="idProof"
                  />
                  <label htmlFor="idProof" className="cursor-pointer">
                    <i className="fas fa-id-card text-2xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">
                      {formData.idProof ? formData.idProof.name : 'Click to upload ID proof'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPEG, PNG (Max 5MB)</p>
                  </label>
                </div>
                {errors.idProof && <p className="text-red-500 text-sm mt-1">{errors.idProof}</p>}
              </div>

              {/* Marksheets Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marksheets (All Semesters) *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                  errors.marksheets ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <input
                    type="file"
                    name="marksheets"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    id="marksheets"
                  />
                  <label htmlFor="marksheets" className="cursor-pointer">
                    <i className="fas fa-file-alt text-2xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">
                      {formData.marksheets.length > 0 
                        ? `${formData.marksheets.length} files selected` 
                        : 'Click to upload marksheets'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPEG, PNG (Multiple files allowed)</p>
                  </label>
                </div>
                {errors.marksheets && <p className="text-red-500 text-sm mt-1">{errors.marksheets}</p>}
              </div>

              {/* Certificates Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificates (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-all">
                  <input
                    type="file"
                    name="certificates"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    id="certificates"
                  />
                  <label htmlFor="certificates" className="cursor-pointer">
                    <i className="fas fa-award text-2xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">
                      {formData.certificates.length > 0 
                        ? `${formData.certificates.length} files selected` 
                        : 'Click to upload certificates'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPEG, PNG (Optional)</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-12 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Enrollment
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Your journey doesn't end with college — we guide you toward growth, skills, and your dream job.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEnrollForm;