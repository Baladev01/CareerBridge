package com.career.CareerBridge.controller;

import com.career.CareerBridge.entity.EducationDetails;
import com.career.CareerBridge.entity.JobDetails;
import com.career.CareerBridge.service.EducationDetailsService;
import com.career.CareerBridge.service.JobDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private EducationDetailsService educationService;

    @Autowired
    private JobDetailsService jobService;

    @GetMapping("/overview")
    public ResponseEntity<?> getDashboardOverview() {
        try {
            logger.info("Fetching dashboard overview statistics");
            
            Map<String, Object> overview = new HashMap<>();
            
            // Education statistics - will be zero if no data
            var allEducation = educationService.getAllEducationDetails();
            overview.put("totalStudents", allEducation.size());
            overview.put("uniqueColleges", educationService.getAllUniqueColleges().size());
            
            // Job statistics - will be zero if no data
            var allJobs = jobService.getAllJobDetails();
            overview.put("totalEmployees", allJobs.size());
            overview.put("uniqueCompanies", jobService.getAllUniqueCompanies().size());
            overview.put("currentlyWorking", allJobs.stream()
                    .filter(job -> job.getCurrentlyWorking() != null && job.getCurrentlyWorking())
                    .count());
            
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
                        // Continue with next company
                    }
                }
            }
            
            // If we have very few companies, add some default ones from your existing data
            if (companyList.size() < 2) {
                logger.info("Very few companies found, adding default companies from existing data");
                
                // Add companies from your existing data
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
            
            // If we have very few colleges, ensure we return at least the ones we have
            if (collegeList.isEmpty() && colleges != null) {
                for (String college : colleges) {
                    Map<String, Object> collegeInfo = new HashMap<>();
                    collegeInfo.put("name", college);
                    collegeInfo.put("studentCount", 1); // Default count
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
    
    // Real-time college statistics
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
    
    // Real-time company statistics
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
    
    // Real-time overview with latest data
    @GetMapping("/realtime-overview")
    public ResponseEntity<?> getRealTimeOverview() {
        try {
            Map<String, Object> overview = new HashMap<>();
            
            // Real-time education stats
            List<EducationDetails> allEducation = educationService.getAllEducationDetails();
            overview.put("totalStudents", allEducation.size());
            overview.put("uniqueColleges", educationService.getAllUniqueColleges().size());
            overview.put("currentlyStudying", allEducation.stream()
                    .filter(e -> e.getCurrentlyStudying() != null && e.getCurrentlyStudying())
                    .count());
            
            // Real-time job stats
            List<JobDetails> allJobs = jobService.getAllJobDetails();
            overview.put("totalEmployees", allJobs.size());
            overview.put("uniqueCompanies", jobService.getAllUniqueCompanies().size());
            overview.put("currentlyWorking", allJobs.stream()
                    .filter(j -> j.getCurrentlyWorking() != null && j.getCurrentlyWorking())
                    .count());
            
            // Latest updates
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