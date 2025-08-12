import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="spinner"></div>
        <span className="text-gray-700 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
