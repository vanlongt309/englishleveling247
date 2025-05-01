import React from 'react';
import { createRoot } from 'react-dom/client';
import VerticalFlashcardGallery from './VerticalFlashcardGallery.tsx';

const container = document.getElementById('root');
if (!container) throw new Error('Root not found');
createRoot(container).render(<VerticalFlashcardGallery />);
