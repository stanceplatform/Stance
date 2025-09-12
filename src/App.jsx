import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import AppRoutes from './AppRoutes';
import './styles/App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container className="max-h-screen-dvh max-w-[480px] mx-auto overflow-hidden flex items-center justify-center">
      <AppRoutes /> {/* Use the Routes component here */}
    </Container>

  )
}

export default App
