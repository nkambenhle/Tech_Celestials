const mongoose = require('mongoose');

// Define the StudentNumber schema with validation for exactly 8 digits
const StudentNumberSchema = new mongoose.Schema({
    Student_Number: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{8}$/.test(v); // Regular expression to match exactly 8 digits
            },
            message: props => `${props.value} is not a valid student number. Must be 8 digits.`,
        },
    },
});

module.exports = mongoose.model('StudentNumber', StudentNumberSchema);
