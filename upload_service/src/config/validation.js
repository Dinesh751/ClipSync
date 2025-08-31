const path = require('path');
const crypto = require('crypto');

class ValidationConfig {
    static validateInitParams(fileName, totalChunks, fileSize) {
        const errors = [];
        
        if (!fileName || fileName.trim().length === 0) {
            errors.push('File name is required');
        }
        
        if (!totalChunks || isNaN(parseInt(totalChunks)) || parseInt(totalChunks) <= 0) {
            errors.push('Total chunks must be a positive number');
        }
        
        if (!fileSize || isNaN(parseInt(fileSize)) || parseInt(fileSize) <= 0) {
            errors.push('File size must be a positive number');
        }
        
        // File size limit (100MB)
        if (parseInt(fileSize) > 100 * 1024 * 1024) {
            errors.push('File size cannot exceed 100MB');
        }
        
        // File extension validation
        const allowedExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.webm'];
        const fileExtension = path.extname(fileName).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            errors.push('Invalid file type. Allowed: mp4, avi, mov, wmv, webm');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static generateUploadId(fileName) {
        // Extract base name (remove path)
        const baseName = fileName.match(/[^\\/]+$/)[0];
        // Remove file extension to get just the name part
        const nameWithoutExt = path.parse(baseName).name;
        // Sanitize the filename
        const sanitizedName = this.sanitizeFilename(nameWithoutExt);
        // Generate unique part
        const uniquePart = crypto.randomBytes(16).toString('hex');
        return sanitizedName + '_' + uniquePart;
    }
    
    static sanitizeFilename(fileName) {
        return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    }
    
    static validateChunk(chunkIndex, chunkData, totalChunks) {
        const errors = [];
        
        if (chunkIndex < 0 || chunkIndex >= totalChunks) {
            errors.push('Invalid chunk index');
        }
        
        if (!chunkData || chunkData.length === 0) {
            errors.push('Chunk data is empty');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static validateVideoMetadata(title, description, category) {
        const errors = [];
        
        if (title && title.length > 100) {
            errors.push('Title cannot exceed 100 characters');
        }
        
        if (description && description.length > 500) {
            errors.push('Description cannot exceed 500 characters');
        }
        
        const validCategories = ['Entertainment', 'Education', 'Music', 'Gaming', 'News', 'Sports', 'Technology', 'Lifestyle', 'General'];
        if (category && !validCategories.includes(category)) {
            errors.push('Invalid category');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = ValidationConfig;
