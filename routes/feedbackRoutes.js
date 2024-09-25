const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// GET all feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('Submission_ID');
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET feedback by ID
router.get('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate('Submission_ID');
        if (feedback) res.json(feedback);
        else res.status(404).json({ message: 'Feedback not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new feedback
router.post('/', async (req, res) => {
    const feedback = new Feedback({
        Submission_ID: req.body.Submission_ID,
        Feedback_Text: req.body.Feedback_Text,
        Marks: req.body.Marks,
    });

    try {
        const newFeedback = await feedback.save();
        res.status(201).json(newFeedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update a feedback
router.patch('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('Submission_ID');
        if (feedback) res.json(feedback);
        else res.status(404).json({ message: 'Feedback not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a feedback
router.delete('/:id', async (req, res) => {
    try {
        const result = await Feedback.findByIdAndDelete(req.params.id);
        if (result) res.json({ message: 'Feedback deleted' });
        else res.status(404).json({ message: 'Feedback not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

