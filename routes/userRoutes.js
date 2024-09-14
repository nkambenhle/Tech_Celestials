const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// GET all users (you can make this protected if needed)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET user by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new user (registration)
router.post('/', async (req, res) => {
    const { User_ID, Name, Surname, Username, Password, Role, Email, Modules, Field } = req.body;
    
    try {
        let existingUser = await User.findOne({ Email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        existingUser = await User.findOne({ Username });
        if (existingUser) return res.status(400).json({ message: 'Username already taken' });

        const hashedPassword = await bcrypt.hash(Password, 10);

        const user = new User({
            User_ID,
            Name,
            Surname,
            Username,
            Password: hashedPassword, // Save the hashed password
            Role,
            Email,
            Modules,
            Field
        });
        
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST login user
router.post('/login', async (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }
    try {
        // Find the user by username
        const user = await User.findOne({ Username });
        console.log('User found:', user); // Debug line
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare the plaintext password with the hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);
        console.log('Password match:', isMatch); // Debug line
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' }); // Corrected this line

        // Mark the user as logged in
        user.LoggedIn = true;
        await user.save();

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: user._id, Username: user.Username, Role: user.Role }, 
            JWT_SECRET, 
            { expiresIn: '1h' });

        res.json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// POST logout user (protected)
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ Username: req.user.Username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.LoggedIn = false;
        await user.save();

        res.json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH update a user (protected)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a user (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (result) res.json({ message: 'User deleted' });
        else res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;