const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    User_ID: { type: Number, required: true },
    Name: { type: String, required: true },
    Surname: { type: String, required: true },
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Role: { type: String, enum: ['admin', 'lecturer', 'student'], required: true },
    Email: { type: String, required: true, unique: true },
    LoggedIn: { type: Boolean, default: false },
    Modules: [{ type: String }],  
    Field: { type: String }
});


// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();

    try {
        this.Password = await argon2.hash(this.Password);
        next(); 
    } catch (err) {
        next(err); // Handle hashing error
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (Password) {
    try {
        return await argon2.verify(this.Password, Password);
    } catch (err) {
        throw new Error('Password verification failed'); // Handle comparison error
    }
};

module.exports = mongoose.model('User', userSchema);

