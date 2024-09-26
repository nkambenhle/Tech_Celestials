// routes/submissionRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const Submission = require('../models/submission');
const router = express.Router();
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Ensure environment variables are loaded

// Azure Blob Storage Configuration
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=techzungunkstorage;AccountKey=07ofaY4KcoANzUXlhWE2CIrx92dad13M+WXUfLmdIEJBpNjKNCJ5CmH8MQqBZ/larVFj974auBLV+ASt8WBarQ==;EndpointSuffix=core.windows.net';
const AZURE_CONTAINER_NAME = 'videos';

// Initialize Azure Blob Service Client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

// Ensure the container exists
const ensureContainerExists = async () => {
    const exists = await containerClient.exists();
    if (!exists) {
        await containerClient.create();
        console.log(`Container "${AZURE_CONTAINER_NAME}" created.`);
    }
};
ensureContainerExists().catch((err) => { 
    console.error("Error ensuring container exists:", err.message);
});

// Initialize Multer for file uploads (temporary storage)
const upload = multer({ dest: 'uploads/' }); // Temporary folder

// GET all submissions
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate({
                path: 'Assignment_ID',
                select: 'Title Description Marks Open_Date Due_Date' // Select necessary fields from Assignment
            })
            .populate({
                path: 'User_ID',
                select: 'Username Email' // Select necessary fields from User and exclude sensitive data
            });
        
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
    console.log(req.file); // Check the received file
    try {
        const { Assignment_ID, User_ID, Date: submissionDate } = req.body; // Rename to avoid confusion
        const videoFile = req.file;

        if (!videoFile) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        // Upload video to Azure Blob Storage
        const blobName = `${new Date().getTime()}-${videoFile.originalname}`; // Unique name
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        await blockBlobClient.uploadFile(videoFile.path, {
            blobHTTPHeaders: { blobContentType: videoFile.mimetype }
        });

        // Construct video URL
        const videoUrl = blockBlobClient.url;

        // Create a new Submission object with the video URL
        const submission = new Submission({
            Assignment_ID,
            User_ID,
            Video: videoUrl,  // Store the Azure video URL
            Date: submissionDate || new Date().toISOString(), // Use provided date or current date
        });

        // Save submission to MongoDB
        const newSubmission = await submission.save();

        // Delete the temporary file after upload
        try {
            fs.unlinkSync(videoFile.path);
        } catch (unlinkErr) {
            console.error('Failed to delete temporary file:', unlinkErr.message);
        }

        res.status(201).json(newSubmission);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});


// GET and Stream Video by Filename
router.get('/video/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        // Get blob client
        const blockBlobClient = containerClient.getBlockBlobClient(filename);

        // Check if the blob exists
        const exists = await blockBlobClient.exists();
        if (!exists) {
            return res.status(404).json({ message: 'No file found' });
        }

        // Set appropriate headers for streaming
        res.set('Content-Type', 'video/mp4'); // Adjust if using different video formats
        res.set('Content-Disposition', `inline; filename="${filename}"`);

        // Stream the blob
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Download Video by Filename
router.get('/download/:filename', async (req, res) => {
    try {
        const { filename } = req.params;

        // Get blob client
        const blockBlobClient = containerClient.getBlockBlobClient(filename);

        // Check if the blob exists
        const exists = await blockBlobClient.exists();
        if (!exists) {
            return res.status(404).json({ message: 'No file found' });
        }

        // Set headers for download
        res.set('Content-Disposition', `attachment; filename="${filename}"`);
        res.set('Content-Type', 'video/mp4'); // Adjust if using different video formats

        // Stream the blob
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});


// Serve video streaming by Submission ID
router.get('/video/stream/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission || !submission.Video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Extract blob name from URL
        const url = new URL(submission.Video);
        const blobName = path.basename(url.pathname);

        // Get blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Check if the blob exists
        const exists = await blockBlobClient.exists();
        if (!exists) {
            return res.status(404).json({ message: 'Video file not found in storage' });
        }

        // Get blob properties to determine size
        const blobProperties = await blockBlobClient.getProperties();
        const fileSize = blobProperties.contentLength;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunkSize = (end - start) + 1;
            const downloadOptions = { range: { start, end } };
            const downloadBlockBlobResponse = await blockBlobClient.download(0, undefined, downloadOptions);

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            downloadBlockBlobResponse.readableStreamBody.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            const downloadBlockBlobResponse = await blockBlobClient.download(0);
            downloadBlockBlobResponse.readableStreamBody.pipe(res);
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

// DELETE a submission
router.delete('/:id', async (req, res) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.id);
        if (submission) {
            // Extract blob name from URL
            const url = new URL(submission.Video);
            const blobName = path.basename(url.pathname);

            // Get blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Delete the blob
            await blockBlobClient.deleteIfExists();

            res.json({ message: 'Submission and video deleted' });
        } else {
            res.status(404).json({ message: 'Submission not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
