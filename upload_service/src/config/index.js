module.exports = {
    upload: {
        maxConcurrentUploads: 10,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedExtensions: ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
        chunkSize: 1024 * 1024 // 1MB chunks
    },
    storage: {
        localPath: require('path').join(__dirname, '../../uploads')
    },
    server: {
        port: process.env.PORT || 6002,
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000'
        }
    },
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        s3: {
            bucketName: process.env.S3_BUCKET_NAME || 'clipsync-videos',
            endpoint: process.env.S3_ENDPOINT
        }
    }
};
