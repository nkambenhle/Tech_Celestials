const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');

// GET all submissions
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET submission by ID
router.get('/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (submission) res.json(submission);
        else res.status(404).json({ message: 'Submission not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new submission
router.post('/', async (req, res) => {
    const submission = new Submission(req.body);
    try {
        const newSubmission = await submission.save();
        res.status(201).json(newSubmission);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update a submission
router.patch('/:id', async (req, res) => {
    try {
        const submission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (submission) res.json(submission);
        else res.status(404).json({ message: 'Submission not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a submission
router.delete('/:id', async (req, res) => {
    try {
        const result = await Submission.findByIdAndDelete(req.params.id);
        if (result) res.json({ message: 'Submission deleted' });
        else res.status(404).json({ message: 'Submission not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

