-- -- =====================================================
-- - DATABASE SETUP
-- -- =====================================================
CREATE DATABASE CareerBridge;
USE CareerBridge;


-- Create the corrected users table
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    is_new_user     BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

select * from users;

DESCRIBE users;


-- =====================================================
-- PERSONAL DETAILS TABLE
-- =====================================================

CREATE TABLE personal_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    
    -- Personal Information
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    age INT,
    gender VARCHAR(50),
    marital_status VARCHAR(50),
    
    -- Address Information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    country VARCHAR(100),
    
    -- Identification Details
    aadhar_number VARCHAR(20),
    nationality VARCHAR(100),
    religion VARCHAR(100),
    category VARCHAR(50),
    blood_group VARCHAR(10),
    
    -- Family Information
    father_name VARCHAR(255),
    father_occupation VARCHAR(255),
    father_phone VARCHAR(20),
    mother_name VARCHAR(255),
    mother_occupation VARCHAR(255),
    mother_phone VARCHAR(20),
    guardian_name VARCHAR(255),
    guardian_relation VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_address TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(100),
    
    -- Documents
    profile_photo_path VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- =====================================================
-- JOB DETAILS TABLE
-- =====================================================
CREATE TABLE job_details (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    user_id                     BIGINT NOT NULL,

    -- Basic Job Details
    company_name                VARCHAR(255) NOT NULL,
    role                        VARCHAR(255) NOT NULL,
    experience                  DECIMAL(4,2),
    employment_type             ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote', 'Other'),
    industry                    VARCHAR(100),

    -- Employment Details
    start_date                  DATE,
    end_date                    DATE,
    currently_working           BOOLEAN DEFAULT FALSE,
    salary                      VARCHAR(100),
    location                    VARCHAR(255),

    -- Job Description
    job_description             TEXT,
    skills_used                 JSON,
    achievements                TEXT,

    -- References & Contacts
    manager_name                VARCHAR(255),
    manager_contact             VARCHAR(255),
    hr_contact                  VARCHAR(255),

    -- Documents
    resume_path                 VARCHAR(255),
    offer_letter_path           VARCHAR(255),
    experience_letter_path      VARCHAR(255),

    -- Additional Information
    notice_period               VARCHAR(50),
    preferred_location          VARCHAR(255),
    expected_salary             VARCHAR(100),
    reason_for_leaving          TEXT,

    -- Timestamps
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_company (company_name),
    INDEX idx_role (role)
);

