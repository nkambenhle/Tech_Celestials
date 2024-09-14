 // app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const setupSwagger = require('./swagger');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/assignments', require('./routes/assignmentRoutes'));
app.use('/submissions', require('./routes/submissionRoutes'));
app.use('/feedbacks', require('./routes/feedbackRoutes'));
app.use('/modules', require('./routes/moduleRoutes'));

// Setup Swagger
setupSwagger(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
