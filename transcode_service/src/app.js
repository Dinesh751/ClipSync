const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Trust proxy if behind a reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware with larger limits for video processing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request ID middleware
app.use((req, res, next) => {
  req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'ClipSync Transcoder Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/transcode', (req, res) => {
  res.json({
    message: 'Transcoder API endpoint',
    service: 'ClipSync Transcoder Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      transcode: '/api/transcode'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    service: 'ClipSync Transcoder Service',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    requestId: req.id,
    service: 'ClipSync Transcoder Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
