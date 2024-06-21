import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Map from './pages/Map'
import Login from './pages/Login'
import Temp from './pages/temp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/map' element={<Map />} />
          <Route path='/login' element={<Login />} />
          <Route path='/temp' element={<Temp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
