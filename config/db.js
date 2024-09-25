 
// config/db.js
const mongoose = require('mongoose');

mongoose.set('debug', true);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://nkambenhle17zungu:AQnjaI8M0kGZzVyq@hms.ohajons.mongodb.net/?retryWrites=true&w=majority&appName=HMS');
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};


module.exports = connectDB;

