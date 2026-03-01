import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, AuthContext } from './AuthContext'
import Navbar from "../components/navbar"
import Home from "../components/Hero"
import About from "../components/About"
import LoginButton from "../components/Login"
import Upload from "../components/Upload"
import BrtConv from '../components/srtConv'
const AppContent = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  
  // Hide navbar on login page
  return (
    <>
     
      
      {location.pathname !== '/login' &&  <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginButton />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/convert" element={<BrtConv />} />
      </Routes>
    </>
  )
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
