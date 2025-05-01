import React from 'react';
import { createRoot } from 'react-dom/client';
// Import necessary components from react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import VerticalFlashcardGallery from './VerticalFlashcardGallery.tsx';
import NavigationBarBottom from './navigation-bar-bottom.tsx';
import Profile from './profile.tsx';

const container = document.getElementById('root');
if (!container) throw new Error('Root not found');

// Use createRoot to render the main App component with Router
createRoot(container).render(
  <React.StrictMode>
    {/* Wrap the application with Router for navigation */}
    <Router>
      <div className="App">
        <div className="main-content">
          {/* Define the routes using Routes and Route components */}
          <Routes>
            {/* Route for the home page and flashcards page */}
            <Route path="/" element={<VerticalFlashcardGallery />} />
            <Route path="/flashcards" element={<VerticalFlashcardGallery />} />
            {/* Route for the profile page */}
            <Route path="/profile" element={<Profile />} />
            {/* Add other routes here as needed */}
          </Routes>
        </div>
        {/* Include the bottom navigation bar */}
        <NavigationBarBottom />
      </div>
    </Router>
  </React.StrictMode>
);
