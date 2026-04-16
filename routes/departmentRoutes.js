const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/departments -> Get all departments
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM Department ORDER BY dept_name ASC';
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
