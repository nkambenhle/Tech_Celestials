const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    Module_ID: Number,
    Module_Name: String
});

module.exports = mongoose.model('Module', ModuleSchema);

