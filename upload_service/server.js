#!/usr/bin/env node

/**
 * ClipSync Upload Service Server
 * Entry point for the video upload microservice
 */

require('dotenv').config();

const app = require('./src/app');

// Start server function
async function startServer() {
  try {
    console.log('🔄 Initializing Upload Service...');
    console.log('✅ Upload Service initialization complete');

    // Start the server
    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT, () => {
      console.log('🎉 ClipSync Upload Service Started Successfully!');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Local URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`📤 Upload API: http://localhost:${PORT}/api/upload`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    return server;

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
