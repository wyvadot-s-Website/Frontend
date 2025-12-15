import React from 'react'
import PI1 from "../../public/ProjectImg1.png"
import PI2 from "../../public/ProjectImg2.jpg"
import PI3 from "../../public/ProjectImg3.jpg"
import PI4 from "../../public/ProjectImg4.jpg"

function ProjectHistory() {
  const projects = [
    {
      id: 1,
      title: "Construction of Nursery & Primary School Block",
      description: "We conduct hall and whole office surveys alongside to build the your new endeavor",
      image:PI1,
      imagePosition: "left"
    },
    {
      id: 2,
      title: "Public School Classrooms renovation Works",
      description: "We provide the surveys and updates your packages on each on your land rebuild",
      image: PI2,
      imagePosition: "right"
    },
    {
      id: 3,
      title: "3 KVA Solar Inverter Installation with smart Switchover System",
      description: "We deliver the commercial best real package info part has for a prompt withdrawal",
      image: PI3,
      imagePosition: "left"
    },
    {
      id: 4,
      title: "Roofing Remediation for Commercial Bank",
      description: "We provide lifts ways and types hike process up to lift to a modern hub detail",
      image: PI4,
      imagePosition: "right"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
         <div className='flex justify-center lg:justify-start items-center gap-1 mb-2'>
              <div className='flex w-5 h-1.5 bg-orange-500 rounded-lg place-self-center'/>
              <p className=" flex  text-gray-600 text-md font-medium place-self-center ">This is our best work</p>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Projects</h2>

        {/* Projects Grid */}
        <div className="space-y-16 mt-12">
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                project.imagePosition === "right" ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectHistory