package com.career.CareerBridge.controller;

import com.career.CareerBridge.entity.EducationDetails;
import com.career.CareerBridge.entity.JobDetails;
import com.career.CareerBridge.entity.User;
import com.career.CareerBridge.service.EducationDetailsService;
import com.career.CareerBridge.service.JobDetailsService;
import com.career.CareerBridge.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private EducationDetailsService educationService;

    @Autowired
    private JobDetailsService jobService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/overview")
    public ResponseEntity<?> getDashboardOverview() {
        try {
            logger.info("Fetching dashboard overview statistics");
            
            Map<String, Object> overview = new HashMap<>();
        
            var allEducation = educationService.getAllEducationDetails();
            overview.put("totalStudents", allEducation.size());
            overview.put("uniqueColleges", educationService.getAllUniqueColleges().size());
            
            var allJobs = jobService.getAllJobDetails();
            overview.put("totalEmployees", allJobs.size());
            overview.put("uniqueCompanies", jobService.getAllUniqueCompanies().size());
            overview.put("currentlyWorking", allJobs.stream()
                    .filter(job -> job.getCurrentlyWorking() != null && job.getCurrentlyWorking())
                    .count());
            
       
            long uniqueStartups = allJobs.stream()
                .map(JobDetails::getCompanyName)
                .filter(Objects::nonNull)
                .distinct()
                .count();
            
           
            if (uniqueStartups > 0) {
         
                long startupCount = jobService.getAllUniqueCompanies().stream()
                    .filter(companyName -> {
                        List<JobDetails> companyEmployees = jobService.getByCompanyName(companyName);
                        return companyEmployees.size() <= 50; 
                    })
                    .count();
                overview.put("uniqueStartups", startupCount);
            } else {
                overview.put("uniqueStartups", 0L);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", overview);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching dashboard overview: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new HashMap<>());
            errorResponse.put("message", "Error fetching dashboard overview: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


    @GetMapping("/education/all")
    public ResponseEntity<?> getAllEducationData() {
        try {
            logger.info("Fetching all education data for admin dashboard");
            
            List<EducationDetails> allEducation = educationService.getAllEducationDetails();
            
          
            List<Map<String, Object>> educationData = allEducation.stream().map(edu -> {
                Map<String, Object> data = new HashMap<>();
                
                // Education details
                data.put("id", edu.getId());
                data.put("collegeName", edu.getCollegeName());
                data.put("degree", edu.getDegree());
                data.put("specialization", edu.getSpecialization());
                data.put("university", edu.getUniversity());
                data.put("department", edu.getDepartment());
                data.put("rollNumber", edu.getRollNumber());
                data.put("cgpa", edu.getCgpa());
                data.put("percentage", edu.getPercentage());
                data.put("startDate", edu.getStartDate());
                data.put("endDate", edu.getEndDate());
                data.put("currentlyStudying", edu.getCurrentlyStudying());
                data.put("semester", edu.getSemester());
                data.put("skills", edu.getSkills());
                data.put("achievements", edu.getAchievements());
                data.put("extracurricular", edu.getExtracurricular());
                data.put("projects", edu.getProjects());
                data.put("additionalDegree", edu.getAdditionalDegree());
                data.put("additionalCertifications", edu.getAdditionalCertifications());
                
                // 10th details
                data.put("tenthSchool", edu.getTenthSchool());
                data.put("tenthBoard", edu.getTenthBoard());
                data.put("tenthPercentage", edu.getTenthPercentage());
                data.put("tenthYear", edu.getTenthYear());
                
                // 12th details
                data.put("twelfthSchool", edu.getTwelfthSchool());
                data.put("twelfthBoard", edu.getTwelfthBoard());
                data.put("twelfthStream", edu.getTwelfthStream());
                data.put("twelfthPercentage", edu.getTwelfthPercentage());
                data.put("twelfthYear", edu.getTwelfthYear());
                
                // User information
                User user = userService.getUserById(edu.getUserId());
                if (user != null) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("name", user.getFirstName() + " " + user.getLastName());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("phone", "");
                    // FIX: Add user creation date
                    userInfo.put("createdAt", user.getCreatedAt());
                    userInfo.put("updatedAt", user.getUpdatedAt());
                    data.put("user", userInfo);
                } else {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", edu.getUserId());
                    userInfo.put("name", "Unknown User");
                    userInfo.put("email", "No email available");
                    userInfo.put("phone", "");
                    userInfo.put("createdAt", edu.getCreatedAt()); // Fallback to education date
                    userInfo.put("updatedAt", edu.getUpdatedAt()); // Fallback to education date
                    data.put("user", userInfo);
                }
                
              
                data.put("createdAt", edu.getCreatedAt() != null ? edu.getCreatedAt() : LocalDateTime.now());
                data.put("updatedAt", edu.getUpdatedAt() != null ? edu.getUpdatedAt() : LocalDateTime.now());
                data.put("joinDate", edu.getCreatedAt() != null ? edu.getCreatedAt() : LocalDateTime.now());
                data.put("modifiedDate", edu.getUpdatedAt() != null ? edu.getUpdatedAt() : LocalDateTime.now());
                
                return data;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", educationData);
            response.put("count", educationData.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching all education data: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new ArrayList<>());
            errorResponse.put("message", "Error fetching education data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/job/all")
    public ResponseEntity<?> getAllJobData() {
        try {
            logger.info("Fetching all job data for admin dashboard");
            
            List<JobDetails> allJobs = jobService.getAllJobDetails();
            
        
            List<Map<String, Object>> jobData = allJobs.stream().map(job -> {
                Map<String, Object> data = new HashMap<>();
                
                // Job details
                data.put("id", job.getId());
                data.put("companyName", job.getCompanyName());
                data.put("role", job.getRole());
                data.put("experience", job.getExperience());
                data.put("employmentType", job.getEmploymentType());
                data.put("industry", job.getIndustry());
                data.put("startDate", job.getStartDate());
                data.put("endDate", job.getEndDate());
                data.put("currentlyWorking", job.getCurrentlyWorking());
                data.put("salary", job.getSalary());
                data.put("location", job.getLocation());
                data.put("jobDescription", job.getJobDescription());
                data.put("skillsUsed", job.getSkillsUsed());
                data.put("achievements", job.getAchievements());
                data.put("managerName", job.getManagerName());
                data.put("managerContact", job.getManagerContact());
                data.put("hrContact", job.getHrContact());
                data.put("noticePeriod", job.getNoticePeriod());
                data.put("preferredLocation", job.getPreferredLocation());
                data.put("expectedSalary", job.getExpectedSalary());
                data.put("reasonForLeaving", job.getReasonForLeaving());
                
                // User information
                User user = userService.getUserById(job.getUserId());
                if (user != null) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("name", user.getFirstName() + " " + user.getLastName());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("phone", "");
                    userInfo.put("createdAt", user.getCreatedAt());
                    userInfo.put("updatedAt", user.getUpdatedAt());
                    data.put("user", userInfo);
                } else {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", job.getUserId());
                    userInfo.put("name", "Unknown User");
                    userInfo.put("email", "No email available");
                    userInfo.put("phone", "");
                    userInfo.put("createdAt", job.getCreatedAt());
                    userInfo.put("updatedAt", job.getUpdatedAt());
                    data.put("user", userInfo);
                }
                
               
                data.put("createdAt", job.getCreatedAt() != null ? job.getCreatedAt() : LocalDateTime.now());
                data.put("updatedAt", job.getUpdatedAt() != null ? job.getUpdatedAt() : LocalDateTime.now());
                data.put("joinDate", job.getCreatedAt() != null ? job.getCreatedAt() : LocalDateTime.now());
                data.put("modifiedDate", job.getUpdatedAt() != null ? job.getUpdatedAt() : LocalDateTime.now());
                
                return data;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", jobData);
            response.put("count", jobData.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching all job data: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new ArrayList<>());
            errorResponse.put("message", "Error fetching job data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/students/all")
    public ResponseEntity<?> getAllStudents() {
        try {
            logger.info("Fetching all students data");
            
            List<EducationDetails> allEducation = educationService.getAllEducationDetails();
            
         
            List<Map<String, Object>> students = allEducation.stream().map(edu -> {
                Map<String, Object> student = new HashMap<>();
                
                // Student details from education form
                student.put("id", edu.getId());
                student.put("collegeName", edu.getCollegeName());
                student.put("degree", edu.getDegree());
                student.put("specialization", edu.getSpecialization());
                student.put("university", edu.getUniversity());
                student.put("department", edu.getDepartment());
                student.put("cgpa", edu.getCgpa());
                student.put("percentage", edu.getPercentage());
                student.put("currentlyStudying", edu.getCurrentlyStudying());
                student.put("semester", edu.getSemester());
                student.put("skills", edu.getSkills());
                
                // User information
                User user = userService.getUserById(edu.getUserId());
                if (user != null) {
                    student.put("name", user.getFirstName() + " " + user.getLastName());
                    student.put("email", user.getEmail());
                    student.put("phone", "");
                    student.put("userId", user.getId());
                } else {
                    student.put("name", "Unknown User");
                    student.put("email", "No email available");
                    student.put("phone", "");
                    student.put("userId", edu.getUserId());
                }
                
                student.put("location", edu.getUniversity() + ", " + edu.getCollegeName());
                student.put("createdAt", edu.getCreatedAt());
                
                return student;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", students);
            response.put("count", students.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching all students: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new ArrayList<>());
            errorResponse.put("message", "Error fetching students: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/employed/all")
    public ResponseEntity<?> getAllEmployed() {
        try {
            logger.info("Fetching all employed users data");
            
            List<JobDetails> allJobs = jobService.getAllJobDetails();
            
        
            List<Map<String, Object>> employed = allJobs.stream()
                .filter(job -> job.getCurrentlyWorking() != null && job.getCurrentlyWorking())
                .map(job -> {
                    Map<String, Object> employee = new HashMap<>();
                    
                    // Employment details
                    employee.put("id", job.getId());
                    employee.put("companyName", job.getCompanyName());
                    employee.put("role", job.getRole());
                    employee.put("experience", job.getExperience());
                    employee.put("employmentType", job.getEmploymentType());
                    employee.put("industry", job.getIndustry());
                    employee.put("salary", job.getSalary());
                    employee.put("location", job.getLocation());
                    employee.put("skillsUsed", job.getSkillsUsed());
                    employee.put("currentlyWorking", job.getCurrentlyWorking());
                    
                    // User information
                    User user = userService.getUserById(job.getUserId());
                    if (user != null) {
                        employee.put("name", user.getFirstName() + " " + user.getLastName());
                        employee.put("email", user.getEmail());
                        employee.put("phone", "");
                        employee.put("userId", user.getId());
                    } else {
                        employee.put("name", "Unknown User");
                        employee.put("email", "No email available");
                        employee.put("phone", "");
                        employee.put("userId", job.getUserId());
                    }
                    
                    employee.put("createdAt", job.getCreatedAt());
                    
                    return employee;
                }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", employed);
            response.put("count", employed.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching all employed users: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new ArrayList<>());
            errorResponse.put("message", "Error fetching employed users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/jobseekers/all")
    public ResponseEntity<?> getAllJobSeekers() {
        try {
            logger.info("Fetching all job seekers data");
            
            List<JobDetails> allJobs = jobService.getAllJobDetails();
            
         
            List<Map<String, Object>> jobSeekers = allJobs.stream()
                .filter(job -> job.getCurrentlyWorking() == null || !job.getCurrentlyWorking())
                .map(job -> {
                    Map<String, Object> seeker = new HashMap<>();
                    
                    // Job seeker details
                    seeker.put("id", job.getId());
                    seeker.put("companyName", job.getCompanyName()); // Previous company
                    seeker.put("role", job.getRole()); // Previous role
                    seeker.put("experience", job.getExperience());
                    seeker.put("industry", job.getIndustry());
                    seeker.put("preferredLocation", job.getPreferredLocation());
                    seeker.put("expectedSalary", job.getExpectedSalary());
                    seeker.put("noticePeriod", job.getNoticePeriod());
                    seeker.put("reasonForLeaving", job.getReasonForLeaving());
                    seeker.put("skillsUsed", job.getSkillsUsed());
                    seeker.put("currentlyWorking", job.getCurrentlyWorking());
                    
                    // User information
                    User user = userService.getUserById(job.getUserId());
                    if (user != null) {
                        seeker.put("name", user.getFirstName() + " " + user.getLastName());
                        seeker.put("email", user.getEmail());
                        seeker.put("phone", "");
                        seeker.put("userId", user.getId());
                    } else {
                        seeker.put("name", "Unknown User");
                        seeker.put("email", "No email available");
                        seeker.put("phone", "");
                        seeker.put("userId", job.getUserId());
                    }
                    
                    seeker.put("location", job.getPreferredLocation() != null ? 
                        job.getPreferredLocation() : job.getLocation());
                    seeker.put("createdAt", job.getCreatedAt());
                    
                    return seeker;
                }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", jobSeekers);
            response.put("count", jobSeekers.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching all job seekers: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new ArrayList<>());
            errorResponse.put("message", "Error fetching job seekers: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/colleges/comparison")
    public ResponseEntity<?> getCollegeComparison(@RequestParam List<String> collegeNames) {
        try {
            logger.info("Fetching comparison data for colleges: {}", collegeNames);
            
            Map<String, Object> comparison = new HashMap<>();
            
            for (String collegeName : collegeNames) {
                Map<String, Object> collegeStats = educationService.getCollegeStatistics(collegeName);
                comparison.put(collegeName, collegeStats);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", comparison);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching college comparison: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching college comparison: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/companies/comparison")
    public ResponseEntity<?> getCompanyComparison(@RequestParam List<String> companyNames) {
        try {
            logger.info("Fetching comparison data for companies: {}", companyNames);
            
            Map<String, Object> comparison = new HashMap<>();
            
            for (String companyName : companyNames) {
                Map<String, Object> companyStats = jobService.getCompanyStatistics(companyName);
                comparison.put(companyName, companyStats);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", comparison);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching company comparison: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching company comparison: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    
    @GetMapping("/education/stats")
    public ResponseEntity<?> getEducationDashboardStats() {
        try {
            logger.info("Fetching education dashboard statistics");
            
            Map<String, Object> educationStats = educationService.getDashboardEducationStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", educationStats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching education dashboard stats: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching education dashboard statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/job/stats")
    public ResponseEntity<?> getJobDashboardStats() {
        try {
            logger.info("Fetching job dashboard statistics");
            
            Map<String, Object> jobStats = jobService.getDashboardJobStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", jobStats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching job dashboard stats: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching job dashboard statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/college/{collegeName}/dashboard")
    public ResponseEntity<?> getCollegeDashboardData(@PathVariable String collegeName) {
        try {
            logger.info("Fetching dashboard data for college: {}", collegeName);
            
            Map<String, Object> collegeData = educationService.getCollegeDashboardData(collegeName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", collegeData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching college dashboard data: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching college dashboard data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


    @GetMapping("/company/{companyName}/dashboard")
    public ResponseEntity<?> getCompanyDashboardData(@PathVariable String companyName) {
        try {
            logger.info("Fetching dashboard data for company: {}", companyName);
            
            Map<String, Object> companyData = jobService.getCompanyDashboardData(companyName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", companyData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching company dashboard data: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error fetching company dashboard data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all-companies")
    public ResponseEntity<?> getAllCompaniesForDashboard() {
        try {
            logger.info("Fetching all companies for dashboard");
            
            List<String> companies = jobService.getAllUniqueCompanies();
            logger.info("Found {} companies in database", companies != null ? companies.size() : 0);
            
            List<Map<String, Object>> companyList = new ArrayList<>();
            
            if (companies != null && !companies.isEmpty()) {
                for (String company : companies) {
                    try {
                        Map<String, Object> companyInfo = new HashMap<>();
                        companyInfo.put("name", company);
                        
                        List<JobDetails> companyEmployees = jobService.getByCompanyName(company);
                        int employeeCount = companyEmployees != null ? companyEmployees.size() : 0;
                        long currentEmployees = companyEmployees != null ? 
                            companyEmployees.stream()
                                .filter(emp -> emp.getCurrentlyWorking() != null && emp.getCurrentlyWorking())
                                .count() : 0;
                        
                        companyInfo.put("employeeCount", employeeCount);
                        companyInfo.put("currentEmployees", currentEmployees);
                        
                        companyList.add(companyInfo);
                        
                        logger.info("Company: {}, Employees: {}, Current: {}", company, employeeCount, currentEmployees);
                    } catch (Exception e) {
                        logger.warn("Error processing company {}: {}", company, e.getMessage());

                    }
                }
            }
            
        
            if (companyList.size() < 2) {
                logger.info("Very few companies found, adding default companies from existing data");
                
             
                if (companies != null) {
                    for (String company : companies) {
                        if (!companyList.stream().anyMatch(c -> c.get("name").equals(company))) {
                            Map<String, Object> companyInfo = new HashMap<>();
                            companyInfo.put("name", company);
                            companyInfo.put("employeeCount", 1); // Default count
                            companyInfo.put("currentEmployees", 1);
                            companyList.add(companyInfo);
                        }
                    }
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", companyList);
            response.put("count", companyList.size());
            response.put("message", "Companies fetched successfully");
            
            logger.info("Returning {} companies", companyList.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching companies for dashboard: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new ArrayList<>());
            errorResponse.put("count", 0);
            errorResponse.put("message", "Error fetching companies: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all-colleges")
    public ResponseEntity<?> getAllCollegesForDashboard() {
        try {
            logger.info("Fetching all colleges for dashboard");
            
            List<String> colleges = educationService.getAllUniqueColleges();
            logger.info("Found {} colleges in database", colleges != null ? colleges.size() : 0);
            
            List<Map<String, Object>> collegeList = new ArrayList<>();
            
            if (colleges != null && !colleges.isEmpty()) {
                for (String college : colleges) {
                    try {
                        Map<String, Object> collegeInfo = new HashMap<>();
                        collegeInfo.put("name", college);
                        List<EducationDetails> collegeStudents = educationService.getByCollegeName(college);
                        int studentCount = collegeStudents != null ? collegeStudents.size() : 0;
                        collegeInfo.put("studentCount", studentCount);
                        collegeList.add(collegeInfo);
                        
                        logger.info("College: {}, Students: {}", college, studentCount);
                    } catch (Exception e) {
                        logger.warn("Error processing college {}: {}", college, e.getMessage());
                        // Continue with next college
                    }
                }
            }
            
          
            if (collegeList.isEmpty() && colleges != null) {
                for (String college : colleges) {
                    Map<String, Object> collegeInfo = new HashMap<>();
                    collegeInfo.put("name", college);
                    collegeInfo.put("studentCount", 1); 
                    collegeList.add(collegeInfo);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", collegeList);
            response.put("count", collegeList.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching colleges for dashboard: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("data", new ArrayList<>());
            errorResponse.put("count", 0);
            errorResponse.put("message", "Error fetching colleges: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
 
    @GetMapping("/college/{collegeName}/realtime-stats")
    public ResponseEntity<?> getRealTimeCollegeStats(@PathVariable String collegeName) {
        try {
            Map<String, Object> stats = educationService.getRealTimeCollegeStats(collegeName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            response.put("lastUpdated", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching real-time college stats for {}: {}", collegeName, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error fetching college statistics"));
        }
    }
    
   
    @GetMapping("/company/{companyName}/realtime-stats")
    public ResponseEntity<?> getRealTimeCompanyStats(@PathVariable String companyName) {
        try {
            Map<String, Object> stats = jobService.getRealTimeCompanyStats(companyName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            response.put("lastUpdated", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching real-time company stats for {}: {}", companyName, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error fetching company statistics"));
        }
    }
    
  
    @GetMapping("/realtime-overview")
    public ResponseEntity<?> getRealTimeOverview() {
        try {
            Map<String, Object> overview = new HashMap<>();
            
          
            List<EducationDetails> allEducation = educationService.getAllEducationDetails();
            overview.put("totalStudents", allEducation.size());
            overview.put("uniqueColleges", educationService.getAllUniqueColleges().size());
            overview.put("currentlyStudying", allEducation.stream()
                    .filter(e -> e.getCurrentlyStudying() != null && e.getCurrentlyStudying())
                    .count());
            
           
            List<JobDetails> allJobs = jobService.getAllJobDetails();
            overview.put("totalEmployees", allJobs.size());
            overview.put("uniqueCompanies", jobService.getAllUniqueCompanies().size());
            overview.put("currentlyWorking", allJobs.stream()
                    .filter(j -> j.getCurrentlyWorking() != null && j.getCurrentlyWorking())
                    .count());
            
        
            overview.put("lastEducationUpdate", allEducation.stream()
                    .map(EducationDetails::getUpdatedAt)
                    .filter(Objects::nonNull)
                    .max(LocalDateTime::compareTo)
                    .orElse(null));
            
            overview.put("lastJobUpdate", allJobs.stream()
                    .map(JobDetails::getUpdatedAt)
                    .filter(Objects::nonNull)
                    .max(LocalDateTime::compareTo)
                    .orElse(null));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", overview);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching real-time overview: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error fetching overview"));
        }
    }
}