package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.JobDetails;
import com.career.CareerBridge.repository.JobDetailsRepository;
import com.career.CareerBridge.service.PointsService;
import com.career.CareerBridge.dto.PointsResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(JobDetailsService.class);

    @Autowired
    private JobDetailsRepository repository;
    
    @Autowired
    private PointsService pointsService;
    
    @Autowired
    private ObjectMapper objectMapper;

    private final Path fileStorageLocation;

    public JobDetailsService() {
        this.fileStorageLocation = Paths.get("uploads/job-documents").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            logger.info("Upload directory created: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            logger.error("Could not create upload directory: {}", ex.getMessage());
            throw new RuntimeException("Could not create upload directory.", ex);
        }
    }

    @Transactional(noRollbackFor = {IOException.class, RuntimeException.class})
    public JobDetails saveJobDetails(JobDetails details,
            MultipartFile resume,
            MultipartFile offerLetter,
            MultipartFile experienceLetter) {

        Long userId = details.getUserId();
        String companyName = details.getCompanyName();
        String role = details.getRole();

        logger.info("Creating NEW job record for User: {}, Company: {}, Role: {}", 
                   userId, companyName, role);
        
        try {
            // Validate required fields
            validateJobDetails(details);
            
            // Handle file uploads (won't rollback transaction if this fails)
            handleFileUploads(details, resume, offerLetter, experienceLetter);
            
            details.setCreatedAt(LocalDateTime.now());
            details.setUpdatedAt(LocalDateTime.now());
            
            // Save to database
            JobDetails saved = repository.save(details);
            logger.info("Created NEW job record ID: {}", saved.getId());
            
            // Add points after successful save (separate transaction)
            try {
                PointsResponse pointsResponse = pointsService.addPoints(
                    userId, 
                    "job_form", 
                    "Completed job details form"
                );
                logger.info("🎉 Points added for job form: {}", pointsResponse.getMessage());
            } catch (Exception pointsError) {
                logger.warn("⚠️ Could not add points, but job saved: {}", pointsError.getMessage());
                // Don't rollback job save if points fail
            }
            
            return saved;
            
        } catch (Exception e) {
            logger.error("❌ Error saving job details: {}", e.getMessage());
            throw new RuntimeException("Failed to save job details: " + e.getMessage(), e);
        }
    }
    
    private void validateJobDetails(JobDetails details) {
        if (details.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (details.getCompanyName() == null || details.getCompanyName().trim().isEmpty()) {
            throw new IllegalArgumentException("Company name cannot be empty");
        }
        if (details.getRole() == null || details.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be empty");
        }
        logger.info("✅ Job details validation passed for user: {}", details.getUserId());
    }

    private void handleFileUploads(JobDetails details, 
                                  MultipartFile resume, 
                                  MultipartFile offerLetter, 
                                  MultipartFile experienceLetter) {
        try {
            if (resume != null && !resume.isEmpty()) {
                String resumePath = storeFile(resume, "resume");
                details.setResumePath(resumePath);
                logger.info("Stored resume for user {}: {}", details.getUserId(), resumePath);
            }
            if (offerLetter != null && !offerLetter.isEmpty()) {
                String offerPath = storeFile(offerLetter, "offer_letter");
                details.setOfferLetterPath(offerPath);
                logger.info("Stored offer letter for user {}: {}", details.getUserId(), offerPath);
            }
            if (experienceLetter != null && !experienceLetter.isEmpty()) {
                String expPath = storeFile(experienceLetter, "experience_letter");
                details.setExperienceLetterPath(expPath);
                logger.info("Stored experience letter for user {}: {}", details.getUserId(), expPath);
            }
        } catch (IOException e) {
            logger.warn("⚠️ File upload failed, but continuing with job save: {}", e.getMessage());
            // Don't throw exception - continue without files
        }
    }

    private String storeFile(MultipartFile file, String prefix) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = prefix + "_" + UUID.randomUUID() + fileExtension;
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        
        logger.info("Storing file: {} at {}", fileName, targetLocation);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return fileName;
    }

    public JobDetails updateJobDetails(JobDetails details) {
        return repository.save(details);
    }

    @Transactional(readOnly = true)
    public Optional<JobDetails> getJobDetailsByUserId(Long userId) {
        logger.info("Fetching job details for user ID: {}", userId);
        return repository.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<JobDetails> getAllJobDetailsByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<JobDetails> getJobDetailsById(Integer id) {
        return repository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<JobDetails> getAllJobDetails() {
        return repository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<JobDetails> getByCompanyName(String companyName) {
        return repository.findByCompanyNameContainingIgnoreCase(companyName);
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllUniqueCompanies() {
        return repository.findDistinctCompanyNames();
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getCompanyStatistics(String companyName) {
        List<JobDetails> records = getByCompanyName(companyName);
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalEmployees", records.size());
        stats.put("currentEmployees", records.stream()
                .filter(record -> record.getCurrentlyWorking() != null && record.getCurrentlyWorking())
                .count());
        
        // Role distribution
        Map<String, Long> roleDistribution = new HashMap<>();
        Map<String, Long> experienceDistribution = new HashMap<>();
        double totalExperience = 0;
        int experienceCount = 0;
        
        for (JobDetails record : records) {
            if (record.getRole() != null) {
                roleDistribution.merge(record.getRole(), 1L, Long::sum);
            }
            
            if (record.getExperience() != null) {
                totalExperience += record.getExperience();
                experienceCount++;
                String expLevel = getExperienceLevel(record.getExperience());
                experienceDistribution.merge(expLevel, 1L, Long::sum);
            }
        }
        
        stats.put("roleDistribution", roleDistribution);
        stats.put("experienceDistribution", experienceDistribution);
        stats.put("averageExperience", experienceCount > 0 ? totalExperience / experienceCount : 0);
        
        return stats;
    }
    
    private String getExperienceLevel(Double experience) {
        if (experience <= 2) return "Fresher (0-2 yrs)";
        if (experience <= 5) return "Mid-Level (3-5 yrs)";
        if (experience <= 10) return "Senior (6-10 yrs)";
        return "Executive (10+ yrs)";
    }

    
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardJobStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            List<JobDetails> allJobs = getAllJobDetails();
            
            stats.put("totalEmployees", allJobs.size());
            stats.put("uniqueCompanies", getAllUniqueCompanies().size());
            stats.put("currentlyWorking", allJobs.stream()
                    .filter(job -> job.getCurrentlyWorking() != null && job.getCurrentlyWorking())
                    .count());
            
            // Company distribution
            Map<String, Long> companyDistribution = new HashMap<>();
            Map<String, Long> roleDistribution = new HashMap<>();
            Map<String, Long> industryDistribution = new HashMap<>();
            
            for (JobDetails job : allJobs) {
                if (job.getCompanyName() != null) {
                    companyDistribution.merge(job.getCompanyName(), 1L, Long::sum);
                }
                if (job.getRole() != null) {
                    roleDistribution.merge(job.getRole(), 1L, Long::sum);
                }
                if (job.getIndustry() != null) {
                    industryDistribution.merge(job.getIndustry(), 1L, Long::sum);
                }
            }
            
            stats.put("companyDistribution", companyDistribution);
            stats.put("roleDistribution", roleDistribution);
            stats.put("industryDistribution", industryDistribution);
            
            double avgExperience = allJobs.stream()
                    .filter(job -> job.getExperience() != null)
                    .mapToDouble(JobDetails::getExperience)
                    .average()
                    .orElse(0);
            stats.put("averageExperience", Math.round(avgExperience * 100.0) / 100.0);
            
        } catch (Exception e) {
            logger.error("Error calculating job dashboard stats: {}", e.getMessage());
        }
        
        return stats;
    }


    public Map<String, Object> getCompanyDashboardData(String companyName) {
        Map<String, Object> companyData = new HashMap<>();
        
        try {
            List<JobDetails> companyEmployees = getByCompanyName(companyName);
            
            companyData.put("companyName", companyName);
            companyData.put("totalEmployees", companyEmployees.size());
            companyData.put("currentEmployees", companyEmployees.stream()
                    .filter(emp -> emp.getCurrentlyWorking() != null && emp.getCurrentlyWorking())
                    .count());
            
            Map<String, Long> roleStats = new HashMap<>();
            Map<String, Long> experienceStats = new HashMap<>();
            double totalExperience = 0;
            int experienceCount = 0;
            
            for (JobDetails employee : companyEmployees) {
                // Role distribution from ACTUAL data
                if (employee.getRole() != null) {
                    roleStats.merge(employee.getRole(), 1L, Long::sum);
                }
                
                // Experience calculation from ACTUAL data
                if (employee.getExperience() != null) {
                    totalExperience += employee.getExperience();
                    experienceCount++;
                    
                    // Experience level distribution
                    String expLevel = getRealExperienceLevel(employee.getExperience());
                    experienceStats.merge(expLevel, 1L, Long::sum);
                }
            }
            
            companyData.put("roleDistribution", roleStats);
            companyData.put("experienceDistribution", experienceStats);
            companyData.put("averageExperience", experienceCount > 0 ? 
                Math.round((totalExperience / experienceCount) * 100.0) / 100.0 : 0);
            
            // Skills analysis from ACTUAL skills_used data
            Map<String, Integer> skillStats = analyzeRealSkills(companyEmployees);
            companyData.put("skillStats", skillStats);
            
            // Hiring trend from ACTUAL start_date data
            Map<Integer, Integer> hiringTrend = calculateRealHiringTrend(companyEmployees);
            companyData.put("hiringTrend", hiringTrend);
            
            // Performance metrics based on ACTUAL data only
            double performanceRating = calculateRealCompanyPerformance(companyEmployees);
            companyData.put("performanceRating", Math.round(performanceRating));
            
            // Market share based on ACTUAL employee count
            double marketShare = calculateRealMarketShare(companyEmployees.size());
            companyData.put("marketShare", Math.round(marketShare * 100.0) / 100.0);
            
            // Growth rate from ACTUAL hiring trend
            double growthRate = calculateRealGrowthRate(hiringTrend);
            companyData.put("growthRate", Math.round(growthRate * 100.0) / 100.0);
            
        } catch (Exception e) {
            logger.error("Error getting company dashboard data for {}: {}", companyName, e.getMessage());
            // Return empty data instead of mock data
            companyData.put("totalEmployees", 0);
            companyData.put("currentEmployees", 0);
            companyData.put("averageExperience", 0);
            companyData.put("performanceRating", 0);
            companyData.put("marketShare", 0);
            companyData.put("growthRate", 0);
            companyData.put("roleDistribution", new HashMap<>());
            companyData.put("experienceDistribution", new HashMap<>());
            companyData.put("skillStats", new HashMap<>());
            companyData.put("hiringTrend", new HashMap<>());
        }
        
        return companyData;
    }

    
    private Map<String, Integer> analyzeRealSkills(List<JobDetails> employees) {
        Map<String, Integer> skillStats = new HashMap<>();
        
        for (JobDetails employee : employees) {
            if (employee.getSkillsUsed() != null && !employee.getSkillsUsed().isEmpty()) {
                try {
                    // Try to parse as JSON array
                    List<String> skills = objectMapper.readValue(employee.getSkillsUsed(), List.class);
                    for (String skill : skills) {
                        if (skill != null && !skill.toString().trim().isEmpty()) {
                            skillStats.merge(skill.toString().trim(), 1, Integer::sum);
                        }
                    }
                } catch (Exception e) {
                    // Fallback: treat as comma-separated string
                    String[] skills = employee.getSkillsUsed().split(",");
                    for (String skill : skills) {
                        String trimmedSkill = skill.trim();
                        if (!trimmedSkill.isEmpty()) {
                            skillStats.merge(trimmedSkill, 1, Integer::sum);
                        }
                    }
                }
            }
        }
        
        return skillStats;
    }
    
    private Map<Integer, Integer> calculateRealHiringTrend(List<JobDetails> employees) {
        Map<Integer, Integer> hiringTrend = new HashMap<>();
        int currentYear = LocalDateTime.now().getYear();
        
        // Initialize last 5 years with ZERO
        for (int i = 4; i >= 0; i--) {
            hiringTrend.put(currentYear - i, 0);
        }
        
        // Count actual hires by year from start_date
        for (JobDetails employee : employees) {
            if (employee.getStartDate() != null) {
                try {
                    String startDate = employee.getStartDate().toString();
                    int startYear = Integer.parseInt(startDate.substring(0, 4));
                    
                    if (hiringTrend.containsKey(startYear)) {
                        hiringTrend.put(startYear, hiringTrend.get(startYear) + 1);
                    }
                } catch (Exception e) {
                    logger.debug("Invalid start date format: {}", employee.getStartDate());
                }
            }
        }
        
        return hiringTrend;
    }


    private double calculateRealCompanyPerformance(List<JobDetails> employees) {
        if (employees.isEmpty()) return 0;
        
        double rating = 0; // Start from zero
        
        // Rating based on employee count
        if (employees.size() >= 100) rating += 40;
        else if (employees.size() >= 50) rating += 30;
        else if (employees.size() >= 20) rating += 20;
        else if (employees.size() >= 10) rating += 10;
        else rating += employees.size(); // 1 point per employee for small numbers
        
        // Rating based on current employees ratio
        long currentEmployees = employees.stream()
                .filter(emp -> emp.getCurrentlyWorking() != null && emp.getCurrentlyWorking())
                .count();
        double currentRatio = (double) currentEmployees / employees.size();
        
        if (currentRatio > 0.8) rating += 30;
        else if (currentRatio > 0.6) rating += 20;
        else if (currentRatio > 0.4) rating += 15;
        else if (currentRatio > 0.2) rating += 10;
        else rating += 5;
        
        // Rating based on average experience
        double avgExperience = employees.stream()
                .filter(emp -> emp.getExperience() != null)
                .mapToDouble(JobDetails::getExperience)
                .average()
                .orElse(0);
        
        if (avgExperience > 5) rating += 20;
        else if (avgExperience > 3) rating += 15;
        else if (avgExperience > 1) rating += 10;
        else if (avgExperience > 0) rating += 5;
        
        // Rating based on skills diversity
        int uniqueSkills = analyzeRealSkills(employees).size();
        if (uniqueSkills >= 10) rating += 10;
        else if (uniqueSkills >= 5) rating += 7;
        else if (uniqueSkills >= 3) rating += 5;
        else if (uniqueSkills > 0) rating += 2;
        
        return Math.min(rating, 100);
    }

    private double calculateRealMarketShare(int employeeCount) {
        // Simple calculation based on employee count
        // You can adjust this formula based on your industry
        if (employeeCount == 0) return 0;
        return (employeeCount / 1000.0) * 2.0; // Example: 100 employees = 0.2% market share
    }

    private double calculateRealGrowthRate(Map<Integer, Integer> hiringTrend) {
        List<Integer> years = new ArrayList<>(hiringTrend.keySet());
        Collections.sort(years);
        
        if (years.size() < 2) return 0;
        
        int currentYear = years.get(years.size() - 1);
        int previousYear = years.get(years.size() - 2);
        
        int currentHires = hiringTrend.get(currentYear);
        int previousHires = hiringTrend.get(previousYear);
        
        if (previousHires == 0) return currentHires > 0 ? 100 : 0;
        
        return ((double) (currentHires - previousHires) / previousHires) * 100;
    }

    private String getRealExperienceLevel(Double experience) {
        if (experience == null) return "Not Specified";
        if (experience <= 2) return "Fresher (0-2 yrs)";
        if (experience <= 5) return "Mid-Level (3-5 yrs)";
        if (experience <= 10) return "Senior (6-10 yrs)";
        return "Executive (10+ yrs)";
    }

   
    public Map<String, Object> getRealTimeCompanyStats(String companyName) {
        List<JobDetails> companyEmployees = getByCompanyName(companyName);
        Map<String, Object> stats = new HashMap<>();
        
        // Real-time employee statistics
        stats.put("totalEmployees", companyEmployees.size());
        stats.put("currentEmployees", companyEmployees.stream()
                .filter(e -> e.getCurrentlyWorking() != null && e.getCurrentlyWorking())
                .count());
        
        // Experience Statistics
        DoubleSummaryStatistics expStats = companyEmployees.stream()
                .filter(e -> e.getExperience() != null)
                .mapToDouble(JobDetails::getExperience)
                .summaryStatistics();
        
        stats.put("averageExperience", expStats.getAverage());
        stats.put("maxExperience", expStats.getMax());
        stats.put("minExperience", expStats.getMin());
        
        // Role Distribution (Real-time from actual data)
        Map<String, Long> roleDistribution = companyEmployees.stream()
                .filter(e -> e.getRole() != null)
                .collect(Collectors.groupingBy(JobDetails::getRole, Collectors.counting()));
        stats.put("roleDistribution", roleDistribution);
        
        // Skills Analysis from actual skills data
        Map<String, Integer> skillStats = analyzeCompanySkills(companyEmployees);
        stats.put("skillStats", skillStats);
        
        // Hiring Trend (Last 5 years)
        Map<Integer, Long> hiringTrend = calculateHiringTrend(companyEmployees);
        stats.put("hiringTrend", hiringTrend);
        
        return stats;
    }
    
    private Map<String, Integer> analyzeCompanySkills(List<JobDetails> employees) {
        Map<String, Integer> skillCounts = new HashMap<>();
        
        for (JobDetails employee : employees) {
            if (employee.getSkillsUsed() != null && !employee.getSkillsUsed().isEmpty()) {
                try {
                    // Try to parse as JSON array first
                    List<String> skills = objectMapper.readValue(employee.getSkillsUsed(), List.class);
                    skills.forEach(skill -> {
                        if (skill != null) {
                            skillCounts.merge(skill.toString().trim(), 1, Integer::sum);
                        }
                    });
                } catch (Exception e) {
                    // Fallback: treat as comma-separated string
                    String[] skills = employee.getSkillsUsed().split(",");
                    for (String skill : skills) {
                        String trimmedSkill = skill.trim();
                        if (!trimmedSkill.isEmpty()) {
                            skillCounts.merge(trimmedSkill, 1, Integer::sum);
                        }
                    }
                }
            }
        }
        
        return skillCounts;
    }
    
    private Map<Integer, Long> calculateHiringTrend(List<JobDetails> employees) {
        Map<Integer, Long> hiringByYear = new HashMap<>();
        int currentYear = LocalDateTime.now().getYear();
        
        // Initialize last 5 years
        for (int i = 4; i >= 0; i--) {
            hiringByYear.put(currentYear - i, 0L);
        }
        
        for (JobDetails employee : employees) {
            if (employee.getStartDate() != null) {
                try {
                    // Parse start date (assuming format like "2023-01-15")
                    LocalDate startDate = LocalDate.parse(employee.getStartDate());
                    int startYear = startDate.getYear();
                    
                    if (hiringByYear.containsKey(startYear)) {
                        hiringByYear.put(startYear, hiringByYear.get(startYear) + 1);
                    }
                } catch (Exception e) {
                    // Try alternative date parsing if needed
                    try {
                        int startYear = Integer.parseInt(employee.getStartDate().substring(0, 4));
                        if (hiringByYear.containsKey(startYear)) {
                            hiringByYear.put(startYear, hiringByYear.get(startYear) + 1);
                        }
                    } catch (Exception ex) {
                        logger.warn("Could not parse start date for user {}: {}", employee.getUserId(), employee.getStartDate());
                    }
                }
            }
        }
        
        return hiringByYear;
    }
    
    // Enhanced method to get all companies with real employee counts
    public List<Map<String, Object>> getAllCompaniesWithStats() {
        List<String> companyNames = getAllUniqueCompanies();
        
        return companyNames.stream().map(companyName -> {
            Map<String, Object> companyInfo = new HashMap<>();
            companyInfo.put("name", companyName);
            
            List<JobDetails> employees = getByCompanyName(companyName);
            companyInfo.put("employeeCount", employees.size());
            companyInfo.put("currentEmployees", employees.stream()
                    .filter(e -> e.getCurrentlyWorking() != null && e.getCurrentlyWorking())
                    .count());
            
            // Calculate average experience
            double avgExperience = employees.stream()
                    .filter(e -> e.getExperience() != null)
                    .mapToDouble(JobDetails::getExperience)
                    .average()
                    .orElse(0.0);
            companyInfo.put("averageExperience", Math.round(avgExperience * 100.0) / 100.0);
            
            return companyInfo;
        }).collect(Collectors.toList());
    }
}