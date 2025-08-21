const config = require('./index');
const { v4: uuidv4 } = require('uuid');

class ValidationConfig {
  
  // Validate video file type based on filename
  static validateFileType(filename) {
    const allowedFormats = config.validation.getAllowedFormatsArray();
    const fileExt = filename.split('.').pop().toLowerCase();
    return allowedFormats.includes(fileExt);
  }

  // Validate file size is within allowed limits
  static validateFileSize(fileSize) {
    const minSize = config.validation.getMinFileSizeInBytes();
    const maxSize = config.validation.getMaxFileSizeInBytes();
    return fileSize >= minSize && fileSize <= maxSize;
  }

  // Validate chunk parameters
  static validateChunkParams(chunkIndex, totalChunks, uploadId) {
    const errors = [];

    // Validate chunk index
    if (chunkIndex === undefined || chunkIndex === null) {
      errors.push('Chunk index is required');
    } else if (!Number.isInteger(Number(chunkIndex)) || Number(chunkIndex) < 0) {
      errors.push('Chunk index must be a non-negative integer');
    }

    // Validate total chunks
    if (totalChunks === undefined || totalChunks === null) {
      errors.push('Total chunks is required');
    } else if (!Number.isInteger(Number(totalChunks)) || Number(totalChunks) <= 0) {
      errors.push('Total chunks must be a positive integer');
    }

    // Validate upload ID
    if (!uploadId || typeof uploadId !== 'string') {
      errors.push('Valid upload ID is required');
    }

    // Cross-validate chunk index and total chunks
    if (Number(chunkIndex) >= Number(totalChunks)) {
      errors.push('Chunk index must be less than total chunks');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate upload initialization parameters
  static validateInitParams(fileName, totalChunks, fileSize) {
    const errors = [];

    // Validate filename
    if (!fileName || typeof fileName !== 'string') {
      errors.push('Valid filename is required');
    } else if (!this.validateFileType(fileName)) {
      errors.push(`Invalid file type. Allowed formats: ${config.validation.getAllowedFormatsArray().join(', ')}`);
    }

    // Validate total chunks
    if (!totalChunks || !Number.isInteger(Number(totalChunks)) || Number(totalChunks) <= 0) {
      errors.push('Total chunks must be a positive integer');
    }

    // Validate file size
    if (!fileSize || !Number.isInteger(Number(fileSize)) || Number(fileSize) <= 0) {
      errors.push('File size must be a positive integer');
    } else if (!this.validateFileSize(Number(fileSize))) {
      const limits = config.validation.getUploadLimits();
      errors.push(`File size must be between ${limits.minFileSize} and ${limits.maxFileSize}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sanitize filename for safe storage
  static sanitizeFilename(filename) {
    // Remove or replace dangerous characters
    return filename
      .replace(/[<>:"/\\|?*]/g, '_') // Replace Windows forbidden chars
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .toLowerCase(); // Convert to lowercase for consistency
  }

  // Get upload configuration limits for client
  static getUploadLimits() {
    return {
      maxFileSize: config.upload.maxFileSize,
      minFileSize: config.upload.minFileSize,
      allowedFormats: config.validation.getAllowedFormatsArray(),
      chunkSize: config.upload.chunkSize,
      maxFileSizeBytes: config.validation.getMaxFileSizeInBytes(),
      minFileSizeBytes: config.validation.getMinFileSizeInBytes(),
      chunkSizeBytes: config.validation.parseSize(config.upload.chunkSize),
      maxConcurrentUploads: config.upload.maxConcurrentUploads
    };
  }

  // Validate video metadata
  static validateVideoMetadata(metadata) {
    const errors = [];

    // Validate title
    if (metadata.title && typeof metadata.title === 'string') {
      if (metadata.title.length > 255) {
        errors.push('Title must be less than 255 characters');
      }
    }

    // Validate description
    if (metadata.description && typeof metadata.description === 'string') {
      if (metadata.description.length > 5000) {
        errors.push('Description must be less than 5000 characters');
      }
    }

    // Validate category
    const allowedCategories = ['General', 'Tutorial', 'Entertainment', 'Education', 'Music', 'Sports', 'Technology', 'Gaming'];
    if (metadata.category && !allowedCategories.includes(metadata.category)) {
      errors.push(`Invalid category. Allowed categories: ${allowedCategories.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check if storage type is valid
  static isValidStorageType(storageType) {
    const validTypes = ['local', 's3'];
    return validTypes.includes(storageType);
  }

  // Generate safe upload ID using UUID
  static generateUploadId() {
    const uuid = uuidv4();
    const timestamp = Date.now();
    return `upload_${timestamp}_${uuid}`;
  }
}

module.exports = ValidationConfig;
