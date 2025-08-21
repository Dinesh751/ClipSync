const config = require("../config/index");
const ValidationConfig = require('../config/validation');
const fs = require('fs');
const path = require('path');

let activeUploads = 0; // Track active uploads
const MaxConcurrentUploads = config.upload.maxConcurrentUploads || 10; // Default to 10 if not set

const uploadInitialization = (req, res) => {
    
    // First check: Concurrent upload limit
    if (activeUploads >= MaxConcurrentUploads) {
        return res.status(429).json({
            success: false,
            message: 'Server is busy. Too many concurrent uploads.',
            details: {
                currentUploads: activeUploads,
                maxAllowed: MaxConcurrentUploads,
                retryAfter: '30 seconds'
            }
        });
    }

    const { fileName, totalChunks, fileSize, title, description, category } = req.body;

    if(!fileName || !totalChunks || !fileSize) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: fileName, totalChunks, fileSize'
        });
    }

    //validate all fields using the correct method name
    const validation = ValidationConfig.validateInitParams(fileName, totalChunks, fileSize);

    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors found',
            errors: validation.errors
        });
    }

    // Generate upload ID and create directory
    const uploadId = ValidationConfig.generateUploadId();
    const uploadDir = path.join(config.storage.localPath, uploadId);
    
    try {
        // Check if upload directory already exists
        if (!fs.existsSync(uploadDir)) {
            // Create upload directory
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Increment active uploads counter
        activeUploads++;
        console.log(`🚀 New upload started. Active uploads: ${activeUploads}/${MaxConcurrentUploads}`);

        // Create metadata
        const metadata = {
            uploadId,
            fileName: ValidationConfig.sanitizeFilename(fileName),
            originalFileName: fileName,
            totalChunks: parseInt(totalChunks),
            fileSize: parseInt(fileSize),
            chunksReceived: 0,
            status: 'initialized',
            videoMetadata: {
                title: title || fileName,
                description: description || '',
                category: category || 'General'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            chunks: []
        };

        // Save metadata
        const metadataPath = path.join(uploadDir, 'metadata.json');
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        console.log('Upload initialization successful', {
            uploadId,
            fileName,
            totalChunks,
            fileSize,
            activeUploads
        });

        return res.status(201).json({
            success: true,
            message: 'Upload initialized successfully',
            data: {
                uploadId,
                status: 'initialized',
                fileName: metadata.fileName,
                totalChunks: metadata.totalChunks,
                fileSize: metadata.fileSize,
            }
        });
        
    } catch (error) {
        console.error('Upload initialization error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to initialize upload',
            error: error.message
        });
    }
}

// Function to handle upload completion/cancellation
const releaseUploadSlot = (uploadId, reason = 'completed') => {
    if (activeUploads > 0) {
        activeUploads--;
        console.log(`📤 Upload ${reason}: ${uploadId}. Active uploads: ${activeUploads}/${MaxConcurrentUploads}`);
    }
};

module.exports = {
    uploadInitialization,
    releaseUploadSlot
};