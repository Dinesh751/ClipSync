import React, { useState } from 'react';
import UploadModal from '../components/UploadModal';
import SearchBar from '../components/SearchBar';
import '../styles/components/VideoLibrary.css';

const VideoLibrary = ({ triggerUpload }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Getting Started with ClipSync",
      description: "Learn how to upload and manage your video content with ClipSync.",
      thumbnail: null, // Will show placeholder
      duration: "5:32",
      category: "Tutorial",
      uploadDate: "2 days ago"
    },
    {
      id: 2,
      title: "Advanced Video Features",
      description: "Explore advanced features for video editing and sharing.",
      thumbnail: null,
      duration: "8:45",
      category: "Tutorial",
      uploadDate: "1 week ago"
    },
    {
      id: 3,
      title: "Team Collaboration",
      description: "How to collaborate with your team using ClipSync.",
      thumbnail: null,
      duration: "6:18",
      category: "Collaboration",
      uploadDate: "3 days ago"
    },
    {
      id: 4,
      title: "Mobile App Demo",
      description: "Access your videos on the go with our mobile application.",
      thumbnail: null,
      duration: "4:22",
      category: "Mobile",
      uploadDate: "5 days ago"
    }
  ]);

  const handleVideoClick = (video) => {
    console.log('Playing video:', video);
    // Add your video player logic here
  };

  const handleUpload = (newVideo) => {
    // Add the new video to the beginning of the list
    setVideos(prevVideos => [newVideo, ...prevVideos]);
    console.log('Video uploaded successfully:', newVideo);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Search term is used by SearchBar for server recommendations
    // No local filtering needed here
  };

  // Open upload modal when triggerUpload changes
  React.useEffect(() => {
    if (triggerUpload) {
      setIsUploadModalOpen(true);
    }
  }, [triggerUpload]);

  return (
    <div className="video-library-container">
      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        placeholder="Search videos..."
      />

      {/* Video Grid */}
      {videos.length > 0 ? (
        <div className="video-grid">
          {videos.map(video => (
            <div 
              key={video.id} 
              className="video-card"
              onClick={() => handleVideoClick(video)}
            >
              <div className="video-thumbnail">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} />
                ) : (
                  <div className="video-placeholder">🎬</div>
                )}
                <div className="video-play-button">▶</div>
              </div>
              
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                <div className="video-meta">
                  <span>{video.uploadDate}</span>
                  <span className="video-duration">{video.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h3 className="empty-state-title">No videos available</h3>
          <p className="empty-state-description">
            Upload your first video to get started with ClipSync.
          </p>
        </div>
      )}
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default VideoLibrary;
