import React from 'react'
import ContactForm from '../components/ContactForm'
import ProjectHistory from '../components/ProjectHistory'
import union from "../../public/Projects.png"
function Projects() {
  const projects = [
    {name: 'Construction of Modern 2 Storey Swiss Road', location: 'Abuja'},
    {name: 'Kado School Observatory Project', location: 'Kado'},
    {name: 'CAWWA Solar Panel Installation', location: 'Various'},
    {name: 'Pipeline Rehabilitation for Zuba Water Treatment', location: 'Zuba'}
  ]
  
  return (
    <div className='font-SF mt-10'>
      
            <div 
              className="  max-w-5xl mx-auto                     
                rounded-4xl 
                relative 
                opacity-90 mb-10  px-5 lg:px-0                    
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
                 Projects
                </h1>
              </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-2 bg-[#FF8D28] rounded-full" />
        <p className="text-gray-600 text-sm font-medium">
          This is our best work
        </p>
      </div>
      
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
        Projects
      </h2>
            </div>
           
      <ProjectHistory/>
      
      <ContactForm />
    </div>
  )
}

export default Projects