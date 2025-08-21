import React, { useState } from 'react';

const VideoLibrary = () => {
  const [videos] = useState([
    {
      id: 1,
      title: "Getting Started with ClipSync",
      description: "Learn the basics of video upload and content management.",
      thumbnail: null,
      duration: "5:32",
      views: "1.2k",
      likes: 48
    },
    {
      id: 2,
      title: "Advanced Video Features",
      description: "Explore advanced editing and sharing capabilities.",
      thumbnail: null,
      duration: "8:45",
      views: "856",
      likes: 32
    },
    {
      id: 3,
      title: "Team Collaboration Guide",
      description: "Collaborate effectively with your team members.",
      thumbnail: null,
      duration: "6:18",
      views: "2.1k",
      likes: 67
    },
    {
      id: 4,
      title: "Mobile App Tutorial",
      description: "Access your videos anywhere with mobile app.",
      thumbnail: null,
      duration: "4:22",
      views: "945",
      likes: 28
    }
  ]);

  const handleVideoClick = (video) => {
    console.log('Playing video:', video);
  };

  // Helper function to trim text to specific length
  const trimText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="space-y-8">
      {/* Simple Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map(video => (
          <div 
            key={video.id} 
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => handleVideoClick(video)}
          >
            {/* Video Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {trimText(video.title, 35)}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {trimText(video.description, 50)}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{video.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{video.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoLibrary;
