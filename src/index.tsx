import React from 'react';
import { createRoot } from 'react-dom/client';
import NavigationBarBottom from './navigation-bar-bottom.tsx';
import VerticalFlashcardGallery from './VerticalFlashcardGallery.tsx';
import Profile from './profile.tsx';

const container = document.getElementById('root');
if (!container) throw new Error('Root not found');
createRoot(container).render(
  <React.StrictMode>
    <VerticalFlashcardGallery />
    <Profile />
    <NavigationBarBottom />
  </React.StrictMode>
);
    
