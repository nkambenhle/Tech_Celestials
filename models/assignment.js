const mongoose = require('mongoose');

// Assignment Schema
const AssignmentSchema = new mongoose.Schema({
    Title: String,
    Description: String,
    Marks: Number,
    Open_Date: Date,
    Due_Date: Date,
    Module_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, // References Module collection in MongoDB
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User model
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
