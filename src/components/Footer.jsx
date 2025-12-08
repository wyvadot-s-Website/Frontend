// Footer Component
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png'

function Footer() {
  return (
    <footer className="bg-[#FAFAFA] pt-12 pb-0 flex flex-col">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-4 ">
              <img src={logo} alt="Wyvadot PR Logo" className="w-60" />
            </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-2">
          {/* About Us Section */}
          <div>
            
            <h3 className="font-bold text-gray-800 mb-3">About us</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Wyvadot PR Products & Resources Ltd is a leading construction and maintenance service provider dedicated to delivering exceptional quality work, providing peace of mind to clients, and offering streamlined project management solutions.
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
              <li><Link to="/about" className="hover:text-orange-500">About Us</Link></li>
              <li><Link to="/projects" className="hover:text-orange-500">Projects</Link></li>
              <li><Link to="/shop" className="hover:text-orange-500">Shop</Link></li>
              <li><Link to="/blog" className="hover:text-orange-500">Blog</Link></li>
            </ul>
          </div>
          
          {/* Quality Commitment Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quality Commitment</h3>
            <div className="space-y-3 text-gray-600 text-sm">
              <p>
                <span className="font-semibold">Objective 1:</span> We achieve customer satisfaction by delivering products and service that meet or exceed their requirements
              </p>
              <p>
                <span className="font-semibold">Objective 2:</span> To Continuously improve internal processes to enhance efficiency, productivity and quality
              </p>
              <p>
                <span className="font-semibold">Objective 3:</span> To Ensure compliance with relevant industry standards, regulations, and best practices, while retaining Spirit of Innovation.
              </p>
              <p>
                <span className="font-semibold">Objective 4:</span> To Foster a culture of quality and continuous improvement throughout the organization.
              </p>
            </div>
          </div>
        </div>
        
        {/* Orange Bottom Bar */}
       
      </div>
       <div className="bg-[#FF8D28] px-4 h-20 text-center text-white text-sm">
        </div>
    </footer>
  )
}

export default Footer