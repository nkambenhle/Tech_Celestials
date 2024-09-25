//This is another idea of doing it
const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    
    Title: String,
    Description: String,
    Marks: Number,
    Open_Date: Date,
    Due_Date: Date,
    Module_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' } // References Module collection in mongodb
    
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
