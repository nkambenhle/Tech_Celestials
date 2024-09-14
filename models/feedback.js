const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    Feedback_ID: Number,
    Submission_ID: Number,
    Feedback_Text: String,
    Marks: Number,
    User_ID: Number
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

