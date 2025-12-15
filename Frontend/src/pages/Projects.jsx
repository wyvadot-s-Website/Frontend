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
    <div>
      <div 
              className=" 
                h-125 max-w-6xl mx-auto                     
                rounded-4xl 
                relative 
                opacity-90                     
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
      <ProjectHistory/>
      
      <ContactForm />
    </div>
  )
}

export default Projects