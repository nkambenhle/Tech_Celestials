// app.js

const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Import userRoutes after express
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const setupSwagger = require('./swagger');

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/assignments', require('./routes/assignmentRoutes'));
app.use('/submissions', require('./routes/submissionRoutes'));
app.use('/feedbacks', require('./routes/feedbackRoutes'));
app.use('/modules', require('./routes/moduleRoutes'));

// Authentication Route
app.use('/authS', require('./routes/authStudentRoutes'));
app.use('/authL', require('./routes/authLecturerRoutes'));

// Setup Swagger
setupSwagger(app);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
