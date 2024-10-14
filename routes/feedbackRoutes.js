const express = require('express');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
const Feedback = require('../models/feedback');

// Middleware to authenticate user 
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user; // Save the user information to the request
        console.log("Authenticated User:", req.user); // Log the user information
        next();
    });
};

// GET feedbacks for submissions made by the logged-in user
router.get('/my-feedbacks', authenticateUser, async (req, res) => {
    try {
        // Find all feedbacks where the Submission_ID points to a submission made by the logged-in user
        const feedbacks = await Feedback.find()
            .populate({
                path: 'Submission_ID',   // Populate the Submission_ID
                match: { User_ID: req.user.user.id }  // Updated to use req.user.user.id
            });

        // Filter out feedbacks where the match did not return any submissions
        const userFeedbacks = feedbacks.filter(feedback => feedback.Submission_ID !== null);

        res.json(userFeedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
