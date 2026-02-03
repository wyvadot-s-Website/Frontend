import React from 'react'
import union from '../assets/Union.png'
import ServiceComponent from '../components/service'
import ContactForm from '../components/ContactForm'


const Services = () => {
  return (
    <div className=" py-10 bg-white  mx-auto">
      
      <div 
        className=" 
          max-w-5xl mx-auto                     
          rounded-4xl 
          relative 
          opacity-90 px-5 lg:px-0                     
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
            Our Services
          </h1>
        </div>
      </div>
      
      <ServiceComponent />
      <ContactForm />
    </div>
  )
}

export default Services
