const winston = require('winston');
const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=techzungunkstorage;AccountKey=07ofaY4KcoANzUXlhWE2CIrx92dad13M+WXUfLmdIEJBpNjKNCJ5CmH8MQqBZ/larVFj974auBLV+ASt8WBarQ==;EndpointSuffix=core.windows.net';
 
const CONTAINER_NAME = '$logs'; // Your container name

// Initialize Blob Service Client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// Function to upload log files
async function uploadLogFile(filePath) {
    const fileName = path.basename(filePath);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Upload the log file to Azure Blob Storage
    await blockBlobClient.uploadFile(filePath);
}

// Create a winston logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/requests.log' }),  // Log API requests
        new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),  // Log errors
    ],
});

// Schedule log file uploads (every hour, for example)
setInterval(async () => {
    try {
        await uploadLogFile('logs/requests.log');
        await uploadLogFile('logs/errors.log');
        console.log('Log files uploaded to Azure Blob Storage');
    } catch (error) {
        console.error('Error uploading log files:', error.message);
    }
}, 60000); // 60000 ms = 1 minute

module.exports = logger;
