const multer = require('multer');
const path = require('path');
const config = require('./index');

// Multer configuration for chunked uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use temp directory from config for chunk storage
    const tempDir = path.resolve(config.storage.tempPath);
    cb(null, tempDir);
  },
  
  filename: (req, file, cb) => {
    // Generate unique filename for chunks
    const uniqueName = `chunk_${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueName);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // For chunks, we'll validate the final file type later during completion
  // Allow all files during chunk upload since chunks might not have proper mime types
  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage: storage,
  
  limits: {
    fileSize: config.validation.parseSize(config.upload.chunkSize), // Per chunk limit (5MB default)
    files: 1, // Only one chunk at a time
    fieldSize: 1024 * 1024, // 1MB field size limit
    fieldNameSize: 100, // Field name size limit
    fields: 10 // Maximum number of fields
  },
  
  fileFilter: fileFilter
});

// Error handling for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: `Chunk size too large. Maximum chunk size is ${config.upload.chunkSize}`,
          error: 'CHUNK_SIZE_EXCEEDED'
        });
        
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Only one chunk allowed per request',
          error: 'TOO_MANY_FILES'
        });
        
      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many fields in the request',
          error: 'TOO_MANY_FIELDS'
        });
        
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field',
          error: 'UNEXPECTED_FILE'
        });
        
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.code
        });
    }
  }
  
  // Pass non-multer errors to the next error handler
  next(err);
};

module.exports = {
  upload,
  handleMulterError,
  
  // Convenience methods
  single: (fieldName) => upload.single(fieldName),
  array: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  fields: (fields) => upload.fields(fields),
  none: () => upload.none(),
  any: () => upload.any()
};
