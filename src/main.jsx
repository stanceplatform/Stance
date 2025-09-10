import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css'
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
