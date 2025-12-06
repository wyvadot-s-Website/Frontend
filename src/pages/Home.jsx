import React from 'react'
import ContactForm from '../components/ContactForm'

function Home() {
  return (
    <div>
      <div className="relative h-96 bg-cover bg-center" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200')"}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to WTVADOT</h1>
            <p className="text-xl mb-8">Your Trusted Construction Partner</p>
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600">
              Get Started
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What We Do</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive construction and engineering solutions for projects of all sizes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Construction', 'Engineering', 'Project Management'].map((service, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{service}</h3>
                <p className="text-gray-600 mb-4">Professional {service.toLowerCase()} services tailored to your needs.</p>
                <button className="text-orange-500 font-medium hover:text-orange-600">Learn More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ContactForm />
    </div>
  )
}


export default Home
