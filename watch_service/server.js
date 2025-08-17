#!/usr/bin/env node

/**
 * ClipSync Watch Service Server
 * Entry point for the video watching/streaming microservice
 */

require('dotenv').config();

const app = require('./src/app');

// Start server function
async function startServer() {
  try {
    console.log('🎬 Initializing Watch Service...');
    console.log('✅ Watch Service initialization complete');

    // Start the server
    const PORT = process.env.PORT || 5004;
    const server = app.listen(PORT, () => {
      console.log('🎉 ClipSync Watch Service Started Successfully!');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Local URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`🎬 Watch API: http://localhost:${PORT}/api/watch`);
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
