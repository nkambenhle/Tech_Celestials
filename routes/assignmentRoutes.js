const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment');

// GET all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
    
// GET assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (assignment) res.json(assignment);
        else res.status(404).json({ message: 'Assignment not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new assignment
router.post('/', async (req, res) => {
    const assignment = new Assignment(req.body);
    try {
        const newAssignment = await assignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update an assignment
router.patch('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (assignment) res.json(assignment);
        else res.status(404).json({ message: 'Assignment not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an assignment
router.delete('/:id', async (req, res) => {
    try {
        const result = await Assignment.findByIdAndDelete(req.params.id);
        if (result) res.json({ message: 'Assignment deleted' });
        else res.status(404).json({ message: 'Assignment not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

//Plesease check and ask questions ,code is the same i just added middleware code and updated the POST,PATCH,DELETE so that only lectures can create, delete and update assigmnets  

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware to verify if the user is a lecturer
const isLecturer = async (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user || user.Role !== 'lecturer') {
            return res.status(403).json({ msg: 'Access denied. Only lecturers can perform this action.' });
        }
        req.user = user; // Store the user info in the request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// GET all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (assignment) res.json(assignment);
        else res.status(404).json({ message: 'Assignment not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new assignment (Lecturers only)
router.post('/', isLecturer, async (req, res) => {
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
    });

    try {
        const newAssignment = await assignment.save();
        res.status(201).json(newAssignment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update an assignment (Only lecturers)
router.patch('/:id', [isLecturer], async (req, res) => {
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

// DELETE an assignment (Only lecturers)
router.delete('/:id', [isLecturer], async (req, res) => {
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
