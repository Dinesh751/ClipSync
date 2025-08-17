const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const uploadRoutes = require('./routes/uploadRoutes');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '100mb' })); // Large limit for video uploads
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Upload Service is running',
    timestamp: new Date().toISOString(),
    service: 'upload-service',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ClipSync Upload Service',
    endpoints: {
      health: '/health',
      upload: 'POST /api/upload',
      status: 'GET /api/upload/status/:id'
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

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app;
