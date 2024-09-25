const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    Submission_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
    Feedback_Text: { type: String, required: true },
    Marks: { type: Number, required: true },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

