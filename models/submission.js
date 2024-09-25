const mongoose = require('mongoose');

// Submission Schema with Assignment and User references
const SubmissionSchema = new mongoose.Schema({
    Assignment_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Video: { type: String, required: true }, // Store the filename in GridFS
    Date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);

