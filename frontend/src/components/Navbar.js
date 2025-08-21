import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './common/ProfileDropdown';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement search functionality
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/20 backdrop-blur-xl">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">ClipSync</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Video Platform</p>
              </div>
            </div>
          </div>

          {/* Search Bar - Responsive */}
          <div className="flex flex-1 max-w-2xl mx-4 md:mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <svg className={`h-4 w-4 md:h-5 md:w-5 transition-colors duration-200 ${isSearchFocused ? 'text-primary-500' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search videos..."
                  className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2 md:py-3 bg-white/90 backdrop-blur-md border border-white/30 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 placeholder-gray-500 text-gray-900 text-sm md:text-base"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Upload Button */}
            <button 
              onClick={handleUploadClick}
              className="btn-primary flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* Notifications */}
            <button className="relative btn-ghost">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              </svg>
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
