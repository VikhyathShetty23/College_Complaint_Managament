-- Create the complaint_system database
CREATE DATABASE IF NOT EXISTS complaint_system;
USE complaint_system;

-- 1. Department Table
-- Stores information about various college departments
CREATE TABLE IF NOT EXISTS Department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    location VARCHAR(255)
);

-- 2. Student Table
-- Stores student details and links them to a specific department
CREATE TABLE IF NOT EXISTS Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id) ON DELETE SET NULL
);

-- 3. Complaint Table
-- Stores complaint details submitted by students, linked to a department
CREATE TABLE IF NOT EXISTS Complaint (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
    status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
    date_submitted DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_resolved DATETIME NULL,
    student_id INT,
    dept_id INT,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id) ON DELETE SET NULL
);


-- Insert sample data for Department
INSERT INTO Department (dept_name, location) VALUES
('Computer Science', 'Main Block'),
('Information Science', 'Tech Block'),
('Electronics and Communication', 'Circuit Block'),
('Civil', 'Infrastructure Block'),
('Mechanical', 'Workshop Block'),
('AI&ML', 'Tech Block'),
('AI&DS', 'Tech Block'),
('Robotics', 'Innovation Center');

-- Insert sample data for Student
INSERT INTO Student (name, email, phone, dept_id) VALUES
('Alice Johnson', 'alice.j@example.com', '555-0101', 1),
('Bob Smith', 'bob.s@example.com', '555-0102', 2),
('Charlie Davis', 'charlie.d@example.com', '555-0103', 1);

-- Insert sample data for Complaint
-- Note: date_submitted uses the default CURRENT_TIMESTAMP
INSERT INTO Complaint (title, description, priority, status, student_id, dept_id) VALUES
('Projector not working', 'The projector in room 101 is completely broken.', 'High', 'Pending', 1, 1),
('Broken Chair', 'One of the chairs in the lab is broken and needs replacement.', 'Low', 'Resolved', 2, 2),
('Software License Expired', 'The statistical software in the lab has expired.', 'Medium', 'In Progress', 3, 1);

-- ==========================================
-- Sample Queries
-- ==========================================

/*
-- Query 1: Get all complaints
SELECT * FROM Complaint;

-- Query 2: Filter complaints by status (e.g., 'Pending')
SELECT * FROM Complaint WHERE status = 'Pending';

-- Query 3: Join complaint with student and department to get detailed view
SELECT 
    c.complaint_id,
    c.title,
    c.priority,
    c.status,
    c.date_submitted,
    s.name AS student_name,
    d.dept_name AS department_name
FROM 
    Complaint c
JOIN 
    Student s ON c.student_id = s.student_id
LEFT JOIN 
    Department d ON c.dept_id = d.dept_id;
*/
