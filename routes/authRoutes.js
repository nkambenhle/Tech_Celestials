// routes/authRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config();

// Register a new user
router.post(
    '/register',
    [
        check('Username', 'Username is required').not().isEmpty(),
        check('Password', 'Password must be 6 or more characters').isLength({ min: 6 }),
        check('Email', 'Please include a valid email').isEmail(),
        check('Role', 'Defualt role can only be student!').isIn([ 'student'])
        
    ],
    async (req, res) => {
        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { User_ID, Name, Surname, Username, Password, Role, Email, LoggedIn, Modules, Field } = req.body;

        try {
            // Check if user already exists with the same email
            let user = await User.findOne({ Email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            // Create a new user
            user = new User({
                User_ID,
                Name,
                Surname,
                Username,
                Password, // Password will be hashed by the schema's pre-save middleware
                Role,
                Email,
                LoggedIn,
                Modules,
                Field 
            });

            await user.save();

            // Generate JWT token
            const payload = {
                user: {
                    id: user.id,
                    Username: user.Username,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Login a user
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
            // Find the user with a case-insensitive match for Username
            const user = await User.findOne({ Username: new RegExp(`^${Username}$`, 'i') });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password in DB
            const isMatch = await user.comparePassword(Password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Generate JWT token
            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

            user.LoggedIn = true;
            await user.save();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Logout a user
router.post('/logout', async (req, res) => {
    const { Username } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ Username });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        user.LoggedIn = false;
        await user.save();
        res.json({ msg: 'User logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;



