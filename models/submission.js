const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    Submission_ID: Number,
    Assignment_ID: Number,
    User_ID: Number,
    Video: String,
    Date: Date
});

module.exports = mongoose.model('Submission', SubmissionSchema);

