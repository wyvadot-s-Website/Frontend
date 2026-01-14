import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from '@/pages/AuthModal.jsx';
import logo from '../../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png';

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };
  
  return (
    <>
      <nav className="bg-transparent sticky top-0 z-50 pt-5">
        <div className="max-w-6xl mx-auto px-6 py-2 shadow-lg lg:rounded-full bg-white">
          <div className="flex justify-between items-center h-11 ">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <img src={logo} alt="Wyvadot PR Logo" className="h-12" />
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex gap-6 items-center">
              <Link 
                to="/" 
                className={`font-medium transition-colors ${isActive('/') ? 'bg-[#FF8D28] text-black px-5 py-2 rounded-full' : 'text-gray-700 hover:text-orange-500'}`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`font-medium transition-colors ${isActive('/about') ? 'bg-[#FF8D28] text-black px-5 py-2 rounded-full' : 'text-gray-700 hover:text-orange-500'}`}
              >
                About Us
              </Link>
               <Link 
                to="/services" 
                className={`font-medium transition-colors ${isActive('/services') ? 'bg-[#FF8D28] text-black px-5 py-2 rounded-full' : 'text-gray-700 hover:text-orange-500'}`}
              >
                Our Services
              </Link>
              <Link 
                to="/projects" 
                className={`font-medium transition-colors ${isActive('/projects') ? 'bg-[#FF8D28] text-black px-5 py-2 rounded-full' : 'text-gray-700 hover:text-orange-500'}`}
              >
                Projects
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium transition-colors ${isActive('/contact') ? 'bg-[#FF8D28] text-black px-5 py-2 rounded-full' : 'text-gray-700 hover:text-orange-500'}`}
              >
                Contact Us
              </Link>
            </div>
            
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-3 items-center">
              <button onClick={() => setShowAuthModal(true)} className={`font-medium transition-colors bg-[#FF8D28] text-white px-5 py-2 rounded-full text-gray-700 cursor-pointer `}>Get Started</button>

<AuthModal 
  isOpen={showAuthModal} 
  onClose={() => setShowAuthModal(false)} 
  initialView="signup"
/>
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
                  to="/contact" 
                  onClick={handleLinkClick}
                  className={`font-medium transition-colors px-2 py-2 rounded ${isActive('/contact') ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
                >
                  Contact Us
                </Link>
                
                {/* Mobile Action Buttons */}
                <div className="pt-4 space-y-3 border-t border-gray-200">
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-[#FF8D28] text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 font-medium transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialView="signup"
      />
    </>
  );
}

export default PublicNavbar;