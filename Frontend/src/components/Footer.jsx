// Footer Component
import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import logo from '../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png'
import fb from "../assets/icons/facebook.png"
import x from "../assets/icons/twitter.png"
import Ig from "../assets/icons/instagram.png"
import lkdn from "../assets/icons/LinkedIn.png"
import whts from "../assets/icons/whatsapp.png"

function Footer() {
  return (
    <footer className="bg-gray-50 pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className='w-50'/>
          </div>
        </div>
        
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 ">
          {/* Contact Us Section */}
          <div className='col-span-2 flex justify-between flex-col'>
           <div>
             <h3 className="font-bold text-gray-900 mb-4 text-base">Contact Us</h3>
            <p className="text-gray-600 text-md leading-relaxed mb-6 font-semibold">Our promise as a company is to always ensure we proliferate quality craftsmanship, integrity, innovation, customer-centric approach, continuous improvement, sustainability, and a drive for excellence in all that we do.
            </p>
           </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-7">
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <img src={fb} alt="" className='w-9' />
                
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors">
                <img src={x} alt="" className='w-9' />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
                <img src={Ig} alt="" className='w-9' />
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-800 transition-colors">
                <img src={lkdn} alt="" className='w-9' />
              </a>
              <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                <img src={whts} alt="" className='w-9' />
              </a>
            </div>
          </div>
          
          {/* Legal Section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-base">Legal</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <a href="/privacy-policy" className="hover:text-orange-500 transition-colors text-md font-semibold">Privacy Policies</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-orange-500 transition-colors text-md font-semibold">Terms and Conditions</a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-base">Quick Links</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="/" className="hover:text-orange-500 transition-colors text-md font-semibold">Home</a></li>
              <li><a href="/about" className="hover:text-orange-500 transition-colors text-md font-semibold">About Us</a></li>
              <li><a href="/services" className="hover:text-orange-500 transition-colors text-md font-semibold">Our Services</a></li>
              <li><a href="/projects" className="hover:text-orange-500 transition-colors text-md font-semibold">Projects</a></li>
            </ul>
          </div>
          
          {/* Quality Commitment Section */}
          <div className='col-span-2'>
            <h3 className="font-bold text-gray-900 mb-4 text-base ">Quality Commitment</h3>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p className='text-md font-semibold'>
                <span className="font-semibold">Objective 1:</span> We achieve customer satisfaction by delivering products and service that meet or exceed their requirements
              </p>
              <p className='text-md font-semibold'>
                <span className="font-semibold">Objective 2:</span> To Continuously improve internal processes to enhance efficiency, productivity, and quality.
              </p>
              <p className='text-md font-semibold'>
                <span className="font-semibold">Objective 3:</span> To Ensure compliance with relevant industry standards, regulations, and best practices, while retaining Spirit of Innovation.
              </p>
              <p className='text-md font-semibold'>
                <span className="font-semibold">Objective 4:</span> To Foster a culture of quality and continuous improvement throughout the organization.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orange Bottom Bar */}
      <div className="bg-[#FF8D28] h-20 flex items-center justify-center">
        {/* <p className="text-white text-sm">
          © {new Date().getFullYear()} Wyvadot Projects & Resources Ltd. All rights reserved.
        </p> */}
      </div>
    </footer>
  )
}

export default Footer
