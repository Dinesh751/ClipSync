const express = require('express');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const upload = multer();

const router = express.Router();


// upload initialization endpoint
router.post('/init', uploadController.uploadInitialization);

// Upload endpoint placeholder
router.post('/video', upload.single('file'), uploadController.uploadVideo);

module.exports = router;