-- =====================================================
-- EDUCATION DETAILS TABLE
-- =====================================================
CREATE TABLE education_details (
    id                          INT AUTO_INCREMENT PRIMARY KEY,
    user_id                     BIGINT NOT NULL,

    -- 10th details
    tenth_school                VARCHAR(255),
    tenth_board                 VARCHAR(100),
    tenth_percentage            DECIMAL(5,2),
    tenth_year                  YEAR,
    tenth_marksheet             VARCHAR(255),

    -- 12th details
    twelfth_school              VARCHAR(255),
    twelfth_board               VARCHAR(100),
    twelfth_stream              VARCHAR(50),
    twelfth_percentage          DECIMAL(5,2),
    twelfth_year                YEAR,
    twelfth_marksheet           VARCHAR(255),

    -- College/University details
    college_name                VARCHAR(255) NOT NULL,
    degree                      VARCHAR(100) NOT NULL,
    specialization              VARCHAR(100),
    university                  VARCHAR(255),
    department                  VARCHAR(100),
    roll_number                 VARCHAR(50),
    cgpa                        DECIMAL(4,2),
    percentage                  DECIMAL(5,2),
    start_date                  DATE NOT NULL,
    end_date                    DATE,
    currently_studying          BOOLEAN DEFAULT FALSE,
    semester                    VARCHAR(20),

    -- Skills & Achievements
    skills                      TEXT,
    achievements                TEXT,
    projects                    TEXT,
    extracurricular             TEXT,

    -- College Activities & Certificates (JSON storing array of activities)
    college_activities          JSON,

    -- Additional Education
    additional_certifications   TEXT,

    -- Timestamps
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- =====================================================
-- USER POINTS TABLE (Gamification)
-- =====================================================
CREATE TABLE user_points (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    points          INT DEFAULT 0,
    level           INT DEFAULT 1,
    last_updated    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- USER POINTS TABLE (Gamification)
CREATE TABLE user_points (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE,
    points          INT DEFAULT 0,
    level           INT DEFAULT 1,
    last_updated    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_points (points DESC)
);

-- POINTS HISTORY TABLE
CREATE TABLE points_history (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    points_earned   INT NOT NULL,
    activity_type   VARCHAR(100) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_activity_type (activity_type)
);

CREATE TABLE IF NOT EXISTS bank_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_holder VARCHAR(255) NOT NULL,
    account_number VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    points_used INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    bank_details TEXT,
    upi_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    transaction_id VARCHAR(255) UNIQUE,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- SAMPLE QUERY: USER FULL PROFILE JOIN
-- =====================================================
SELECT 
    u.id,
    u.email,
    pd.name,
    pd.phone,
    pd.city,
    pd.state,
    jd.company_name,
    jd.role,
    jd.experience,
    ed.college_name,
    ed.degree,
    ed.specialization,
    up.points,
    up.level
FROM users u
LEFT JOIN personal_details pd ON u.id = pd.user_id
LEFT JOIN job_details jd ON u.id = jd.user_id
LEFT JOIN education_details ed ON u.id = ed.user_id
LEFT JOIN user_points up ON u.id = up.user_id
WHERE u.id = 1;

-- =====================================================
-- BASIC CHECK QUERIES
-- =====================================================
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM personal_details;
SELECT * FROM job_details;
SELECT * FROM education_details;
SELECT * FROM user_points;
SELECT * FROM points_history;
SELECT * FROM admins;
SELECT * FROM withdrawals;
SELECT * FROM bank_accounts;

INSERT INTO withdrawals (user_id, amount, points_used, payment_method, bank_details, upi_id, status, transaction_id) VALUES
(1, 500.00, 500, 'BANK_TRANSFER', 'SBI A/C: 12345678901, IFSC: SBIN0000123', NULL, 'COMPLETED', 'TXN10001'),
(1, 300.00, 300, 'UPI', NULL, 'rajesh.kumar@okhdfcbank', 'PENDING', 'TXN10002'),
(2, 250.00, 250, 'BANK_TRANSFER', 'Canara Bank A/C: 23456789012, IFSC: CNRB0000789', NULL, 'COMPLETED', 'TXN10003'),
(3, 400.00, 400, 'BANK_TRANSFER', 'HDFC Bank A/C: 34567890123, IFSC: HDFC0000345', NULL, 'COMPLETED', 'TXN10004'),
(4, 600.00, 600, 'UPI', NULL, 'deepa.raman@okicici', 'COMPLETED', 'TXN10005'),
(5, 200.00, 200, 'BANK_TRANSFER', 'Axis Bank A/C: 56789012345, IFSC: UTIB0000890', NULL, 'FAILED', 'TXN10006'),
(5, 200.00, 200, 'BANK_TRANSFER', 'Axis Bank A/C: 56789012345, IFSC: UTIB0000890', NULL, 'COMPLETED', 'TXN10007'),
(6, 350.00, 350, 'UPI', NULL, 'lakshmi.krishnan@okaxis', 'PENDING', 'TXN10008'),
(7, 150.00, 150, 'BANK_TRANSFER', 'PNB A/C: 78901234567, IFSC: PUNB0000456', NULL, 'COMPLETED', 'TXN10009'),
(8, 450.00, 450, 'BANK_TRANSFER', 'Union Bank A/C: 89012345678, IFSC: UBIN0000789', NULL, 'COMPLETED', 'TXN10010'),
(9, 300.00, 300, 'UPI', NULL, 'karthik.srinivasan@okhdfcbank', 'COMPLETED', 'TXN10011'),
(10, 800.00, 800, 'BANK_TRANSFER', 'Central Bank A/C: 11223344556, IFSC: CBIN0000345', NULL, 'COMPLETED', 'TXN10012'),
(11, 250.00, 250, 'BANK_TRANSFER', 'IOB A/C: 22334455667, IFSC: IOBA0000678', NULL, 'PENDING', 'TXN10013'),
(12, 400.00, 400, 'UPI', NULL, 'shweta.menon@okaxis', 'COMPLETED', 'TXN10014'),
(13, 550.00, 550, 'BANK_TRANSFER', 'Yes Bank A/C: 44556677889, IFSC: YESB0000123', NULL, 'COMPLETED', 'TXN10015'),
(14, 300.00, 300, 'BANK_TRANSFER', 'Kotak Bank A/C: 55667788990, IFSC: KKBK0000456', NULL, 'FAILED', 'TXN10016'),
(14, 300.00, 300, 'UPI', NULL, 'meena.subramanian@okkotak', 'COMPLETED', 'TXN10017'),
(15, 200.00, 200, 'BANK_TRANSFER', 'Federal Bank A/C: 66778899001, IFSC: FDRL0000789', NULL, 'COMPLETED', 'TXN10018'),
(16, 450.00, 450, 'UPI', NULL, 'pooja.reddy@oksbi', 'PENDING', 'TXN10019'),
(17, 350.00, 350, 'BANK_TRANSFER', 'KVB A/C: 88990011223, IFSC: KVBL0000345', NULL, 'COMPLETED', 'TXN10020'),
(18, 650.00, 650, 'BANK_TRANSFER', 'CUB A/C: 99001112233, IFSC: CIUB0000678', NULL, 'COMPLETED', 'TXN10021'),
(19, 280.00, 280, 'UPI', NULL, 'aravind.joshi@okhdfcbank', 'COMPLETED', 'TXN10022'),
(20, 700.00, 700, 'BANK_TRANSFER', 'LVB A/C: 12131415161, IFSC: LAVB0000123', NULL, 'COMPLETED', 'TXN10023');     

INSERT INTO bank_accounts (user_id, bank_name, account_holder, account_number, ifsc_code, is_default) VALUES
(1, 'State Bank of India', 'Rajesh Kumar', '12345678901', 'SBIN0000123', TRUE),
(1, 'Indian Bank', 'Rajesh Kumar', '98765432109', 'IDIB0000456', FALSE),
(2, 'Canara Bank', 'Priya Sundaram', '23456789012', 'CNRB0000789', TRUE),
(3, 'HDFC Bank', 'Arun Venkatesh', '34567890123', 'HDFC0000345', TRUE),
(4, 'ICICI Bank', 'Deepa Raman', '45678901234', 'ICIC0000678', TRUE),
(5, 'Axis Bank', 'Suresh Gopal', '56789012345', 'UTIB0000890', TRUE),
(6, 'Bank of Baroda', 'Lakshmi Krishnan', '67890123456', 'BARB0000123', TRUE),
(7, 'Punjab National Bank', 'Mohan Raj', '78901234567', 'PUNB0000456', TRUE),
(8, 'Union Bank of India', 'Anjali Nair', '89012345678', 'UBIN0000789', TRUE),
(9, 'Bank of India', 'Karthik Srinivasan', '90123456789', 'BKID0000123', TRUE),
(10, 'Central Bank of India', 'Divya Iyer', '11223344556', 'CBIN0000345', TRUE),
(11, 'Indian Overseas Bank', 'Vikram Chandran', '22334455667', 'IOBA0000678', TRUE),
(12, 'IDBI Bank', 'Shweta Menon', '33445566778', 'IBKL0000890', TRUE),
(13, 'Yes Bank', 'Harish Pillai', '44556677889', 'YESB0000123', TRUE),
(14, 'Kotak Mahindra Bank', 'Meena Subramanian', '55667788990', 'KKBK0000456', TRUE),
(15, 'Federal Bank', 'Ravi Shankar', '66778899001', 'FDRL0000789', TRUE),
(16, 'South Indian Bank', 'Pooja Reddy', '77889900112', 'SIBL0000123', TRUE),
(17, 'Karur Vysya Bank', 'Sanjay Bose', '88990011223', 'KVBL0000345', TRUE),
(18, 'City Union Bank', 'Nandini Gupta', '99001112233', 'CIUB0000678', TRUE),
(19, 'Tamilnad Mercantile Bank', 'Aravind Joshi', '10111213141', 'TMBL0000890', TRUE),
(20, 'Lakshmi Vilas Bank', 'Swathi Patel', '12131415161', 'LAVB0000123', TRUE);


INSERT INTO points_history (user_id, points_earned, activity_type, description) VALUES
(1, 100, 'PROFILE_COMPLETION', 'Completed personal profile'),
(1, 200, 'EDUCATION_ADDED', 'Added education details'),
(1, 150, 'JOB_ADDED', 'Added job experience'),
(1, 500, 'SKILLS_VERIFIED', 'Skills verification completed'),
(1, 300, 'REFERRAL_BONUS', 'Referred a friend'),
(2, 100, 'PROFILE_COMPLETION', 'Completed personal profile'),
(2, 200, 'EDUCATION_ADDED', 'Added education details'),
(2, 150, 'JOB_ADDED', 'Added job experience'),
(2, 350, 'SKILLS_VERIFIED', 'Skills verification completed'),
(2, 180, 'DAILY_LOGIN', '7-day login streak'),
(3, 100, 'PROFILE_COMPLETION', 'Completed personal profile'),
(3, 200, 'EDUCATION_ADDED', 'Added education details'),
(3, 150, 'JOB_ADDED', 'Added job experience'),
(3, 300, 'SKILLS_VERIFIED', 'Skills verification completed');


INSERT INTO user_points (user_id, points, level) VALUES
(1, 1250, 3),
(2, 980, 2),
(3, 750, 2),
(4, 1500, 3),
(5, 620, 2),
(6, 1100, 3),
(7, 480, 1),
(8, 1350, 3),
(9, 890, 2),
(10, 2100, 4),
(11, 720, 2),
(12, 1250, 3),
(13, 1680, 3),
(14, 950, 2),
(15, 580, 1),
(16, 1400, 3),
(17, 1120, 3),
(18, 1950, 4),
(19, 830, 2),
(20, 1750, 4);

INSERT INTO job_details (user_id, company_name, role, experience, employment_type, industry, start_date, end_date, currently_working, salary, location, job_description, skills_used, achievements) VALUES
(1, 'TCS', 'Software Developer', 2.5, 'Full-time', 'IT', '2021-07-01', NULL, TRUE, '600000', 'Chennai', 'Developing web applications using Java and Spring Boot', '["Java", "Spring Boot", "SQL", "JavaScript"]', 'Employee of the Month - Jan 2023'),
(2, 'Deloitte', 'Audit Assistant', 1.8, 'Full-time', 'Accounting', '2021-08-15', NULL, TRUE, '550000', 'Coimbatore', 'Assisting in financial audits and compliance', '["Accounting", "Auditing", "Excel", "Tally"]', 'Successfully completed 20+ client audits'),
(3, 'State Bank', 'Clerk', 3.2, 'Full-time', 'Banking', '2019-09-01', NULL, TRUE, '480000', 'Madurai', 'Customer service and banking operations', '["Customer Service", "Banking Operations", "MS Office"]', 'Best Customer Service Award 2022'),
(4, 'Infosys', 'System Engineer', 0.0, 'Full-time', 'IT', '2023-07-01', NULL, TRUE, '450000', 'Bangalore', 'Software development and testing', '["Java", "Python", "Testing"]', 'Fresh recruit with excellent academic record'),
(5, 'Marketing Pro', 'Digital Marketer', 2.0, 'Full-time', 'Marketing', '2020-07-01', '2022-06-30', FALSE, '420000', 'Salem', 'Digital marketing campaigns and SEO', '["SEO", "Social Media", "Google Ads"]', 'Increased website traffic by 150%'),
(6, 'Intel', 'Hardware Engineer', 1.5, 'Full-time', 'Electronics', '2022-08-01', NULL, TRUE, '650000', 'Bangalore', 'Hardware design and testing', '["Circuit Design", "Embedded Systems", "IoT"]', 'Patented a new circuit design'),
(7, 'Content Writers Inc', 'Content Writer', 3.5, 'Freelance', 'Writing', '2019-07-01', NULL, TRUE, '360000', 'Vellore', 'Content writing and editing', '["Content Writing", "Editing", "SEO"]', 'Published 500+ articles'),
(8, 'L&T Construction', 'Site Engineer', 0.0, 'Full-time', 'Construction', '2023-07-01', NULL, TRUE, '520000', 'Chennai', 'Site supervision and project management', '["AutoCAD", "Project Management", "Site Supervision"]', 'Fresh engineering graduate'),
(9, 'HDFC Bank', 'Relationship Manager', 2.8, 'Full-time', 'Banking', '2020-09-01', NULL, TRUE, '580000', 'Kanyakumari', 'Client relationship and financial products', '["Relationship Management", "Banking Products", "Sales"]', 'Top performer in Q4 2022'),
(10, 'Google', 'Data Scientist', 1.2, 'Full-time', 'IT', '2021-09-01', NULL, TRUE, '1200000', 'Hyderabad', 'Machine learning and data analysis', '["Python", "Machine Learning", "Data Analysis"]', 'Developed successful prediction model'),
(11, 'Toyota', 'Production Engineer', 3.0, 'Full-time', 'Automobile', '2020-07-01', NULL, TRUE, '620000', 'Chennai', 'Production line management', '["CAD/CAM", "Production Planning", "Quality Control"]', 'Improved production efficiency by 15%'),
(12, 'Wipro', 'HR Executive', 0.0, 'Full-time', 'HR', '2023-07-01', NULL, TRUE, '480000', 'Coimbatore', 'Recruitment and employee engagement', '["Recruitment", "Employee Engagement", "HRMS"]', 'Campus recruitment coordinator'),
(13, 'Amazon', 'Marketing Manager', 2.5, 'Full-time', 'E-commerce', '2021-07-01', NULL, TRUE, '850000', 'Bangalore', 'Digital marketing strategies', '["Digital Marketing", "Strategy", "Analytics"]', 'Increased sales by 40%'),
(14, 'BHEL', 'Electrical Engineer', 1.8, 'Full-time', 'Power', '2022-07-01', NULL, TRUE, '580000', 'Trichy', 'Electrical systems maintenance', '["Electrical Systems", "MATLAB", "Maintenance"]', 'Reduced downtime by 25%'),
(15, 'State Archives', 'Research Assistant', 3.8, 'Part-time', 'Research', '2019-08-01', NULL, TRUE, '300000', 'Salem', 'Historical research and documentation', '["Research", "Documentation", "Archival Studies"]', 'Published research paper'),
(16, 'Biocon', 'Lab Technician', 0.0, 'Full-time', 'Biotechnology', '2023-07-01', NULL, TRUE, '450000', 'Bangalore', 'Laboratory testing and research', '["Lab Techniques", "Molecular Biology", "Research"]', 'Fresh biotech graduate'),
(17, 'KPMG', 'Tax Consultant', 2.2, 'Full-time', 'Consulting', '2020-08-01', NULL, TRUE, '720000', 'Chennai', 'Tax planning and compliance', '["Taxation", "Accounting", "Consulting"]', 'Managed 50+ client portfolios'),
(18, 'ISRO', 'Research Scientist', 1.5, 'Full-time', 'Research', '2021-09-01', NULL, TRUE, '780000', 'Bangalore', 'Space research and development', '["Research", "Physics", "Data Analysis"]', 'Contributed to satellite project'),
(19, 'Flipkart', 'Operations Manager', 3.5, 'Full-time', 'E-commerce', '2019-07-01', NULL, TRUE, '680000', 'Chennai', 'Supply chain and logistics', '["Supply Chain", "Logistics", "Operations"]', 'Improved delivery efficiency by 30%'),
(20, 'Microsoft', 'AI Engineer', 0.0, 'Full-time', 'IT', '2023-07-01', NULL, TRUE, '950000', 'Hyderabad', 'Artificial intelligence development', '["AI", "Machine Learning", "Python"]', 'Fresh AI specialist');


INSERT INTO education_details (user_id, tenth_school, tenth_board, tenth_percentage, tenth_year, twelfth_school, twelfth_board, twelfth_stream, twelfth_percentage, twelfth_year, college_name, degree, specialization, university, cgpa, percentage, start_date, end_date, currently_studying, skills, achievements) VALUES
(1, 'Chennai Public School', 'State Board', 87.5, 2015, 'Chennai Higher Secondary', 'State Board', 'Science', 89.2, 2017, 'Anna University', 'B.Tech', 'Computer Science', 'Anna University', 8.9, 85.5, '2017-06-01', '2021-05-31', FALSE, 'Java, Python, SQL, Web Development', 'University Topper in Final Year'),
(2, 'Coimbatore Central School', 'CBSE', 92.3, 2016, 'Coimbatore CBSE School', 'CBSE', 'Commerce', 88.7, 2018, 'PSG College of Technology', 'B.Com', 'Accounting', 'Bharathiar University', 9.1, 87.8, '2018-06-01', '2021-05-31', FALSE, 'Tally, Excel, Accounting, Taxation', 'Best Outgoing Student 2021'),
(3, 'Madurai Model School', 'State Board', 85.6, 2014, 'Madurai Higher Secondary', 'State Board', 'Science', 82.4, 2016, 'Thiagarajar College', 'B.Sc', 'Mathematics', 'Madurai Kamaraj University', 8.2, 80.5, '2016-06-01', '2019-05-31', FALSE, 'Statistics, Calculus, Data Analysis', 'Mathematics Olympiad Winner'),
(4, 'Trichy Central School', 'CBSE', 89.8, 2017, 'Trichy CBSE School', 'CBSE', 'Science', 91.2, 2019, 'National College', 'B.Tech', 'Information Technology', 'Anna University', 9.3, 89.7, '2019-06-01', '2023-05-31', TRUE, 'JavaScript, React, Node.js, MongoDB', 'Hackathon Winner 2022'),
(5, 'Salem Public School', 'State Board', 78.9, 2015, 'Salem Higher Secondary', 'State Board', 'Commerce', 81.5, 2017, 'Government College', 'BBA', 'Marketing', 'Periyar University', 7.8, 76.4, '2017-06-01', '2020-05-31', FALSE, 'Digital Marketing, SEO, Social Media', 'Marketing Club President'),
(6, 'Erode Model School', 'CBSE', 84.2, 2016, 'Erode CBSE School', 'CBSE', 'Science', 86.7, 2018, 'Kongu Engineering College', 'B.Tech', 'Electronics', 'Anna University', 8.7, 84.3, '2018-06-01', '2022-05-31', FALSE, 'Embedded Systems, IoT, Circuit Design', 'Electronics Project Award'),
(7, 'Vellore Central School', 'State Board', 79.5, 2014, 'Vellore Higher Secondary', 'State Board', 'Arts', 77.8, 2016, 'VIT University', 'B.A', 'English Literature', 'Vellore Institute of Technology', 8.0, 78.9, '2016-06-01', '2019-05-31', FALSE, 'Content Writing, Editing, Communication', 'Literary Club Head'),
(8, 'Tirunelveli Public School', 'CBSE', 91.2, 2017, 'Tirunelveli CBSE School', 'CBSE', 'Science', 93.5, 2019, 'Manonmaniam Sundaranar University', 'B.Tech', 'Civil Engineering', 'Anna University', 9.4, 90.8, '2019-06-01', '2023-05-31', TRUE, 'AutoCAD, Structural Design, Project Management', 'Best Project Award 2022'),
(9, 'Kanyakumari Central School', 'State Board', 86.7, 2015, 'Kanyakumari Higher Secondary', 'State Board', 'Commerce', 84.3, 2017, 'Scott Christian College', 'B.Com', 'Finance', 'Manonmaniam Sundaranar University', 8.5, 82.1, '2017-06-01', '2020-05-31', FALSE, 'Financial Analysis, Investment Banking, Excel', 'Finance Quiz Winner'),
(10, 'Chennai International School', 'CBSE', 94.1, 2016, 'Chennai Global School', 'CBSE', 'Science', 95.3, 2018, 'Loyola College', 'B.Sc', 'Computer Science', 'University of Madras', 9.6, 92.8, '2018-06-01', '2021-05-31', FALSE, 'AI, Machine Learning, Python, R', 'Research Paper Published'),
(11, 'Coimbatore Public School', 'State Board', 82.4, 2014, 'Coimbatore Higher Secondary', 'State Board', 'Science', 85.1, 2016, 'Sri Krishna College', 'B.Tech', 'Mechanical Engineering', 'Anna University', 8.3, 81.7, '2016-06-01', '2020-05-31', FALSE, 'CAD/CAM, Thermodynamics, Manufacturing', 'Robotics Club President'),
(12, 'Coimbatore Model School', 'CBSE', 88.9, 2017, 'Coimbatore Central School', 'CBSE', 'Commerce', 87.6, 2019, 'GRD College', 'BBA', 'Human Resources', 'Bharathiar University', 8.8, 85.9, '2019-06-01', '2023-05-31', TRUE, 'Recruitment, Training, HR Analytics', 'HR Club Coordinator'),
(13, 'Madurai Central School', 'State Board', 83.7, 2015, 'Madurai Public School', 'State Board', 'Science', 80.9, 2017, 'Thiagarajar School of Management', 'MBA', 'Marketing', 'Anna University', 8.6, 84.2, '2019-06-01', '2021-05-31', FALSE, 'Strategic Marketing, Brand Management', 'Placement Coordinator'),
(14, 'Trichy Public School', 'CBSE', 90.5, 2016, 'Trichy Model School', 'CBSE', 'Science', 92.1, 2018, 'Jamal Mohamed College', 'B.Tech', 'Electrical Engineering', 'Anna University', 9.2, 88.7, '2018-06-01', '2022-05-31', FALSE, 'Power Systems, Control Systems, MATLAB', 'Technical Fest Organizer'),
(15, 'Salem Central School', 'State Board', 76.8, 2014, 'Salem Higher Secondary', 'State Board', 'Arts', 74.5, 2016, 'Government Arts College', 'B.A', 'History', 'Periyar University', 7.5, 73.8, '2016-06-01', '2019-05-31', FALSE, 'Research, Documentation, Archival Studies', 'History Society President'),
(16, 'Erode Public School', 'CBSE', 87.3, 2017, 'Erode Central School', 'CBSE', 'Science', 89.8, 2019, 'Bannari Amman Institute', 'B.Tech', 'Biotechnology', 'Anna University', 8.9, 86.4, '2019-06-01', '2023-05-31', TRUE, 'Molecular Biology, Genetics, Lab Techniques', 'Research Intern at Biotech Firm'),
(17, 'Vellore Model School', 'State Board', 81.6, 2015, 'Vellore Public School', 'State Board', 'Commerce', 83.2, 2017, 'Christ University', 'B.Com', 'Professional Accounting', 'Christ University', 8.4, 82.7, '2017-06-01', '2020-05-31', FALSE, 'Auditing, Taxation, Financial Reporting', 'CA Foundation Completed'),
(18, 'Tirunelveli Central School', 'CBSE', 89.4, 2016, 'Tirunelveli Model School', 'CBSE', 'Science', 91.7, 2018, 'St. Xavier''s College', 'B.Sc', 'Physics', 'University of Madras', 9.0, 87.9, '2018-06-01', '2021-05-31', FALSE, 'Quantum Mechanics, Astrophysics, Research', 'Science Exhibition Winner'),
(19, 'Kanyakumari Public School', 'State Board', 85.1, 2014, 'Kanyakumari Higher Secondary', 'State Board', 'Commerce', 82.8, 2016, 'Nesamony Memorial College', 'BBA', 'Operations', 'Manonmaniam Sundaranar University', 8.1, 79.6, '2016-06-01', '2019-05-31', FALSE, 'Supply Chain, Logistics, Process Optimization', 'Operations Head - College Fest'),
(20, 'Chennai Public School', 'CBSE', 92.8, 2017, 'Chennai International', 'CBSE', 'Science', 94.2, 2019, 'SRM University', 'B.Tech', 'Artificial Intelligence', 'SRM University', 9.5, 91.3, '2019-06-01', '2023-05-31', TRUE, 'Deep Learning, NLP, Computer Vision', 'AI Research Project Lead');

INSERT INTO personal_details (user_id, name, email, phone, date_of_birth, age, gender, marital_status, address, city, state, pincode, country, aadhar_number, nationality, religion, category, blood_group, father_name, father_occupation, father_phone, mother_name, mother_occupation, mother_phone, emergency_contact_name, emergency_contact_phone, emergency_contact_relation) VALUES
(1, 'Rajesh Kumar', 'rajesh.kumar@gmail.com', '9876543210', '1999-05-15', 24, 'Male', 'Single', '12 Gandhi Road', 'Chennai', 'Tamil Nadu', '600001', 'India', '123456789012', 'Indian', 'Hindu', 'OC', 'B+', 'Ramesh Kumar', 'Government Employee', '9876543211', 'Lakshmi Ramesh', 'Teacher', '9876543212', 'Ramesh Kumar', '9876543211', 'Father'),
(2, 'Priya Sundaram', 'priya.sundaram@gmail.com', '9876543213', '2000-08-22', 23, 'Female', 'Single', '45 Anna Nagar', 'Coimbatore', 'Tamil Nadu', '641001', 'India', '123456789013', 'Indian', 'Hindu', 'BC', 'O+', 'Sundaram Iyer', 'Business', '9876543214', 'Geetha Sundaram', 'Homemaker', '9876543215', 'Sundaram Iyer', '9876543214', 'Father'),
(3, 'Arun Venkatesh', 'arun.venkatesh@gmail.com', '9876543216', '1998-12-10', 25, 'Male', 'Single', '78 T Nagar', 'Madurai', 'Tamil Nadu', '625001', 'India', '123456789014', 'Indian', 'Hindu', 'MBC', 'A+', 'Venkatesh Pillai', 'Engineer', '9876543217', 'Malini Venkatesh', 'Doctor', '9876543218', 'Venkatesh Pillai', '9876543217', 'Father'),
(4, 'Deepa Raman', 'deepa.raman@gmail.com', '9876543219', '2001-03-30', 22, 'Female', 'Single', '23 KK Nagar', 'Trichy', 'Tamil Nadu', '620001', 'India', '123456789015', 'Indian', 'Hindu', 'OC', 'AB+', 'Ramanathan', 'Professor', '9876543220', 'Shanti Raman', 'Professor', '9876543221', 'Ramanathan', '9876543220', 'Father'),
(5, 'Suresh Gopal', 'suresh.gopal@gmail.com', '9876543222', '1999-07-18', 24, 'Male', 'Single', '56 RS Puram', 'Salem', 'Tamil Nadu', '636001', 'India', '123456789016', 'Indian', 'Hindu', 'BC', 'B+', 'Gopal Krishnan', 'Farmer', '9876543223', 'Kamala Gopal', 'Teacher', '9876543224', 'Gopal Krishnan', '9876543223', 'Father'),
(6, 'Lakshmi Krishnan', 'lakshmi.krishnan@gmail.com', '9876543225', '2000-11-05', 23, 'Female', 'Single', '89 Race Course', 'Erode', 'Tamil Nadu', '638001', 'India', '123456789017', 'Indian', 'Hindu', 'MBC', 'O+', 'Krishnan Nair', 'Business', '9876543226', 'Radha Krishnan', 'Nurse', '9876543227', 'Krishnan Nair', '9876543226', 'Father'),
(7, 'Mohan Raj', 'mohan.raj@gmail.com', '9876543228', '1998-09-25', 25, 'Male', 'Single', '34 Gandhipuram', 'Vellore', 'Tamil Nadu', '632001', 'India', '123456789018', 'Indian', 'Hindu', 'SC', 'A+', 'Raj Kumar', 'Government Employee', '9876543229', 'Meena Raj', 'Anganwadi Worker', '9876543230', 'Raj Kumar', '9876543229', 'Father'),
(8, 'Anjali Nair', 'anjali.nair@gmail.com', '9876543231', '2001-01-12', 22, 'Female', 'Single', '67 Lake Area', 'Tirunelveli', 'Tamil Nadu', '627001', 'India', '123456789019', 'Indian', 'Hindu', 'OC', 'B+', 'Nair Menon', 'Engineer', '9876543232', 'Leela Nair', 'Bank Employee', '9876543233', 'Nair Menon', '9876543232', 'Father'),
(9, 'Karthik Srinivasan', 'karthik.srinivasan@gmail.com', '9876543234', '1999-04-08', 24, 'Male', 'Single', '90 SA Colony', 'Kanyakumari', 'Tamil Nadu', '629001', 'India', '123456789020', 'Indian', 'Hindu', 'BC', 'O+', 'Srinivasan Iyer', 'Doctor', '9876543235', 'Padma Srinivasan', 'Teacher', '9876543236', 'Srinivasan Iyer', '9876543235', 'Father'),
(10, 'Divya Iyer', 'divya.iyer@gmail.com', '9876543237', '2000-06-20', 23, 'Female', 'Single', '123 Mylapore', 'Chennai', 'Tamil Nadu', '600004', 'India', '123456789021', 'Indian', 'Hindu', 'OC', 'A+', 'Iyer Subramanian', 'CA', '9876543238', 'Uma Iyer', 'Professor', '9876543239', 'Iyer Subramanian', '9876543238', 'Father'),
(11, 'Vikram Chandran', 'vikram.chandran@gmail.com', '9876543240', '1998-02-14', 25, 'Male', 'Single', '45 Peelamedu', 'Coimbatore', 'Tamil Nadu', '641004', 'India', '123456789022', 'Indian', 'Hindu', 'MBC', 'AB+', 'Chandran Nair', 'Business', '9876543241', 'Latha Chandran', 'Doctor', '9876543242', 'Chandran Nair', '9876543241', 'Father'),
(12, 'Shweta Menon', 'shweta.menon@gmail.com', '9876543243', '2001-08-30', 22, 'Female', 'Single', '78 Avinashi Road', 'Coimbatore', 'Tamil Nadu', '641037', 'India', '123456789023', 'Indian', 'Hindu', 'OC', 'B+', 'Menon Krishnan', 'Engineer', '9876543244', 'Anita Menon', 'Teacher', '9876543245', 'Menon Krishnan', '9876543244', 'Father'),
(13, 'Harish Pillai', 'harish.pillai@gmail.com', '9876543246', '1999-10-05', 24, 'Male', 'Single', '23 Melur Road', 'Madurai', 'Tamil Nadu', '625016', 'India', '123456789024', 'Indian', 'Hindu', 'BC', 'O+', 'Pillai Gopal', 'Government Employee', '9876543247', 'Sunitha Pillai', 'Nurse', '9876543248', 'Pillai Gopal', '9876543247', 'Father'),
(14, 'Meena Subramanian', 'meena.subramanian@gmail.com', '9876543249', '2000-12-18', 23, 'Female', 'Single', '56 Woraiyur', 'Trichy', 'Tamil Nadu', '620003', 'India', '123456789025', 'Indian', 'Hindu', 'MBC', 'A+', 'Subramanian Iyer', 'Professor', '9876543250', 'Kavitha Subramanian', 'Bank Manager', '9876543251', 'Subramanian Iyer', '9876543250', 'Father'),
(15, 'Ravi Shankar', 'ravi.shankar@gmail.com', '9876543252', '1998-07-22', 25, 'Male', 'Single', '89 Hasthampatti', 'Salem', 'Tamil Nadu', '636007', 'India', '123456789026', 'Indian', 'Hindu', 'SC', 'B+', 'Shankar Kumar', 'Farmer', '9876543253', 'Rajeshwari Shankar', 'Teacher', '9876543254', 'Shankar Kumar', '9876543253', 'Father'),
(16, 'Pooja Reddy', 'pooja.reddy@gmail.com', '9876543255', '2001-04-15', 22, 'Female', 'Single', '34 Brough Road', 'Erode', 'Tamil Nadu', '638001', 'India', '123456789027', 'Indian', 'Hindu', 'OC', 'O+', 'Reddy Naidu', 'Business', '9876543256', 'Lakshmi Reddy', 'Doctor', '9876543257', 'Reddy Naidu', '9876543256', 'Father'),
(17, 'Sanjay Bose', 'sanjay.bose@gmail.com', '9876543258', '1999-09-08', 24, 'Male', 'Single', '67 Katpadi Road', 'Vellore', 'Tamil Nadu', '632007', 'India', '123456789028', 'Indian', 'Hindu', 'BC', 'A+', 'Bose Chandran', 'Engineer', '9876543259', 'Priya Bose', 'Professor', '9876543260', 'Bose Chandran', '9876543259', 'Father'),
(18, 'Nandini Gupta', 'nandini.gupta@gmail.com', '9876543261', '2000-03-25', 23, 'Female', 'Single', '90 Palayamkottai', 'Tirunelveli', 'Tamil Nadu', '627002', 'India', '123456789029', 'Indian', 'Hindu', 'MBC', 'AB+', 'Gupta Sharma', 'CA', '9876543262', 'Sneha Gupta', 'Teacher', '9876543263', 'Gupta Sharma', '9876543262', 'Father'),
(19, 'Aravind Joshi', 'aravind.joshi@gmail.com', '9876543264', '1998-11-11', 25, 'Male', 'Single', '123 Nagercoil', 'Kanyakumari', 'Tamil Nadu', '629001', 'India', '123456789030', 'Indian', 'Hindu', 'OC', 'B+', 'Joshi Patil', 'Doctor', '9876543265', 'Anjali Joshi', 'Nurse', '9876543266', 'Joshi Patil', '9876543265', 'Father'),
(20, 'Swathi Patel', 'swathi.patel@gmail.com', '9876543267', '2001-05-28', 22, 'Female', 'Single', '45 Adyar', 'Chennai', 'Tamil Nadu', '600020', 'India', '123456789031', 'Indian', 'Hindu', 'BC', 'O+', 'Patel Reddy', 'Business', '9876543268', 'Madhavi Patel', 'Bank Employee', '9876543269', 'Patel Reddy', '9876543268', 'Father');

INSERT INTO users (first_name, last_name, email, password, is_active, is_new_user) VALUES
('Rajesh', 'Kumar', 'rajesh.kumar@gmail.com', '1234567', TRUE, FALSE),
('Priya', 'Sundaram', 'priya.sundaram@gmail.com', '1234567', TRUE, FALSE),
('Arun', 'Venkatesh', 'arun.venkatesh@gmail.com', '1234567', TRUE, FALSE),
('Deepa', 'Raman', 'deepa.raman@gmail.com', '1234567', TRUE, FALSE),
('Suresh', 'Gopal', 'suresh.gopal@gmail.com', '1234567', TRUE, FALSE),
('Lakshmi', 'Krishnan', 'lakshmi.krishnan@gmail.com', '1234567', TRUE, FALSE),
('Mohan', 'Raj', 'mohan.raj@gmail.com', '1234567', TRUE, FALSE),
('Anjali', 'Nair', 'anjali.nair@gmail.com', '1234567', TRUE, FALSE),
('Karthik', 'Srinivasan', 'karthik.srinivasan@gmail.com', '1234567', TRUE, FALSE),
('Divya', 'Iyer', 'divya.iyer@gmail.com', '1234567', TRUE, FALSE),
('Vikram', 'Chandran', 'vikram.chandran@gmail.com', '1234567', TRUE, FALSE),
('Shweta', 'Menon', 'shweta.menon@gmail.com', '1234567', TRUE, FALSE),
('Harish', 'Pillai', 'harish.pillai@gmail.com', '1234567', TRUE, FALSE),
('Meena', 'Subramanian', 'meena.subramanian@gmail.com', '1234567', TRUE, FALSE),
('Ravi', 'Shankar', 'ravi.shankar@gmail.com', '1234567', TRUE, FALSE),
('Pooja', 'Reddy', 'pooja.reddy@gmail.com', '1234567', TRUE, FALSE),
('Sanjay', 'Bose', 'sanjay.bose@gmail.com', '1234567', TRUE, FALSE),
('Nandini', 'Gupta', 'nandini.gupta@gmail.com', '1234567', TRUE, FALSE),
('Aravind', 'Joshi', 'aravind.joshi@gmail.com', '1234567', TRUE, FALSE),
('Swathi', 'Patel', 'swathi.patel@gmail.com', '1234567', TRUE, FALSE);
-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate all tables
TRUNCATE TABLE users;
TRUNCATE TABLE personal_details;
TRUNCATE TABLE job_details;
TRUNCATE TABLE education_details;
TRUNCATE TABLE user_points;
TRUNCATE TABLE points_history;
TRUNCATE TABLE admins;
TRUNCATE TABLE withdrawals;
TRUNCATE TABLE bank_accounts;


-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;



-- =====================================================
-- TIMEZONE SETTINGS
-- =====================================================
-- SELECT @@global.time_zone, @@session.time_zone;
-- SET GLOBAL time_zone = '+05:30';
-- SET time_zone = '+05:30';
-- SET GLOBAL time_zone = 'Asia/Kolkata';
-- SET time_zone = 'Asia/Kolkata';
-- SELECT @@global.time_zone, @@session.time_zone;
-- -- SET time_zone = 'Asia/Kolkata';


-- =====================================================
-- DESCRIBE TABLE STRUCTURES
-- =====================================================
DESCRIBE users;
DESCRIBE personal_details;
DESCRIBE job_details;
DESCRIBE education_details;
DESCRIBE user_points;
DESCRIBE points_history; 
DESCRIBE admins;   

