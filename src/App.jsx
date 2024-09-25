import { useState } from 'react'
import AppRoutes from './AppRoutes'; // Import the Routes component
import './App.css'
import Landing from './Landing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes /> {/* Use the Routes component here */}
    </>
  )
}

export default App
