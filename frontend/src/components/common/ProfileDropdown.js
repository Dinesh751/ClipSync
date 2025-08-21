import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfile = () => {
    setIsOpen(false);
    // TODO: Navigate to profile page
    console.log('Navigate to profile');
  };

  const handleSettings = () => {
    setIsOpen(false);
    // TODO: Navigate to settings page
    console.log('Navigate to settings');
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-white/50 transition-all duration-200 group"
        onClick={handleToggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-lg font-medium text-sm">
          {getUserInitials(user?.name)}
        </div>
        <span className="text-gray-700 font-medium hidden lg:block">{user?.name}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 hidden lg:block ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 animate-slide-down">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl font-semibold">
                {getUserInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
                <div className="text-sm text-gray-500 truncate">{user?.email}</div>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="p-2">
            
            <button 
              className="flex items-center w-full px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
              onClick={handleProfile}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg mr-3 group-hover:bg-green-200 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Profile</div>
                <div className="text-sm text-gray-500">Manage your account</div>
              </div>
            </button>
            
            <button 
              className="flex items-center w-full px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
              onClick={handleSettings}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Settings</div>
                <div className="text-sm text-gray-500">Preferences</div>
              </div>
            </button>
            
            <div className="my-2 border-t border-gray-100"></div>
            
            <button 
              className="flex items-center w-full px-3 py-3 text-left hover:bg-red-50 rounded-lg transition-colors duration-200 group"
              onClick={handleLogout}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg mr-3 group-hover:bg-red-200 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-red-600">Sign Out</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
