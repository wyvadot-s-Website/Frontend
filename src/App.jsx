import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import About from './pages/About.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Projects from './pages/Projects.jsx'
import Products from './pages/Products.jsx'
import NotFound from './pages/NotFound.jsx'

// Main App
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App