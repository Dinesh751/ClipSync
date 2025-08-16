

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import VideoLibrary from './VideoLibrary';
import '../styles/pages/Home.css';

const Home = () => {
  const [triggerUpload, setTriggerUpload] = useState(0);

  const handleNavbarUpload = () => {
    // Trigger upload modal by incrementing the trigger value
    setTriggerUpload(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onUploadClick={handleNavbarUpload} />

      {/* Main Content */}
      <main className="home-content">
        <div className="px-4">
          <div className="home-main-content">
            <VideoLibrary triggerUpload={triggerUpload} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;