

import React from 'react';
import Navbar from '../components/Navbar';
import VideoLibrary from './VideoLibrary';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoLibrary />
        </div>
      </main>
    </div>
  );
};

export default Home;