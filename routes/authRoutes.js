//authRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Name, Surname, Username, Password, Role, Email, LoggedIn, Modules, Field } = req.body;

        try {
            // Check if the student number exists in the database
            const existingStudentNumber = await StudentNumber.findOne({ Student_Number: Username });

            if (!existingStudentNumber) {
                return res.status(400).json({ message: 'Invalid student number. Registration not allowed.' });
            }

            // Check if the user already exists with the same email
            const existingUser = await User.findOne({ Email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use.' });
            }

            // Create the new user and let the pre-save hook handle hashing
            const newUser = new User({
                Name,
                Surname,
                Username,
                Password,  // Store the plain password; it will be hashed in the pre-save hook
                Role,
                Email,
                LoggedIn,
                Modules,
                Field,
            });

            // Save the user to the database
            await newUser.save();

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
                { expiresIn: '1h' },  // Token expires in 1 hour
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Username, Password } = req.body; 

        try {
            // Check if the user exists
            const user = await User.findOne({ Username });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare the passwords using the method defined in user schema
            const isMatch = await user.comparePassword(Password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Update the LoggedIn status to true
            user.LoggedIn = true;
            await user.save();

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
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// POST route for user logout
router.post('/logout', (req, res) => {
    // Simply return a success message
    res.json({ message: 'Logout successful' });
});



module.exports = router;
