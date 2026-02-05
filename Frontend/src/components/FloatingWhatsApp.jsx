// src/components/FloatingWhatsApp.jsx
import { useState } from 'react';
import logo from '../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png';

function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Replace with your actual WhatsApp number (include country code, no + or spaces)
  const whatsappNumber = '2348102730544'; // Example: Nigerian number
  const message = encodeURIComponent('Hello! I need assistance with your services on the wyvadot PR website.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Chat with us on WhatsApp"
    >
      {/* Floating Button */}
      <div className="relative">
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 bg-[#FF8D28] rounded-full animate-ping opacity-75"></div>
        
        {/* Main button */}
        <div className="relative bg-transparent rounded-full transition-all duration-300 transform hover:scale-110">
          <img 
            src={logo} 
            alt="Customer Service" 
            className="h-20 w-20 object-contain"
          />
        </div>

        {/* Online indicator dot */}
        <div className="absolute top-5 -right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute left-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="border-8 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      )}
    </a>
  );
}

export default FloatingWhatsApp;