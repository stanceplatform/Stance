import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import AppRoutes from './AppRoutes';
import './styles/App.css';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <Container className="max-h-screen-dvh max-w-[480px] mx-auto overflow-hidden flex items-center justify-center">
        <AppRoutes />
      </Container>
      <Toaster
        position="bottom-center"
        gutter={8}
        toastOptions={{
          duration: 3000,
          // Base style for all toasts
          style: {
            padding: '10px 14px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow:
              '0 8px 24px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.18)',
            backdropFilter: 'blur(6px)',
            // keep it readable over photos
            background: 'rgba(255,255,255,0.92)',
            color: '#121212',
            // respect mobile safe-area
            marginBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
          },
          // Success = brand yellow
          success: {
            style: {
              background: '#F0E224',
              color: '#5B037C',
            },
            iconTheme: { primary: '#5B037C', secondary: '#F0E224' },
          },
          // Error = brand purple
          error: {
            style: {
              background: '#9105C6',
              color: '#ffffff',
            },
            iconTheme: { primary: '#ffffff', secondary: '#9105C6' },
          },
        }}
      />
    </>
  )
}

export default App
