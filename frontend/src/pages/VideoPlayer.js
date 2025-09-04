import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Simulate fetching video data
    const fetchVideo = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock video data
        const mockVideo = {
          id: 123,
          title: "Sample Video Title",
          description: "This is a sample video description. In a real application, this would be fetched from your backend API.",
          views: "1.2K",
          likes: "145",
          dislikes: "3",
          uploadDate: "2024-01-15",
          duration: "5:42",
          creator: {
            name: "John Doe",
            avatar: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff&size=40",
            subscribers: "50.2K"
          },
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Placeholder
          tags: ["technology", "tutorial", "demo"]
        };
        
        setVideo(mockVideo);
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLike = () => {
    toast.success('Video liked!');
  };

  const handleDislike = () => {
    toast.success('Video disliked!');
  };

  const handleSubscribe = () => {
    toast.success('Subscribed to channel!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Video Player Skeleton */}
            <div className="aspect-video bg-gray-300 rounded-2xl mb-6"></div>
            
            {/* Title Skeleton */}
            <div className="h-8 bg-gray-300 rounded-xl mb-4 max-w-2xl"></div>
            
            {/* Creator Info Skeleton */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-300 rounded-lg w-32"></div>
                <div className="h-4 bg-gray-300 rounded-lg w-24"></div>
              </div>
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded-lg"></div>
              <div className="h-4 bg-gray-300 rounded-lg max-w-3xl"></div>
              <div className="h-4 bg-gray-300 rounded-lg max-w-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Not Found</h2>
          <p className="text-gray-600 mb-6">The video you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ClipSync
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                {/* Placeholder for video player */}
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors"
                       onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? (
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-lg font-medium">
                    {isPlaying ? 'Playing...' : 'Click to play video'}
                  </p>
                  <p className="text-sm text-gray-300 mt-2">Duration: {video.duration}</p>
                </div>
                
                {/* Video controls overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{video.views} views</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm">{new Date(video.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-black/50 px-2 py-1 rounded">{video.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{video.title}</h1>
              
              {/* Creator Info and Actions */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={video.creator.avatar}
                    alt={video.creator.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{video.creator.name}</h3>
                    <p className="text-sm text-gray-500">{video.creator.subscribers} subscribers</p>
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300"
                  >
                    Subscribe
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm font-medium">{video.likes}</span>
                  </button>
                  
                  <button
                    onClick={handleDislike}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 4H19a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                    <span className="text-sm font-medium">{video.dislikes}</span>
                  </button>
                </div>
              </div>
              
              {/* Description */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{video.description}</p>
                
                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Videos */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-4">Related Videos</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                    <div className="w-24 h-16 bg-gray-300 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        Related Video Title {index}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Creator Name</p>
                      <p className="text-xs text-gray-500">100K views • 2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
