const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/complaints -> Add complaint
router.post('/', async (req, res) => {
    try {
        const { title, description, priority, student_id, dept_id } = req.body;

        if (!title || !student_id || !dept_id) {
             return res.status(400).json({ error: 'Title, student_id, and dept_id are required' });
        }

        const query = `
            INSERT INTO Complaint (title, description, priority, student_id, dept_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [title, description || null, priority || 'Low', student_id, dept_id];

        const [result] = await db.execute(query, values);
        
        res.status(201).json({ 
            message: 'Complaint added successfully', 
            complaint_id: result.insertId 
        });
    } catch (error) {
        console.error('Error adding complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/complaints -> Get all complaints
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.complaint_id,
                c.title,
                c.description,
                c.priority,
                c.status,
                c.date_submitted,
                c.date_resolved,
                c.student_id,
                s.name AS student_name,
                c.dept_id,
                d.dept_name AS department_name
            FROM 
                Complaint c
            JOIN 
                Student s ON c.student_id = s.student_id
            LEFT JOIN 
                Department d ON c.dept_id = d.dept_id
            ORDER BY
                c.date_submitted DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/complaints/:id -> Update complaint fields
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        // Build dynamic SET clause based on provided fields
        const fields = [];
        const values = [];

        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (priority !== undefined) { fields.push('priority = ?'); values.push(priority); }
        if (status !== undefined) {
            fields.push('status = ?');
            values.push(status);
            if (status === 'Resolved') {
                fields.push('date_resolved = CURRENT_TIMESTAMP');
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'At least one field to update is required' });
        }

        values.push(id);
        const query = `UPDATE Complaint SET ${fields.join(', ')} WHERE complaint_id = ?`;
        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json({ message: 'Complaint updated successfully' });
    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/complaints/:id -> Delete a complaint
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM Complaint WHERE complaint_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Error deleting complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
