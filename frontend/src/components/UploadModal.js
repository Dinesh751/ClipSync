import React, { useState, useRef } from 'react';
import '../styles/components/UploadModal.css';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: File selection, 2: Video details
  const fileInputRef = useRef(null);

  // Video details form state
  const [videoDetails, setVideoDetails] = useState({
    title: '',
    description: '',
    category: 'Tutorial',
    tags: ''
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, AVI, MOV, WMV, WebM)');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      alert('File size should be less than 100MB');
      return;
    }

    setSelectedFile(file);
    // Auto-fill title from filename
    setVideoDetails(prev => ({
      ...prev,
      title: file.name.replace(/\.[^/.]+$/, "") // Remove extension
    }));
    setCurrentStep(2); // Move to details step
  };

  const handleDetailsChange = (field, value) => {
    setVideoDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBackToFileSelection = () => {
    setCurrentStep(1);
  };

  const validateForm = () => {
    return videoDetails.title.trim() !== '' && videoDetails.description.trim() !== '';
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep(3); // Move to upload progress step

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Dummy API call - replace with your actual upload endpoint
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', videoDetails.title);
      formData.append('description', videoDetails.description);
      formData.append('category', videoDetails.category);
      formData.append('tags', videoDetails.tags);

      // Simulated API call
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        
        // Create a video object for the parent component
        const newVideo = {
          id: Date.now(),
          title: videoDetails.title,
          description: videoDetails.description,
          thumbnail: null,
          duration: "0:00", // In real app, extract from video
          category: videoDetails.category,
          uploadDate: "Just now",
          tags: videoDetails.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          file: selectedFile
        };

        setUploadComplete(true);
        
        // Call parent's upload handler
        setTimeout(() => {
          onUpload(newVideo);
          handleClose();
        }, 1500);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      clearInterval(progressInterval);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setIsDragOver(false);
    setCurrentStep(1);
    setVideoDetails({
      title: '',
      description: '',
      category: 'Tutorial',
      tags: ''
    });
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay" onClick={handleClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upload-modal-header">
          <h2>
            {currentStep === 1 && 'Upload Video'}
            {currentStep === 2 && 'Video Details'}
            {currentStep === 3 && 'Uploading...'}
          </h2>
          <button className="upload-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="upload-modal-content">
          {/* Step 1: File Selection */}
          {currentStep === 1 && (
            <>
              {!selectedFile ? (
                <div
                  className={`upload-drop-zone ${isDragOver ? 'drag-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="upload-drop-icon">📁</div>
                  <h3>Drag and drop your video here</h3>
                  <p>or click to browse files</p>
                  <div className="upload-file-types">
                    Supported formats: MP4, AVI, MOV, WMV, WebM (Max 100MB)
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="upload-file-preview">
                  <div className="file-info">
                    <div className="file-icon">🎬</div>
                    <div className="file-details">
                      <h4>{selectedFile.name}</h4>
                      <p>{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      className="remove-file"
                      onClick={() => setSelectedFile(null)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2: Video Details Form */}
          {currentStep === 2 && (
            <div className="video-details-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  value={videoDetails.title}
                  onChange={(e) => handleDetailsChange('title', e.target.value)}
                  placeholder="Enter video title..."
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={videoDetails.description}
                  onChange={(e) => handleDetailsChange('description', e.target.value)}
                  placeholder="Describe your video..."
                  rows={4}
                  maxLength={500}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={videoDetails.category}
                    onChange={(e) => handleDetailsChange('category', e.target.value)}
                  >
                    <option value="Tutorial">Tutorial</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Demo">Demo</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags</label>
                  <input
                    id="tags"
                    type="text"
                    value={videoDetails.tags}
                    onChange={(e) => handleDetailsChange('tags', e.target.value)}
                    placeholder="tutorial, guide, help (comma separated)"
                  />
                </div>
              </div>

              <div className="selected-file-info">
                <strong>Selected file:</strong> {selectedFile?.name} ({formatFileSize(selectedFile?.size)})
              </div>
            </div>
          )}

          {/* Step 3: Upload Progress */}
          {currentStep === 3 && (
            <div className="upload-file-preview">
              <div className="file-info">
                <div className="file-icon">🎬</div>
                <div className="file-details">
                  <h4>{videoDetails.title}</h4>
                  <p>{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {uploadComplete ? 'Upload Complete!' : `Uploading... ${Math.round(uploadProgress)}%`}
                  </div>
                </div>
              )}

              {uploadComplete && (
                <div className="upload-success">
                  <div className="success-icon">✅</div>
                  <p>Video uploaded successfully!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="upload-modal-footer">
          {currentStep === 1 && (
            <>
              <button
                className="upload-modal-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="upload-modal-upload"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedFile}
              >
                Next: Add Details
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <button
                className="upload-modal-cancel"
                onClick={handleBackToFileSelection}
              >
                Back
              </button>
              <button
                className="upload-modal-upload"
                onClick={handleUpload}
                disabled={!validateForm()}
              >
                Upload Video
              </button>
            </>
          )}

          {currentStep === 3 && (
            <button
              className="upload-modal-cancel"
              onClick={handleClose}
              disabled={isUploading}
            >
              {uploadComplete ? 'Close' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
