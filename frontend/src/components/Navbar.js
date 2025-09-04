import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './common/ProfileDropdown';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
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

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Upload Button - only for logged in users */}
            {user && (
              <button 
                onClick={handleUploadClick}
                className="btn-primary flex items-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="hidden sm:inline">Upload</span>
              </button>
            )}

            {/* Conditional Auth Buttons/ProfileDropdown */}
            {!user ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <ProfileDropdown />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
