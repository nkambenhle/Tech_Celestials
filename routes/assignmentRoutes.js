const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware to verify if the user is a lecturer or admin
const isLecturerOrAdmin = async (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user || (user.Role !== 'lecturer' && user.Role !== 'admin')) {
            return res.status(403).json({ msg: 'Access denied. Only lecturers or admins can perform this action.' });
        }
        req.user = user; // Store the user info in the request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// GET assignments created by the logged-in lecturer
router.get('/my-assignments', isLecturerOrAdmin, async (req, res) => {
    try {
        const assignments = await Assignment.find({ createdBy: req.user._id }).populate('Module_ID'); // Populate Module_ID
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('Module_ID'); // Populate Module_ID
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('Module_ID'); // Populate Module_ID
        if (assignment) res.json(assignment);
        else res.status(404).json({ message: 'Assignment not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new assignment (Lecturers or Admins only)
router.post('/', isLecturerOrAdmin, async (req, res) => {
    const { Title, Description, Marks, Open_Date, Due_Date, Module_ID } = req.body;

    // Ensure that Module_ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(Module_ID)) {
        return res.status(400).json({ msg: 'Invalid Module_ID' });
    }

    const assignment = new Assignment({
        Title,
        Description,
        Marks,
        Open_Date,
        Due_Date,
        Module_ID,
        createdBy: req.user._id // Set createdBy to the ID of the authenticated user
    });

    try {
        const newAssignment = await assignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update an assignment (Only lecturers or admins)
router.patch('/:id', isLecturerOrAdmin, async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an assignment (Only lecturers or admins)
router.delete('/:id', isLecturerOrAdmin, async (req, res) => {
    try {
        const result = await Assignment.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Assignment deleted' });
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
