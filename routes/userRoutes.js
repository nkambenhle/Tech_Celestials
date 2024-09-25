const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Ensure you require uuid if you're using it
const User = require('../models/user');

const router = express.Router(); // Create the router instance

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new user
router.post('/', async (req, res) => {
    try {
        // Ensure User_ID is unique and valid
        if (!req.body.User_ID) {
            req.body.User_ID = uuidv4(); // Automatically assign a new User_ID if not provided
        }

        const user = new User(req.body);
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update a user
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (result) res.json({ message: 'User deleted' });
        else res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
