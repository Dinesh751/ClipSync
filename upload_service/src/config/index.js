require('dotenv').config();

const config = {

    // Server configuration

    server : {
        port: process.env.PORT || 5002, // Upload service port
        env: process.env.NODE_ENV || 'development', // Default environment is development
    },

    // upload configuration
    upload: {
        requestSize: process.env.REQUEST_SIZE || '500mb', // Max request size (0-500mb)
        maxFileSize: process.env.MAX_FILE_SIZE || '500mb', // Max single file size  
        minFileSize: process.env.MIN_FILE_SIZE || '1mb',   // Min single file size (fixed from 1kb)
        allowedFormats: process.env.ALLOWED_FORMATS || 'mp4,avi,mov,wmv,webm,mkv', // Allowed video formats
        chunkSize: process.env.CHUNK_SIZE || '5mb',
        maxConcurrentUploads: process.env.MAX_CONCURRENT_UPLOADS || 10
    },

    // Database configuration
    database: {},

    // Storage configuration
    storage: {
        type: process.env.STORAGE_TYPE || 'local', // Default to local storage
        localPath: process.env.LOCAL_STORAGE_PATH || './uploads', // Local storage path
        tempPath: process.env.TEMP_STORAGE_PATH || './temp', // Temporary storage path
    },

    // Aws S3 configuration
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1', // Default region
        bucketName: process.env.AWS_BUCKET_NAME || 'your-bucket-name', // Default bucket name
    },

     // Kafka Configuration (for future use)
  kafka: {
    brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
    topics: {
      videoUploaded: process.env.KAFKA_TOPIC_VIDEO_UPLOADED || 'video.uploaded',
      videoProcessed: process.env.KAFKA_TOPIC_VIDEO_PROCESSED || 'video.processed'
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },

  // Validation helpers
  validation: {
    getMaxFileSizeInBytes() {
        return this.parseSize(config.upload.maxFileSize); // Fixed: use config instead of this
    },

    getMinFileSizeInBytes() {
       return this.parseSize(config.upload.minFileSize); // Fixed: use config instead of this
    },

    getAllowedFormatsArray() { // Fixed: method name typo
        return config.upload.allowedFormats.split(',').map((format) => format.trim()); // Fixed: use config instead of this
    },

    parseSize(sizeStr) {
        const units = {"kb": 1024, "mb": 1024 ** 2, "gb": 1024 ** 3};
        
        // Complete regex with non-capturing group
        const match = sizeStr.toLowerCase().match(/^(\d+(?:\.\d+)?)(kb|mb|gb)$/);
        
        if (!match) {
            // If no match, assume it's bytes (plain number)
            const bytes = parseInt(sizeStr);
            if (isNaN(bytes)) {
                throw new Error(`Invalid size format: ${sizeStr}. Expected format: "500mb", "1.5gb", etc.`);
            }
            return bytes;
        }

        const [fullMatch, number, unit] = match;
        const numericValue = parseFloat(number);
        
        if (isNaN(numericValue)) {
            throw new Error(`Invalid numeric value: ${number}`);
        }

        return Math.floor(numericValue * units[unit]); // Fixed: use Math.floor instead of Math.ceil
    },

    // Added missing helper methods for validation.js compatibility
    getUploadLimits() {
        return {
            maxFileSize: config.upload.maxFileSize,
            minFileSize: config.upload.minFileSize,
            allowedFormats: this.getAllowedFormatsArray(),
            chunkSize: config.upload.chunkSize,
            maxFileSizeBytes: this.getMaxFileSizeInBytes(),
            minFileSizeBytes: this.getMinFileSizeInBytes(),
            chunkSizeBytes: this.parseSize(config.upload.chunkSize),
            maxConcurrentUploads: config.upload.maxConcurrentUploads
        };
    }
  }
};

module.exports = config;