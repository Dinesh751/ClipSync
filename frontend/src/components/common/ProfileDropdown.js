import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/ProfileDropdown.css';

const ProfileDropdown = ({ onUploadClick }) => {
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

  const handleUpload = () => {
    setIsOpen(false);
    if (onUploadClick) {
      onUploadClick();
    }
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
    <div className="profile-dropdown" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        className="profile-button"
        onClick={handleToggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          {getUserInitials(user?.name)}
        </div>
        <span className="profile-name">{user?.name}</span>
        <svg
          className={`profile-chevron ${isOpen ? 'rotated' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="profile-menu">
          <div className="profile-menu-header">
            <div className="profile-avatar-large">
              {getUserInitials(user?.name)}
            </div>
            <div className="profile-info">
              <div className="profile-info-name">{user?.name}</div>
              <div className="profile-info-email">{user?.email}</div>
            </div>
          </div>
          
          <div className="profile-menu-divider"></div>
          
          <div className="profile-menu-items">
            <button className="profile-menu-item" onClick={handleUpload}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"></path>
                <polyline points="12,11 12,16"></polyline>
                <polyline points="9,14 12,11 15,14"></polyline>
              </svg>
              <span>Upload Video</span>
            </button>
            
            <div className="profile-menu-divider"></div>
            
            <button className="profile-menu-item" onClick={handleProfile}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </button>
            
            <button className="profile-menu-item" onClick={handleSettings}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
              </svg>
              <span>Settings</span>
            </button>
            
            <div className="profile-menu-divider"></div>
            
            <button className="profile-menu-item logout" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
