 
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected'); // Log success message
    } catch (err) {
        console.error(err.message); // Log error message
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB; // Export the function

