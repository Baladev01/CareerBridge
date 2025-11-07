package com.career.CareerBridge.service;

import com.career.CareerBridge.entity.EducationDetails;
import com.career.CareerBridge.repository.EducationDetailsRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EducationDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(EducationDetailsService.class);

    @Autowired
    private EducationDetailsRepository repository;

    private final Path fileStorageLocation;

    @Autowired
    private ObjectMapper objectMapper;

    public EducationDetailsService() {
        this.fileStorageLocation = Paths.get("uploads/education-documents").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            logger.info("Education upload directory created: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            logger.error("Could not create education upload directory: {}", ex.getMessage());
            throw new RuntimeException("Could not create education upload directory.", ex);
        }
    }

    // ✅ FIXED: Always create NEW record for POST /save
    public EducationDetails saveEducationDetails(EducationDetails details,
                                                 MultipartFile tenthMarksheet,
                                                 MultipartFile twelfthMarksheet,
                                                 Map<Integer, MultipartFile> activityCertificates) throws IOException {

        Long userId = details.getUserId();
        String degree = details.getDegree();
        String collegeName = details.getCollegeName();

        logger.info("Creating NEW education record for User: {}, Degree: {}, College: {}", 
                   userId, degree, collegeName);
        
        // ✅ ALWAYS CREATE NEW RECORD for POST /save (remove existing check)
        handleFileUploads(details, tenthMarksheet, twelfthMarksheet, activityCertificates);
        details.setCreatedAt(LocalDateTime.now());
        details.setUpdatedAt(LocalDateTime.now());
        
        EducationDetails saved = repository.save(details);
        logger.info("Created NEW education record ID: {}", saved.getId());
        return saved;
    }
    
    // ✅ Method for update (used by PUT /update)
    public EducationDetails updateEducationDetails(EducationDetails details) {
        try {
            logger.info("Updating education details for ID: {}", details.getId());
            
            // Check if the record exists
            Optional<EducationDetails> existingOpt = repository.findById(details.getId());
            
            if (existingOpt.isPresent()) {
                EducationDetails existing = existingOpt.get();
                
                // Update only the fields that are provided (not null)
                if (details.getCollegeName() != null) {
                    existing.setCollegeName(details.getCollegeName());
                }
                if (details.getDegree() != null) {
                    existing.setDegree(details.getDegree());
                }
                if (details.getSpecialization() != null) {
                    existing.setSpecialization(details.getSpecialization());
                }
                if (details.getUniversity() != null) {
                    existing.setUniversity(details.getUniversity());
                }
                if (details.getCgpa() != null) {
                    existing.setCgpa(details.getCgpa());
                }
                if (details.getPercentage() != null) {
                    existing.setPercentage(details.getPercentage());
                }
                if (details.getTenthSchool() != null) {
                    existing.setTenthSchool(details.getTenthSchool());
                }
                if (details.getTenthBoard() != null) {
                    existing.setTenthBoard(details.getTenthBoard());
                }
                if (details.getTenthPercentage() != null) {
                    existing.setTenthPercentage(details.getTenthPercentage());
                }
                if (details.getTenthYear() != null) {
                    existing.setTenthYear(details.getTenthYear());
                }
                if (details.getTwelfthSchool() != null) {
                    existing.setTwelfthSchool(details.getTwelfthSchool());
                }
                if (details.getTwelfthBoard() != null) {
                    existing.setTwelfthBoard(details.getTwelfthBoard());
                }
                if (details.getTwelfthStream() != null) {
                    existing.setTwelfthStream(details.getTwelfthStream());
                }
                if (details.getTwelfthPercentage() != null) {
                    existing.setTwelfthPercentage(details.getTwelfthPercentage());
                }
                if (details.getTwelfthYear() != null) {
                    existing.setTwelfthYear(details.getTwelfthYear());
                }
                if (details.getDepartment() != null) {
                    existing.setDepartment(details.getDepartment());
                }
                if (details.getRollNumber() != null) {
                    existing.setRollNumber(details.getRollNumber());
                }
                if (details.getStartDate() != null) {
                    existing.setStartDate(details.getStartDate());
                }
                if (details.getEndDate() != null) {
                    existing.setEndDate(details.getEndDate());
                }
                if (details.getCurrentlyStudying() != null) {
                    existing.setCurrentlyStudying(details.getCurrentlyStudying());
                }
                if (details.getSemester() != null) {
                    existing.setSemester(details.getSemester());
                }
                if (details.getSkills() != null) {
                    existing.setSkills(details.getSkills());
                }
                if (details.getAchievements() != null) {
                    existing.setAchievements(details.getAchievements());
                }
                if (details.getCollegeActivities() != null) {
                    existing.setCollegeActivities(details.getCollegeActivities());
                }
                if (details.getExtracurricular() != null) {
                    existing.setExtracurricular(details.getExtracurricular());
                }
                if (details.getProjects() != null) {
                    existing.setProjects(details.getProjects());
                }
                if (details.getAdditionalDegree() != null) {
                    existing.setAdditionalDegree(details.getAdditionalDegree());
                }
                if (details.getAdditionalCertifications() != null) {
                    existing.setAdditionalCertifications(details.getAdditionalCertifications());
                }
                
                // Update the timestamp
                existing.setUpdatedAt(LocalDateTime.now());
                
                // Save the updated entity
                EducationDetails updated = repository.save(existing);
                logger.info("Successfully updated education details for ID: {}", updated.getId());
                return updated;
            } else {
                logger.error("Education details not found for ID: {}", details.getId());
                throw new RuntimeException("Education details not found with ID: " + details.getId());
            }
        } catch (Exception e) {
            logger.error("Error updating education details for ID {}: {}", details.getId(), e.getMessage());
            throw new RuntimeException("Error updating education details: " + e.getMessage());
        }
    }

    private void handleFileUploads(EducationDetails details, 
                                  MultipartFile tenthMarksheet, 
                                  MultipartFile twelfthMarksheet,
                                  Map<Integer, MultipartFile> activityCertificates) throws IOException {
        if (tenthMarksheet != null && !tenthMarksheet.isEmpty()) {
            String tenthPath = storeFile(tenthMarksheet, "tenth_marksheet");
            details.setTenthMarksheetPath(tenthPath);
            logger.info("Stored 10th marksheet for user {}: {}", details.getUserId(), tenthPath);
        }
        if (twelfthMarksheet != null && !twelfthMarksheet.isEmpty()) {
            String twelfthPath = storeFile(twelfthMarksheet, "twelfth_marksheet");
            details.setTwelfthMarksheetPath(twelfthPath);
            logger.info("Stored 12th marksheet for user {}: {}", details.getUserId(), twelfthPath);
        }
        
        handleActivityCertificatesUpload(details, activityCertificates);
    }

    private void handleActivityCertificatesUpload(EducationDetails details, Map<Integer, MultipartFile> activityCertificates) throws IOException {
        if (activityCertificates != null && !activityCertificates.isEmpty() && details.getCollegeActivities() != null) {
            try {
                List<Map<String, Object>> activities = objectMapper.readValue(
                    details.getCollegeActivities(), new TypeReference<List<Map<String, Object>>>() {}
                );
                
                for (int i = 0; i < activities.size(); i++) {
                    if (activityCertificates.containsKey(i)) {
                        MultipartFile file = activityCertificates.get(i);
                        if (file != null && !file.isEmpty()) {
                            String certificatePath = storeFile(file, "activity_certificate");
                            activities.get(i).put("certificatePath", certificatePath);
                            logger.info("Stored activity certificate for activity {}: {}", i, certificatePath);
                        }
                    }
                }
                details.setCollegeActivities(objectMapper.writeValueAsString(activities));
            } catch (Exception e) {
                logger.error("Error processing activity certificates: {}", e.getMessage());
            }
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

    private void deleteFile(String fileName) {
        if (fileName != null && !fileName.trim().isEmpty()) {
            try {
                Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
                Files.deleteIfExists(filePath);
                logger.info("Deleted old file: {}", fileName);
            } catch (IOException e) {
                logger.error("Could not delete file: {}, Error: {}", fileName, e.getMessage());
            }
        }
    }

    public Optional<EducationDetails> getEducationDetailsByUserId(Long userId) {
        logger.info("Fetching education details for user ID: {}", userId);
        return repository.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<EducationDetails> getAllEducationDetailsByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }

    public Optional<EducationDetails> getEducationDetailsById(Integer id) {
        return repository.findById(id);
    }

    public List<EducationDetails> getAllEducationDetails() {
        return repository.findAll();
    }

    public Optional<EducationDetails> getEducationDetailsByUserIdAndDegreeAndCollege(Long userId, String degree, String collegeName) {
        return repository.findByUserIdAndDegreeAndCollegeName(userId, degree, collegeName);
    }
    
    public List<EducationDetails> getByCollegeName(String collegeName) {
        return repository.findByCollegeNameContainingIgnoreCase(collegeName);
    }
    
    public List<String> getAllUniqueColleges() {
        return repository.findDistinctCollegeNames();
    }
    
    public Map<String, Object> getCollegeStatistics(String collegeName) {
        List<EducationDetails> records = getByCollegeName(collegeName);
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalStudents", records.size());
        
        Map<String, Long> degreeDistribution = new HashMap<>();
        Map<String, Long> specializationDistribution = new HashMap<>();
        double totalCGPA = 0;
        int cgpaCount = 0;
        
        for (EducationDetails record : records) {
            if (record.getDegree() != null) {
                degreeDistribution.merge(record.getDegree(), 1L, Long::sum);
            }
            
            if (record.getSpecialization() != null) {
                specializationDistribution.merge(record.getSpecialization(), 1L, Long::sum);
            }
            
            if (record.getCgpa() != null) {
                totalCGPA += record.getCgpa();
                cgpaCount++;
            }
        }
        
        stats.put("degreeDistribution", degreeDistribution);
        stats.put("specializationDistribution", specializationDistribution);
        stats.put("averageCGPA", cgpaCount > 0 ? totalCGPA / cgpaCount : 0);
        stats.put("currentlyStudyingCount", records.stream()
                .filter(record -> record.getCurrentlyStudying() != null && record.getCurrentlyStudying())
                .count());
        
        return stats;
    }
    
    public Map<String, Object> getDashboardEducationStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            List<EducationDetails> allEducation = getAllEducationDetails();
            
            stats.put("totalStudents", allEducation.size());
            stats.put("uniqueColleges", getAllUniqueColleges().size());
            
            Map<String, Long> degreeDistribution = new HashMap<>();
            Map<String, Long> collegeDistribution = new HashMap<>();
            
            for (EducationDetails education : allEducation) {
                if (education.getDegree() != null) {
                    degreeDistribution.merge(education.getDegree(), 1L, Long::sum);
                }
                
                if (education.getCollegeName() != null) {
                    collegeDistribution.merge(education.getCollegeName(), 1L, Long::sum);
                }
            }
            
            stats.put("degreeDistribution", degreeDistribution);
            stats.put("collegeDistribution", collegeDistribution);
            stats.put("currentlyStudyingCount", allEducation.stream()
                    .filter(edu -> edu.getCurrentlyStudying() != null && edu.getCurrentlyStudying())
                    .count());
            
        } catch (Exception e) {
            logger.error("Error calculating education dashboard stats: {}", e.getMessage());
        }
        
        return stats;
    }

    public Map<String, Object> getCollegeDashboardData(String collegeName) {
        Map<String, Object> collegeData = new HashMap<>();
        
        try {
            List<EducationDetails> collegeStudents = getByCollegeName(collegeName);
            
            // Only show actual data, no mock data
            collegeData.put("collegeName", collegeName);
            collegeData.put("totalStudents", collegeStudents.size());
            collegeData.put("location", "Tamil Nadu"); // Default location
            
            Map<String, Long> degreeStats = new HashMap<>();
            Map<String, Long> specializationStats = new HashMap<>();
            double totalCGPA = 0;
            int cgpaCount = 0;
            int currentlyStudyingCount = 0;
            
            for (EducationDetails student : collegeStudents) {
                // Degree distribution from actual data
                if (student.getDegree() != null) {
                    degreeStats.merge(student.getDegree(), 1L, Long::sum);
                }
                
                // Specialization distribution from actual data
                if (student.getSpecialization() != null) {
                    specializationStats.merge(student.getSpecialization(), 1L, Long::sum);
                }
                
                // CGPA calculation from actual data
                if (student.getCgpa() != null) {
                    totalCGPA += student.getCgpa();
                    cgpaCount++;
                }
                
                // Currently studying count from actual data
                if (student.getCurrentlyStudying() != null && student.getCurrentlyStudying()) {
                    currentlyStudyingCount++;
                }
            }
            
            collegeData.put("degreeDistribution", degreeStats);
            collegeData.put("specializationDistribution", specializationStats);
            collegeData.put("averageCGPA", cgpaCount > 0 ? Math.round((totalCGPA / cgpaCount) * 100.0) / 100.0 : 0);
            collegeData.put("currentlyStudying", currentlyStudyingCount);
            
            // Activity statistics from ACTUAL college activities data
            Map<String, Integer> activityStats = calculateRealActivityStats(collegeStudents);
            collegeData.put("activityStats", activityStats);
            
            // Event statistics from ACTUAL achievements and projects
            Map<String, Integer> eventStats = calculateRealEventStats(collegeStudents);
            collegeData.put("eventStats", eventStats);
            collegeData.put("totalActivities", eventStats.values().stream().mapToInt(Integer::intValue).sum());
            
            // Performance rating based on ACTUAL data only
            double performanceRating = calculateRealCollegePerformance(collegeStudents);
            collegeData.put("performanceRating", Math.round(performanceRating));
            
        } catch (Exception e) {
            logger.error("Error getting college dashboard data for {}: {}", collegeName, e.getMessage());
            // Return empty data instead of mock data
            collegeData.put("totalStudents", 0);
            collegeData.put("averageCGPA", 0);
            collegeData.put("currentlyStudying", 0);
            collegeData.put("performanceRating", 0);
            collegeData.put("activityStats", new HashMap<>());
            collegeData.put("eventStats", new HashMap<>());
        }
        
        return collegeData;
    }

    private Map<String, Integer> calculateRealActivityStats(List<EducationDetails> students) {
        Map<String, Integer> activityStats = new HashMap<>();
        // Initialize with zeros
        activityStats.put("academic", 0);
        activityStats.put("sports", 0);
        activityStats.put("cultural", 0);
        activityStats.put("technical", 0);
        activityStats.put("social", 0);
        
        // Count activities from ACTUAL college_activities JSON data
        for (EducationDetails student : students) {
            if (student.getCollegeActivities() != null && !student.getCollegeActivities().isEmpty()) {
                try {
                    List<Map<String, Object>> activities = objectMapper.readValue(
                        student.getCollegeActivities(), 
                        new TypeReference<List<Map<String, Object>>>() {}
                    );
                    
                    for (Map<String, Object> activity : activities) {
                        String activityType = (String) activity.get("type");
                        if (activityType != null) {
                            switch (activityType.toLowerCase()) {
                                case "sports":
                                    activityStats.put("sports", activityStats.get("sports") + 1);
                                    break;
                                case "cultural":
                                    activityStats.put("cultural", activityStats.get("cultural") + 1);
                                    break;
                                case "technical":
                                    activityStats.put("technical", activityStats.get("technical") + 1);
                                    break;
                                case "social":
                                    activityStats.put("social", activityStats.get("social") + 1);
                                    break;
                                default:
                                    activityStats.put("academic", activityStats.get("academic") + 1);
                            }
                        } else {
                            // If no type specified, count as academic
                            activityStats.put("academic", activityStats.get("academic") + 1);
                        }
                    }
                } catch (Exception e) {
                    // If parsing fails, don't add any mock data
                    logger.debug("Could not parse activities for user {}", student.getUserId());
                }
            }
        }
        
        return activityStats;
    }

    private Map<String, Integer> calculateRealEventStats(List<EducationDetails> students) {
        Map<String, Integer> eventStats = new HashMap<>();
        // Initialize with zeros
        eventStats.put("workshops", 0);
        eventStats.put("seminars", 0);
        eventStats.put("conferences", 0);
        eventStats.put("competitions", 0);
        eventStats.put("festivals", 0);
        
        // Count events from ACTUAL student data
        for (EducationDetails student : students) {
            // Each student with achievements counts as competition participation
            if (student.getAchievements() != null && !student.getAchievements().isEmpty()) {
                eventStats.put("competitions", eventStats.get("competitions") + 1);
            }
            
            // Each student with projects counts as workshop participation
            if (student.getProjects() != null && !student.getProjects().isEmpty()) {
                eventStats.put("workshops", eventStats.get("workshops") + 1);
            }
            
            // Each student with extracurricular counts as festival participation
            if (student.getExtracurricular() != null && !student.getExtracurricular().isEmpty()) {
                eventStats.put("festivals", eventStats.get("festivals") + 1);
            }
        }
        
        return eventStats;
    }

    private double calculateRealCollegePerformance(List<EducationDetails> students) {
        if (students.isEmpty()) return 0;
        
        double rating = 0; // Start from zero
        
        // Base rating on student count
        if (students.size() >= 100) rating += 40;
        else if (students.size() >= 50) rating += 30;
        else if (students.size() >= 20) rating += 20;
        else if (students.size() >= 10) rating += 10;
        else rating += students.size(); // 1 point per student for small numbers
        
        // Rating based on average CGPA
        double avgCGPA = students.stream()
                .filter(s -> s.getCgpa() != null)
                .mapToDouble(EducationDetails::getCgpa)
                .average()
                .orElse(0);
        
        if (avgCGPA > 8.5) rating += 30;
        else if (avgCGPA > 7.5) rating += 20;
        else if (avgCGPA > 6.5) rating += 10;
        else if (avgCGPA > 0) rating += 5;
        
        // Rating based on currently studying ratio
        long currentStudents = students.stream()
                .filter(s -> s.getCurrentlyStudying() != null && s.getCurrentlyStudying())
                .count();
        double currentRatio = students.size() > 0 ? (double) currentStudents / students.size() : 0;
        
        if (currentRatio > 0.8) rating += 20;
        else if (currentRatio > 0.6) rating += 15;
        else if (currentRatio > 0.4) rating += 10;
        else if (currentRatio > 0.2) rating += 5;
        
        // Rating based on activities participation
        int totalActivities = students.stream()
                .mapToInt(s -> {
                    if (s.getCollegeActivities() != null && !s.getCollegeActivities().isEmpty()) {
                        try {
                            List<?> activities = objectMapper.readValue(s.getCollegeActivities(), List.class);
                            return activities.size();
                        } catch (Exception e) {
                            return 0;
                        }
                    }
                    return 0;
                })
                .sum();
        
        double activitiesPerStudent = students.size() > 0 ? (double) totalActivities / students.size() : 0;
        if (activitiesPerStudent > 3) rating += 10;
        else if (activitiesPerStudent > 2) rating += 7;
        else if (activitiesPerStudent > 1) rating += 5;
        else if (activitiesPerStudent > 0) rating += 2;
        
        return Math.min(rating, 100);
    }
    
    public Map<String, Object> getRealTimeCollegeStats(String collegeName) {
        List<EducationDetails> collegeStudents = getByCollegeName(collegeName);
        Map<String, Object> stats = new HashMap<>();
        
        // Real-time calculations
        stats.put("totalStudents", collegeStudents.size());
        stats.put("currentlyStudying", collegeStudents.stream()
                .filter(s -> s.getCurrentlyStudying() != null && s.getCurrentlyStudying())
                .count());
        
        // CGPA Statistics
        DoubleSummaryStatistics cgpaStats = collegeStudents.stream()
                .filter(s -> s.getCgpa() != null)
                .mapToDouble(EducationDetails::getCgpa)
                .summaryStatistics();
        
        stats.put("averageCGPA", cgpaStats.getAverage());
        stats.put("maxCGPA", cgpaStats.getMax());
        stats.put("minCGPA", cgpaStats.getMin());
        
        // Degree Distribution (Real-time from actual data)
        Map<String, Long> degreeDistribution = collegeStudents.stream()
                .filter(s -> s.getDegree() != null)
                .collect(Collectors.groupingBy(EducationDetails::getDegree, Collectors.counting()));
        stats.put("degreeDistribution", degreeDistribution);
        
        // Specialization Distribution
        Map<String, Long> specializationDistribution = collegeStudents.stream()
                .filter(s -> s.getSpecialization() != null)
                .collect(Collectors.groupingBy(EducationDetails::getSpecialization, Collectors.counting()));
        stats.put("specializationDistribution", specializationDistribution);
        
        // Activity Analysis from actual college activities data
        Map<String, Integer> activityStats = analyzeCollegeActivities(collegeStudents);
        stats.put("activityStats", activityStats);
        
        return stats;
    }
    
    private Map<String, Integer> analyzeCollegeActivities(List<EducationDetails> students) {
        Map<String, Integer> activityCounts = new HashMap<>();
        activityCounts.put("academic", 0);
        activityCounts.put("sports", 0);
        activityCounts.put("cultural", 0);
        activityCounts.put("technical", 0);
        activityCounts.put("social", 0);
        
        for (EducationDetails student : students) {
            if (student.getCollegeActivities() != null && !student.getCollegeActivities().isEmpty()) {
                try {
                    List<Map<String, Object>> activities = objectMapper.readValue(
                        student.getCollegeActivities(), 
                        new TypeReference<List<Map<String, Object>>>() {}
                    );
                    
                    for (Map<String, Object> activity : activities) {
                        String activityType = (String) activity.get("activityType");
                        if (activityType != null) {
                            activityCounts.merge(activityType.toLowerCase(), 1, Integer::sum);
                        }
                    }
                } catch (Exception e) {
                    logger.warn("Error parsing activities for user {}: {}", student.getUserId(), e.getMessage());
                }
            }
        }
        
        return activityCounts;
    }
    
    public List<Map<String, Object>> getAllCollegesWithStats() {
        List<String> collegeNames = getAllUniqueColleges();
        
        return collegeNames.stream().map(collegeName -> {
            Map<String, Object> collegeInfo = new HashMap<>();
            collegeInfo.put("name", collegeName);
            
            List<EducationDetails> students = getByCollegeName(collegeName);
            collegeInfo.put("studentCount", students.size());
            collegeInfo.put("currentStudents", students.stream()
                    .filter(s -> s.getCurrentlyStudying() != null && s.getCurrentlyStudying())
                    .count());
            
            // Calculate average CGPA
            double avgCGPA = students.stream()
                    .filter(s -> s.getCgpa() != null)
                    .mapToDouble(EducationDetails::getCgpa)
                    .average()
                    .orElse(0.0);
            collegeInfo.put("averageCGPA", Math.round(avgCGPA * 100.0) / 100.0);
            
            return collegeInfo;
        }).collect(Collectors.toList());
    }
}