const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const logger = require('../logger'); // Import the winston logger
const argon2 = require('argon2');
const StudentNumber = require('../models/studentnumber');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();

// POST route for user registration
router.post(
    '/register',
    [
        check('Username', 'Username is required').not().isEmpty(),
        check('Username', 'Student number must be 8 digits').isLength({ min: 8, max: 8 }),
        check('Password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('Email', 'Please include a valid email').isEmail(),
    ],
    async (req, res) => {
        // Capture the start time
        const start = process.hrtime();

        // Log the API request with user registration details (excluding sensitive info)
        logger.info(`POST /register - Registration attempt for Username: ${req.body.Username}, Email: ${req.body.Email}`);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn(`POST /register - Validation errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }

        const { Name, Surname, Username, Password, Role, Email, LoggedIn, Modules, Field } = req.body;

        try {
            // Check if the student number exists in the database
            const existingStudentNumber = await StudentNumber.findOne({ Student_Number: Username });

            if (!existingStudentNumber) {
                logger.warn(`POST /register - Invalid student number: ${Username}`);
                return res.status(400).json({ message: 'Invalid student number. Registration not allowed.' });
            }

            // Check if the user already exists with the same email
            const existingUser = await User.findOne({ Email });
            if (existingUser) {
                logger.warn(`POST /register - Email already in use: ${Email}`);
                return res.status(400).json({ message: 'Email is already in use.' });
            }

            // Create the new user
            const newUser = new User({
                Name,
                Surname,
                Username,
                Password,
                Role,
                Email,
                LoggedIn,
                Modules,
                Field,
            });

            // Save the user to the database
            await newUser.save();
            logger.info(`POST /register - User registered successfully with Username: ${Username}`);

            // Generate JWT token
            const payload = {
                user: {
                    id: newUser.id,
                    studentNumber: newUser.Username,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }, // Token expires in 1 hour
                (err, token) => {
                    if (err) throw err;
                    logger.info(`POST /register - JWT token generated for Username: ${Username}`);

                    // Capture the end time after response is sent
                    const end = process.hrtime(start);
                    // Calculate response time in milliseconds
                    const responseTime = (end[0] * 1000 + end[1] / 1000000).toFixed(3);

                    // Log the response time
                    logger.info(`POST /register - Registration successful - Response time: ${responseTime} ms`);

                    // Send the response
                    res.json({ token });
                }
            );
        } catch (err) {
            logger.error(`POST /register - Server error: ${err.message}`);
            console.error(err.message);

            // Capture the end time for error logging
            const end = process.hrtime(start);
            const responseTime = (end[0] * 1000 + end[1] / 1000000).toFixed(3);
            logger.error(`POST /register - Error occurred - Response time: ${responseTime} ms`);

            res.status(500).json({ message: 'Server error' });
        }
    }
);


// POST route for user login
router.post(
    '/login',
    [
        check('Username', 'Username is required').not().isEmpty(),
        check('Password', 'Password is required').exists(),
    ],
    async (req, res) => {
        // Capture the start time
        const start = process.hrtime();

        // Log the API request for login
        logger.info(`POST /login - Login attempt for Username: ${req.body.Username}`);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn(`POST /login - Validation errors: ${JSON.stringify(errors.array())}`);
            // Capture the end time after validation error
            const end = process.hrtime(start);
            const responseTime = (end[0] * 1000 + end[1] / 1000000).toFixed(3);
            logger.warn(`POST /login - Validation failed - Response time: ${responseTime} ms`);
            return res.status(400).json({ errors: errors.array() });
        }

        const { Username, Password } = req.body;

        try {
            // Check if the user exists
            const user = await User.findOne({ Username });
            if (!user) {
                logger.warn(`POST /login - Invalid credentials for Username: ${Username}`);
                // Capture the end time after invalid credentials
                const end = process.hrtime(start);
                const responseTime = (end[0] * 1000 + end[1] / 1000000).toFixed(3);
                logger.warn(`POST /login - Login failed - Response time: ${responseTime} ms`);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare the passwords using the method defined in user schema
            const isMatch = await user.comparePassword(Password);
            if (!isMatch) {
                logger.warn(`POST /login - Incorrect password for Username: ${Username}`);
                // Capture the end time after incorrect password
                const end = process.hrtime(start);
                const responseTime = (end[0] * 1000 + end[1] / 1000000).toFixed(3);
                logger.warn(`POST /login - Login failed - Response time: ${responseTime} ms`);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Update the LoggedIn status to true
            user.LoggedIn = true;
            await user.save();
            logger.info(`POST /login - User logged in: ${Username}`);

            // Generate JWT token
            const payload = {
                user: {
                    id: user.id,
                    studentNumber: user.Username,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }, // Token expires in 1 hour
                (err, token) => {
                    if (err) throw err;

                    // Log successful login
                    logger.info(`POST /login - JWT generated for Username: ${Username}`);

                    // Capture the end time after successful login
                    const end = process.hrtime(start);
                    const responseTime = (end[0] * 1000 + end[1] / 1000000).toFixed(3);
                    logger.info(`POST /login - Login successful - Response time: ${responseTime} ms`);

                    // Respond with the token and User_ID after login
                    res.json({
                        token,
                        User_ID: user.id, // Return the user ID in the response
                    });
                }
            );
        } catch (err) {
            logger.error(`POST /login - Server error: ${err.message}`);
            console.error(err.message);
            // Capture the end time for error logging
            const end = process.hrtime(start);
            const responseTime = (end[0] * 1000 + end[1] / 1000000).toFixed(3);
            logger.error(`POST /login - Error occurred - Response time: ${responseTime} ms`);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// POST route for user logout
router.post('/logout', (req, res) => {
    // Log the logout request
    logger.info('POST /logout - Logout attempt');

    // Simply return a success message
    res.json({ message: 'Logout successful' });

    // Log successful logout
    logger.info('POST /logout - Logout successful');
});

module.exports = router;
