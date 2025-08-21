import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef();
  
  const [uploadState, setUploadState] = useState({
    file: null,
    title: '',
    description: '',
    category: '',
    tags: '',
    thumbnail: null,
    uploading: false,
    progress: 0
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      setUploadState(prev => ({ ...prev, file }));
      toast.success('Video file selected successfully');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setUploadState(prev => ({ ...prev, file }));
      toast.success('Video file dropped successfully');
    } else {
      toast.error('Please drop a valid video file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!uploadState.file || !uploadState.title.trim()) {
      toast.error('Please select a file and enter a title');
      return;
    }

    setUploadState(prev => ({ ...prev, uploading: true, progress: 0 }));
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 500);

      // Simulate API call
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadState(prev => ({ ...prev, progress: 100 }));
        
        setTimeout(() => {
          toast.success('Video uploaded successfully!');
          navigate('/');
        }, 1000);
      }, 5000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
      setUploadState(prev => ({ ...prev, uploading: false, progress: 0 }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upload Video
            </h1>
            <div className="w-20"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Video File</h2>
              
              {!uploadState.file ? (
                <div
                  className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Drop your video here</p>
                      <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      <p>Supported formats: MP4, MOV, AVI, WMV</p>
                      <p>Maximum size: 100MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{uploadState.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadState.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadState(prev => ({ ...prev, file: null }))}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Upload Progress */}
            {uploadState.uploading && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Uploading...</h3>
                  <span className="text-sm text-gray-500">{uploadState.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${uploadState.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Processing your video... This may take a few minutes.
                </p>
              </div>
            )}
          </div>

          {/* Video Details Section */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Video Details</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadState.title}
                    onChange={(e) => setUploadState(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter video title..."
                    disabled={uploadState.uploading}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={uploadState.description}
                    onChange={(e) => setUploadState(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Describe your video..."
                    disabled={uploadState.uploading}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={uploadState.category}
                    onChange={(e) => setUploadState(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={uploadState.uploading}
                  >
                    <option value="">Select a category</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="education">Education</option>
                    <option value="music">Music</option>
                    <option value="gaming">Gaming</option>
                    <option value="news">News</option>
                    <option value="sports">Sports</option>
                    <option value="technology">Technology</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={uploadState.tags}
                    onChange={(e) => setUploadState(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter tags separated by commas..."
                    disabled={uploadState.uploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use tags to help people discover your video
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!uploadState.file || !uploadState.title.trim() || uploadState.uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {uploadState.uploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Upload Video</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
