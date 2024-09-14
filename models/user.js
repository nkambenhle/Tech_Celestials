const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    User_ID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Surname: { type: String, required: true },
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Role: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    LoggedIn: { type: Boolean, default: false },
    Modules: [{ type: String }],
    Field: { type: String }
}, { timestamps: true });

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
