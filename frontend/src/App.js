import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Home from './pages/Home';
import Upload from './pages/Upload';
import VideoPlayer from './pages/VideoPlayer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            
            {/* Protected Routes - Upload requires authentication */}
            <Route path="/upload" element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
  );
}

export default App;
