import { useState } from 'react'
import AppRoutes from './AppRoutes'; // Import the Routes component
import './App.css'
import Landing from './Landing'
import { Container } from 'react-bootstrap';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container className='max-h-screen overflow-hidden'>
      <AppRoutes /> {/* Use the Routes component here */}
    </Container>
  )
}

export default App
