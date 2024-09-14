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

