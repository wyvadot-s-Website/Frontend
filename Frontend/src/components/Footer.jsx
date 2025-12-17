// Footer Component
import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import logo from '../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png'

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12">
          {/* Contact Us Section */}
          <div className='col-span-2'>
            <h3 className="font-bold text-gray-900 mb-4 text-base">Contact Us</h3>
            <p className="text-gray-600 text-md leading-relaxed mb-6 font-semibold">Our promise as a company is to always ensure we proliferate quality craftsmanship, integrity, innovation, customer-centric approach, continuous improvement, sustainability, and a drive for excellence in all that we do.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Facebook className="w-5 h-5" />
                
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-900 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-800 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
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
