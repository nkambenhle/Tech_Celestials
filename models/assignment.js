const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    Assignment_ID: Number,
    Title: String,
    Description: String,
    Marks: Number,
    Open_Date: Date,
    Due_Date: Date,
    Module_ID: Number,
    User_ID: Number
});

module.exports = mongoose.model('Assignment', AssignmentSchema);

