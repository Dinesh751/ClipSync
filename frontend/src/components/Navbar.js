import React from 'react';
import ProfileDropdown from './common/ProfileDropdown';
import '../styles/components/Navbar.css';

const Navbar = ({ onUploadClick }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            {/* ClipSync Icon */}
            <div className="navbar-logo">
              ▶
            </div>
            <h1 className="navbar-title">ClipSync</h1>
          </div>
          
          <div className="navbar-actions">
            {/* Profile Dropdown */}
            <ProfileDropdown onUploadClick={onUploadClick} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
