import React, { useEffect, useState } from 'react'
import { Home, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import union from "../../public/Contact.png"
import { fetchFooter } from '@/services/footerService.js';
import { toast, Toaster } from 'sonner'

function Contact() {
  const [footer, setFooter] = useState(null);

  const [formData, setFormData] = useState({
  name: '',
  email: '',
  subject: '',
  message: ''
})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  
  const formDataToSend = new FormData(e.target);
  formDataToSend.append("access_key", "2b13a7cb-5d36-436c-b73c-915bd7b8aa38");

  // Show loading toast
  const loadingToast = toast.loading('Sending your message...');

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formDataToSend
    });

    const data = await response.json();

    // Dismiss loading toast
    toast.dismiss(loadingToast);

    if (data.success) {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      toast.error('Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    toast.dismiss(loadingToast);
    toast.error('An error occurred. Please try again later.');
  }
}

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    const data = await fetchFooter();
    setFooter(data);
  };
  
  if (!footer) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-SF">
      <Toaster position="top-right" richColors />
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
            
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-1" width="200" height="200" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z"/>
               </svg>
                <div>
                  <p className="font-semibold">Wyvadot PR Ltd</p>
                  <p className="text-sm">{footer.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0"  width="200" height="200" viewBox="0 0 24 24" fill="#ffffff"><g fill="#ffffff"><path d="M22 12A10.002 10.002 0 0 0 12 2v2a8.003 8.003 0 0 1 7.391 4.938A8 8 0 0 1 20 12h2ZM2 10V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a8 8 0 0 0 8 8v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5C7.373 22 2 16.627 2 10Z"/><path d="M17.543 9.704A5.99 5.99 0 0 1 18 12h-1.8A4.199 4.199 0 0 0 12 7.8V6a6 6 0 0 1 5.543 3.704Z"/></g></svg>
                <p>{footer.phone}</p>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" width="200" height="200" viewBox="0 0 432 384"><path fill="#ffffff" d="M384 21q18 0 30.5 12.5T427 64v256q0 18-12.5 30.5T384 363H43q-18 0-30.5-12.5T0 320V64q0-18 12.5-30.5T43 21h341zm0 86V64L213 171L43 64v43l170 106z"/></svg>
                <p>{footer.email}</p>
              </div>

              {/* Hours */}
              <div className="flex gap-4 items-start">
                <svg xmlns="http://www.w3.org/2000/svg"className="w-5 h-5 flex-shrink-0 mt-1" width="200" height="200" viewBox="0 0 24 24"><path fill="#ffffff" d="M19 9A7 7 0 1 0 5 9c0 1.387.409 2.677 1.105 3.765h-.008L12 22l5.903-9.235h-.007A6.971 6.971 0 0 0 19 9zm-7 3a3 3 0 1 1 0-6a3 3 0 0 1 0 6z"/></svg>
                <div>
                  <p>Mon - Sat</p>
                  <p className="text-sm">8:00AM-6:00PM</p>
                  <p className="text-sm">Saturday - Sunday CLOSED</p>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 cursor-pointer hover:opacity-80" width="200" height="200" viewBox="0 0 24 24"><path fill="#ffffff" d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 cursor-pointer hover:opacity-80" width="200" height="200" viewBox="0 0 24 24"><path fill="#ffffff" d="M17.34 5.46a1.2 1.2 0 1 0 1.2 1.2a1.2 1.2 0 0 0-1.2-1.2Zm4.6 2.42a7.59 7.59 0 0 0-.46-2.43a4.94 4.94 0 0 0-1.16-1.77a4.7 4.7 0 0 0-1.77-1.15a7.3 7.3 0 0 0-2.43-.47C15.06 2 14.72 2 12 2s-3.06 0-4.12.06a7.3 7.3 0 0 0-2.43.47a4.78 4.78 0 0 0-1.77 1.15a4.7 4.7 0 0 0-1.15 1.77a7.3 7.3 0 0 0-.47 2.43C2 8.94 2 9.28 2 12s0 3.06.06 4.12a7.3 7.3 0 0 0 .47 2.43a4.7 4.7 0 0 0 1.15 1.77a4.78 4.78 0 0 0 1.77 1.15a7.3 7.3 0 0 0 2.43.47C8.94 22 9.28 22 12 22s3.06 0 4.12-.06a7.3 7.3 0 0 0 2.43-.47a4.7 4.7 0 0 0 1.77-1.15a4.85 4.85 0 0 0 1.16-1.77a7.59 7.59 0 0 0 .46-2.43c0-1.06.06-1.4.06-4.12s0-3.06-.06-4.12ZM20.14 16a5.61 5.61 0 0 1-.34 1.86a3.06 3.06 0 0 1-.75 1.15a3.19 3.19 0 0 1-1.15.75a5.61 5.61 0 0 1-1.86.34c-1 .05-1.37.06-4 .06s-3 0-4-.06a5.73 5.73 0 0 1-1.94-.3a3.27 3.27 0 0 1-1.1-.75a3 3 0 0 1-.74-1.15a5.54 5.54 0 0 1-.4-1.9c0-1-.06-1.37-.06-4s0-3 .06-4a5.54 5.54 0 0 1 .35-1.9A3 3 0 0 1 5 5a3.14 3.14 0 0 1 1.1-.8A5.73 5.73 0 0 1 8 3.86c1 0 1.37-.06 4-.06s3 0 4 .06a5.61 5.61 0 0 1 1.86.34a3.06 3.06 0 0 1 1.19.8a3.06 3.06 0 0 1 .75 1.1a5.61 5.61 0 0 1 .34 1.9c.05 1 .06 1.37.06 4s-.01 3-.06 4ZM12 6.87A5.13 5.13 0 1 0 17.14 12A5.12 5.12 0 0 0 12 6.87Zm0 8.46A3.33 3.33 0 1 1 15.33 12A3.33 3.33 0 0 1 12 15.33Z"/></svg>
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
                  required
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
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Subject */}
<div>
  <label className="block text-sm text-gray-600 mb-2">
    Subject
  </label>
  <input
    type="text"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
  />
</div>

{/* Message */}
<div>
  <label className="block text-sm text-gray-600 mb-2">
    Message
  </label>
  <textarea
    name="message"
    value={formData.message}
    onChange={handleChange}
    required
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