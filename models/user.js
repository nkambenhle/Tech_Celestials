const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    User_ID: Number,
    Name: String,
    Surname: String,
    Username: String,
    Password: String,
    Role: String,
    Email: String,
    LoggedIn: Boolean,
    Modules: [String],
    Field: String
});

module.exports = mongoose.model('User', UserSchema);

