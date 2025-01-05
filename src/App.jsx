import { useState } from 'react'
import AppRoutes from './AppRoutes'; // Import the Routes component
import './styles/App.css'
import { Container } from 'react-bootstrap';

function App() {
  const [count, setCount] = useState(0)

  return (
<Container className="max-h-screen-dvh overflow-hidden flex items-center justify-center">
  <AppRoutes /> {/* Use the Routes component here */}
</Container>

  )}

export default App
