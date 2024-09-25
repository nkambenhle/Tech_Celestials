const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const Submission = require('../models/submission');

const path = require('path');
const fs = require('fs');

const router = express.Router();
let gfs;

// Initialize GridFS
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('videos'); // Set the collection name
});

// Multer Storage Engine for GridFS
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Upload Middleware
const upload = multer({ storage });

// GET all submissions
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find().populate('Assignment_ID User_ID');
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET submission by ID
router.get('/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('Assignment_ID User_ID');
        if (submission) res.json(submission);
        else res.status(404).json({ message: 'Submission not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Submit a new video
router.post('/', upload.single('video'), async (req, res) => {
    const submission = new Submission({
        Assignment_ID: req.body.Assignment_ID,
        User_ID: req.body.User_ID,
        Video: req.file.filename, // Save filename in the submission
        Date: req.body.Date || Date.now()
    });
    
    try {
        const newSubmission = await submission.save();
        res.status(201).json(newSubmission);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET and Stream Video
router.get('/video/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'No file found' });
        }

        // Check if it's a video file
        if (file.contentType.startsWith('video/')) {
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        } else {
            res.status(400).json({ message: 'Not a video file' });
        }
    });
});

// Download Video
router.get('/download/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'No file found' });
        }

        // Set headers for download
        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    });
});

// Serve video streaming
router.get('/video/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission || !submission.Video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // The path where the videos are stored (adjust this to your setup)
        const videoPath = path.join(__dirname, '../uploads', submission.Video);

        // Stream the video file
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;




            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a submission
router.delete('/:id', async (req, res) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.id);
        if (submission) {
        
            // Delete the video from GridFS
            gfs.remove({ filename: submission.Video, root: 'videos' }, (err, gridStore) => {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ message: 'Submission and video deleted' });
            });
        } else {
            res.status(404).json({ message: 'Submission not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
