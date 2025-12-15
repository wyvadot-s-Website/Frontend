import React, { useState } from 'react'
import { Home, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import union from "../../public/Contact.png"

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className=" mx-auto max-w-6xl rounded-4xl relative 
                        opacity-90 
                       pt-10               
                      "
                    >
                      {/* Background Image Container */}
                      <img 
                        src={union}    /* 💡 IMPORTANT: Replace with your actual image path */
                        alt="Construction site" 
                        className="
                          w-full h-full 
                        "
                      />
              
              
                      {/* Centered Text */}
                      <div 
                        className="
                          absolute inset-0 
                          flex items-center justify-center
                        "
                      >
                        <h1 
                          className="
                            text-white 
                            text-4xl md:text-5xl font-bold 
                            z-10
                          "
                        >
                          Contact Us
                        </h1>
                      </div>
                </div>

        {/* Contact Section */}
        <div className="flex flex-col md:flex-row gap-8 pt-20">
          {/* Left Panel - Contact Information */}
          <div className="bg-[#FF8D28] text-white rounded-lg p-8 md:w-2/5">
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4">
                <Home className="w-5 h-5 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Wyvaedot PR Ltd</p>
                  <p className="text-sm">Benin City, Port-Harcourt</p>
                  <p className="text-sm">Lagos, Abuja, Delta</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <p>+234-810-273-0544</p>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <p>wyvaedotpr@gmail.com</p>
              </div>

              {/* Hours */}
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <div>
                  <p>Mon - Sat</p>
                  <p className="text-sm">8:00AM-6:00PM</p>
                  <p className="text-sm">Saturday - Sunday CLOSED</p>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-8">
              <Facebook className="w-6 h-6 cursor-pointer hover:opacity-80" />
              <Instagram className="w-6 h-6 cursor-pointer hover:opacity-80" />
            </div>
          </div>

          {/* Right Panel - Contact Form */}
          <div className="md:w-3/5 py-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your name */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Your email */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Subject (optional)
                </label>
                <textarea
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#FF8D28] hover:bg-orange-600 text-white font-semibold px-15 py-3 rounded-full transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact