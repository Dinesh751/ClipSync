import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

// Custom toast utilities for upload scenarios
const uploadToasts = {
  fileSelected: (filename) => toast.success(`File selected: ${filename}`, {
    icon: '📁',
    duration: 3000,
  }),
  
  invalidFileType: () => toast.error('Please select a valid video file (MP4, AVI, MOV, WMV, WebM)', {
    icon: '🎬',
    duration: 5000,
  }),
  
  fileTooLarge: (fileSize) => toast.error(`File is too large. Maximum size is 100MB. Your file is ${fileSize}.`, {
    icon: '📏',
    duration: 5000,
  }),
  
  uploadStarting: () => toast.loading('Starting upload...', {
    icon: '🚀',
  }),
  
  uploadProgress: (progress) => toast.loading(`Uploading... ${progress}%`, {
    icon: '⬆️',
  }),
  
  uploadSuccess: (title) => toast.success(`"${title}" uploaded successfully!`, {
    icon: '🎉',
    duration: 5000,
  }),
  
  uploadError: () => toast.error('Upload failed. Please check your connection and try again.', {
    icon: '❌',
    duration: 6000,
  }),
  
  missingFields: () => toast.error('Please fill in all required fields', {
    icon: '⚠️',
    duration: 4000,
  }),
  
  uploadCancelled: () => toast('Upload cancelled. Your changes were not saved.', {
    icon: '⚠️',
    duration: 3000,
  }),
  
  fileRemoved: () => toast('File removed. You can select a new file.', {
    icon: '🗑️',
    duration: 3000,
  }),
  
  processingVideo: () => toast.loading('Processing video...', {
    icon: '⚙️',
    duration: 0, // Persist until dismissed
  }),
  
  chunkUploadProgress: (chunkNumber, totalChunks) => toast.loading(`Uploading chunk ${chunkNumber} of ${totalChunks}...`, {
    icon: '📦',
  })
};

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
      uploadToasts.invalidFileType();
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      uploadToasts.fileTooLarge(formatFileSize(file.size));
      return;
    }

    setSelectedFile(file);
    // Auto-fill title from filename
    setVideoDetails(prev => ({
      ...prev,
      title: file.name.replace(/\.[^/.]+$/, "") // Remove extension
    }));
    setCurrentStep(2); // Move to details step
    
    uploadToasts.fileSelected(file.name);
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
      uploadToasts.missingFields();
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep(3); // Move to upload progress step

    // Show upload starting toast
    const uploadToast = uploadToasts.uploadStarting();

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
        
        // Dismiss loading toast and show success
        toast.dismiss(uploadToast);
        uploadToasts.uploadSuccess(videoDetails.title);
        
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
      
      // Dismiss loading toast and show error
      toast.dismiss(uploadToast);
      uploadToasts.uploadError();
      
      setIsUploading(false);
      setCurrentStep(2); // Go back to details step
    }
  };

  const handleClose = () => {
    // Show warning if closing with unsaved changes
    if (selectedFile && !uploadComplete && !isUploading) {
      const hasUnsavedChanges = videoDetails.title.trim() !== '' || videoDetails.description.trim() !== '';
      if (hasUnsavedChanges) {
        uploadToasts.uploadCancelled();
      }
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={handleClose}>
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-xl">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStep === 1 && 'Upload Video'}
                {currentStep === 2 && 'Video Details'}
                {currentStep === 3 && 'Uploading...'}
              </h2>
              <p className="text-sm text-gray-500">
                {currentStep === 1 && 'Select a video file to upload'}
                {currentStep === 2 && 'Add information about your video'}
                {currentStep === 3 && 'Processing your upload'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-colors duration-200 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Select File</span>
            <span>Add Details</span>
            <span>Upload</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: File Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {!selectedFile ? (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group hover:border-primary-400 hover:bg-primary-50/50 ${
                    isDragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-200 ${
                        isDragOver ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-primary-100'
                      }`}>
                        <svg className={`w-8 h-8 transition-colors duration-200 ${
                          isDragOver ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Drag and drop your video here
                      </h3>
                      <p className="text-gray-500">
                        or <span className="text-primary-600 font-medium">click to browse files</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      MP4, AVI, MOV, WMV, WebM (Max 100MB)
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                        <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setCurrentStep(1);
                        uploadToasts.fileRemoved();
                      }}
                      className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Video Details Form */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={videoDetails.title}
                    onChange={(e) => handleDetailsChange('title', e.target.value)}
                    placeholder="Enter a descriptive title for your video..."
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 placeholder-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">{videoDetails.title.length}/100 characters</p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={videoDetails.description}
                    onChange={(e) => handleDetailsChange('description', e.target.value)}
                    placeholder="Describe what your video is about..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 placeholder-gray-400 resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">{videoDetails.description.length}/500 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={videoDetails.category}
                      onChange={(e) => handleDetailsChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    >
                      <option value="Tutorial">📚 Tutorial</option>
                      <option value="Collaboration">🤝 Collaboration</option>
                      <option value="Demo">🎬 Demo</option>
                      <option value="Presentation">📊 Presentation</option>
                      <option value="Training">🎓 Training</option>
                      <option value="Other">📝 Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={videoDetails.tags}
                      onChange={(e) => handleDetailsChange('tags', e.target.value)}
                      placeholder="tutorial, guide, help"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 placeholder-gray-400"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-lg flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Selected File</h4>
                    <p className="text-sm text-blue-700">
                      {selectedFile?.name} ({formatFileSize(selectedFile?.size)})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload Progress */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
                    {uploadComplete ? (
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="animate-spin">
                        <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{videoDetails.title}</h3>
                  <p className="text-gray-500">{formatFileSize(selectedFile?.size)}</p>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {uploadComplete ? 'Upload Complete!' : `Uploading... ${Math.round(uploadProgress)}%`}
                    </span>
                    <span className="text-gray-500">{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              )}

              {uploadComplete && (
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                  <div className="space-y-2">
                    <div className="text-4xl">🎉</div>
                    <h4 className="font-semibold text-green-900">Upload Successful!</h4>
                    <p className="text-sm text-green-700">Your video has been uploaded and is being processed.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          {currentStep === 1 && (
            <>
              <button
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedFile}
                className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Next: Add Details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <button
                onClick={handleBackToFileSelection}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              <button
                onClick={handleUpload}
                disabled={!validateForm()}
                className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Video</span>
              </button>
            </>
          )}

          {currentStep === 3 && (
            <div className="w-full flex justify-center">
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="px-8 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadComplete ? 'Close' : 'Cancel Upload'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
