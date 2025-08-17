const express = require('express');

const router = express.Router();

// Upload endpoint placeholder
router.post('/', (req, res) => {
  console.log('Upload request received');
  res.json({
    success: true,
    message: 'Upload service is ready',
    data: {
      uploadId: 'temp_' + Date.now(),
      status: 'pending'
    }
  });
});

// Video status endpoint
router.get('/status/:videoId', (req, res) => {
  const { videoId } = req.params;
  
  // Simulate different processing statuses
  const statuses = ['UPLOADED', 'PROCESSING', 'TRANSCODING', 'PROCESSED', 'FAILED'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  res.json({
    success: true,
    message: 'Video status retrieved',
    data: {
      videoId: videoId,
      status: randomStatus,
      progress: randomStatus === 'PROCESSING' ? Math.floor(Math.random() * 100) : 
                randomStatus === 'PROCESSED' ? 100 : 0,
      processingSteps: {
        uploaded: true,
        transcoding: randomStatus !== 'UPLOADED',
        thumbnailGeneration: randomStatus === 'PROCESSED',
        qualityVariants: randomStatus === 'PROCESSED'
      },
      estimatedTimeRemaining: randomStatus === 'PROCESSING' ? `${Math.floor(Math.random() * 10)} minutes` : null
    }
  });
});

module.exports = router;
