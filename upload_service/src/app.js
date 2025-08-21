const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const config = require('./config/index');

// Create Express app
const app = express();

// Ensure upload directories exist
const uploadsDir = path.resolve(config.storage.localPath);
const tempDir = path.resolve(config.storage.tempPath);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('📁 Created temp directory:', tempDir);
}

// Export config for use in other modules
app.locals.config = config;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware with size limits
app.use(express.json({
  limit: config.upload.requestSize,
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: config.upload.requestSize 
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Upload Service is running',
    timestamp: new Date().toISOString(),
    service: 'upload-service',
    version: '1.0.0',
    config: config.validation.getUploadLimits()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ClipSync Upload Service',
    endpoints: {
      health: '/health',
      initUpload: 'POST /api/upload/init',
      uploadChunk: 'POST /api/upload/chunk',
      completeUpload: 'POST /api/upload/complete',
      uploadStatus: 'GET /api/upload/status/:uploadId'
    }
  });
});

// Routes
app.use('/api/upload', uploadRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use(errorHandler)

module.exports = app;
