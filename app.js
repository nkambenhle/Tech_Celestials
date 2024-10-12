 // app.js

 const cors = require('cors'); 

const dotenv = require('dotenv');

const mongoose = require('mongoose');


const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const setupSwagger = require('./swagger');

// Load environment variables
dotenv.config();

const app = express();


// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json()); 
app.use(cors()); // passing a middleware function


// Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/assignments', require('./routes/assignmentRoutes'));
app.use('/submissions', require('./routes/submissionRoutes'));
app.use('/feedbacks', require('./routes/feedbackRoutes'));
app.use('/modules', require('./routes/moduleRoutes'));
app.use('/studentnumbers', require('./routes/studentnumberRoutes'));

app.use('/auth', require('./routes/authRoutes'));


// Setup Swagger
setupSwagger(app);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



