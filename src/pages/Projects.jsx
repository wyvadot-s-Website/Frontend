import React from 'react'
import ContactForm from '../components/ContactForm'

function Projects() {
  const projects = [
    {name: 'Construction of Modern 2 Storey Swiss Road', location: 'Abuja'},
    {name: 'Kado School Observatory Project', location: 'Kado'},
    {name: 'CAWWA Solar Panel Installation', location: 'Various'},
    {name: 'Pipeline Rehabilitation for Zuba Water Treatment', location: 'Zuba'}
  ]
  
  return (
    <div>
      <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200')"}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">OUR PROJECTS</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of successfully completed projects across various sectors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-64 bg-gray-300 bg-cover bg-center" style={{backgroundImage: `url(https://images.unsplash.com/photo-${['1504307651254-35680f356dfd','1541888946425-d81bb19240f5','1497366811353-6870744d04b2','1581094794329-c8112a89af12'][idx]}?w=600)`}}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">📍 {project.location}</p>
                <button className="text-orange-500 font-medium hover:text-orange-600">View Details →</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600">
            Load More Projects
          </button>
        </div>
      </div>
      
      <ContactForm />
    </div>
  )
}

export default Projects