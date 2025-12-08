import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png"
function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-1">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Wyvadot PR Logo" className="h-10" />
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex gap-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${isActive('/') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${isActive('/about') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              About Us
            </Link>
            <Link 
              to="/projects" 
              className={`font-medium transition-colors ${isActive('/projects') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Projects
            </Link>
            <Link 
              to="/services" 
              className={`font-medium transition-colors ${isActive('/services') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Our Services
            </Link>
            <Link 
              to="/shop" 
              className={`font-medium transition-colors ${isActive('/shop') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Shop
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium transition-colors ${isActive('/blog') ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
            >
              Blog
            </Link>
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex gap-3 items-center">
            <button className="bg-[#FF8D28] text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-medium transition-colors text-sm lg:text-base whitespace-nowrap">
              Book us now
            </button>
            <button className="bg-[#F3F4F6] text-black px-4 py-2.5 rounded-lg hover:bg-gray-300 font-medium transition-colors text-sm lg:text-base whitespace-nowrap">
              Shop with us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={handleLinkClick}
                className={`font-medium transition-colors px-2 py-2 rounded ${isActive('/') ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                onClick={handleLinkClick}
                className={`font-medium transition-colors px-2 py-2 rounded ${isActive('/about') ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
              >
                About Us
              </Link>
              <Link 
                to="/projects" 
                onClick={handleLinkClick}
                className={`font-medium transition-colors px-2 py-2 rounded ${isActive('/projects') ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
              >
                Projects
              </Link>
              <Link 
                to="/services" 
                onClick={handleLinkClick}
                className={`font-medium transition-colors px-2 py-2 rounded ${isActive('/services') ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
              >
                Our Services
              </Link>
              <Link 
                to="/shop" 
                onClick={handleLinkClick}
                className={`font-medium transition-colors px-2 py-2 rounded ${isActive('/shop') ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
              >
                Shop
              </Link>
              <Link 
                to="/blog" 
                onClick={handleLinkClick}
                className={`font-medium transition-colors px-2 py-2 rounded ${isActive('/blog') ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
              >
                Blog
              </Link>
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <button className="w-full bg-[#FF8D28] text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-medium transition-colors">
                  Book us now
                </button>
                <button className="w-full bg-[#F3F4F6] text-black px-4 py-2.5 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                  Shop with us
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;