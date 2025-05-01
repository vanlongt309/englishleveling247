// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import VerticalFlashcardGallery from './VerticalFlashcardGallery';
import './index.css'; // nếu có custom styles

// Tìm thẻ <div id="root"></div> trong public/index.html
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found in HTML');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <VerticalFlashcardGallery />
  </React.StrictMode>
);
