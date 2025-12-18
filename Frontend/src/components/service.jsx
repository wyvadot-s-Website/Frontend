import React, { useState } from 'react'
import eng from '../assets/eng.png'
import cont from '../assets/contract.png'
import workr from '../assets/worker.png'
import tool from '../assets/tool.png'
import mech from '../assets/machine.png'
import comp from '../assets/comp.png'
import ConsultationModal from './ConsultationModal'


function ServiceComponent() {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState('')
  const services = [
    {
      name: 'Project Management & Resourcing',
      icon: eng
    },
    {
      name: 'Core Engineering & Construction',
      icon: cont
    },
    {
      name: 'Facilities Management & Maintenance',
      icon: workr
    },
    {
      name: 'Energy & Process Services',
      icon: tool
    },
    {
      name: 'Technology & E-commerce',
      icon: mech
    },
    {
      name: 'General Contracts',
      icon: comp
    }
  ]

  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName)
    setModalOpen(true)
  }
    return (
         <div className="min-h-screen mt-15 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">What we Build, We Build With Purpose</h1>
          <p className="text-gray-600">
            Our multidisciplinary team delivers engineering construction, and maintenance solutions with precision and purpose
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => handleServiceClick(service.name)}
              className="bg-gray-200 hover:bg-gray-300 transition-colors h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-lg p-6"
            >
              <img className="text-6xl w-20 mb-2" src={service.icon} alt={service.name}/>
              <p className="text-lg font-medium max-w-[70%]">{service.name}</p>
            </button>
          ))}
        </div>
      </div>

      <ConsultationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={selectedService}
      />
    </div>
    )
}

export default ServiceComponent