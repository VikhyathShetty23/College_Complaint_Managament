require('dotenv').config();
const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);

app.get('/', (req, res) => {
    res.send('College Complaint Management System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
