const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/students -> Add new student
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, dept_id } = req.body;

        if (!name || !email) {
             return res.status(400).json({ error: 'Name and email are required fields' });
        }

        // If email exists, it will throw a duplicate key error. Wait, we can use ON DUPLICATE KEY UPDATE 
        // to gracefully handle this and return the student ID, but we need to fetch the ID if it already existed.
        const query = 'SELECT student_id FROM Student WHERE email = ?';
        const [existing] = await db.execute(query, [email]);
        
        let student_id;
        
        if (existing.length > 0) {
            student_id = existing[0].student_id;
        } else {
            const insertQuery = 'INSERT INTO Student (name, email, phone, dept_id) VALUES (?, ?, ?, ?)';
            const insertValues = [name, email, phone || null, dept_id || null];
            const [result] = await db.execute(insertQuery, insertValues);
            student_id = result.insertId;
        }
        
        res.status(201).json({ 
            message: 'Student processed successfully', 
            student_id: student_id 
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
