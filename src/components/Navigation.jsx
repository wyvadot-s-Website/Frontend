import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png'

// Navigation Component
function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-1">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Wyradot PR Logo" className="h-10" />
          </div>
          
          {/* Navigation Links */}
          <div className="flex gap-8">
            <Link 
              to="/" 
              className={`font-medium ${isActive('/') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium ${isActive('/about') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              About Us
            </Link>
            <Link 
              to="/projects" 
              className={`font-medium ${isActive('/projects') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Projects
            </Link>
            <Link 
              to="/services" 
              className={`font-medium ${isActive('/services') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Our Services
            </Link>
            <Link 
              to="/shop" 
              className={`font-medium ${isActive('/shop') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Shop
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium ${isActive('/blog') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Blog
            </Link>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <button className="bg-[#FF8D28] text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-medium">
              Book us now
            </button>
            <button className="bg-[#F3F4F6] text-black px-4 py-2.5 rounded-lg hover:bg-gray-50 font-medium">
              Shop with us
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation