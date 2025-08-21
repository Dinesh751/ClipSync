const multer = require('multer');

// Global error handler
const errorHandler = (error, req, res, next) => {
  console.error('Global error handler:', error);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File size limit exceeded (max 500MB).');
    }
  }
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;