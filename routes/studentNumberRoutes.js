const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const StudentNumber = require('../models/studentnumber');

// Set up Multer for file upload
const upload = multer({ dest: 'uploads/' });

// POST route for uploading student numbers text file
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Validate that the uploaded file is a text file
        const allowedMimetypes = ['text/plain'];
        if (!allowedMimetypes.includes(req.file.mimetype)) {
            fs.unlinkSync(req.file.path); // Remove the file if it's not a valid text file
            return res.status(400).json({ message: 'Uploaded file is not a valid text file' });
        }

        // Read the uploaded file
        const filePath = req.file.path;
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        
        // Split the file content by line, assuming each line is a student number
        const studentNumbers = fileContents.split(/\r?\n/).filter(Boolean); // Filter out empty lines

        // Check for existing student numbers in the database
        const existingStudentNumbers = await StudentNumber.find({ 
            Student_Number: { $in: studentNumbers } 
        }).select('Student_Number');

        // Create a set of existing student numbers for easy comparison
        const existingStudentNumbersSet = new Set(existingStudentNumbers.map(student => student.Student_Number));

        // Filter out student numbers that already exist in the database
        const newStudentNumbers = studentNumbers.filter(number => !existingStudentNumbersSet.has(number));

        // If there are no new student numbers, return a message
        if (newStudentNumbers.length === 0) {
            fs.unlinkSync(filePath); // Remove the uploaded file after processing
            return res.status(200).json({ message: 'No new student numbers to upload' });
        }

        // Insert the new student numbers into the database
        const studentNumbersToInsert = newStudentNumbers.map(number => ({
            Student_Number: number
        }));
        await StudentNumber.insertMany(studentNumbersToInsert);

        // Remove the uploaded file after processing
        fs.unlinkSync(filePath);

        res.status(200).json({ 
            message: 'Student numbers uploaded successfully',
            newStudentNumbers
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all student numbers
router.get('/', async (req, res) => {
    try {
        const studentNumbers = await StudentNumber.find(); // Fetch all student numbers from the database
        res.json(studentNumbers); // Return the result as JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle any errors
    }
});

// DELETE route for deleting a student number by _id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the student number by _id and delete it
        const deletedStudent = await StudentNumber.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student number not found' });
        }

        res.json({ message: 'Student number deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle any errors
    }
});

module.exports = router;
