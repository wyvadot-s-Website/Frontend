import React from 'react'
import union from '../assets/Union.png'
import eng from '../assets/eng.png'
import cont from '../assets/contract.png'
import workr from '../assets/worker.png'
import tool from '../assets/tool.png'
import mech from '../assets/machine.png'
import comp from '../assets/comp.png'

const Services = () => {
  return (
    <div className=" p-10 bg-white ">
      
      
      <div 
        className=" 
          h-125 w-full                     
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
            Our Services
          </h1>
        </div>
      </div>
      
      <div className='flex w-full flex-col pt-20 justify-center items-center text-center'>
        <h1 className='text-5xl font-bold mb-2'>What we Build, We Build With Purpose</h1>
        <p className='text-xs'>Our multidisplinary team delivers engineering construction, and maintenance solutions with precison and purpose </p>
        <div className="grid grid-cols-3 w-full gap-15 mt-15 ">
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-2 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={cont} alt="contracts" className='w-30 h-30' />
            <p>Project Management & Resourcing</p>
        
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-2 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={eng} alt="engineer" className='w-30 h-30' />
            <p>Core Engineering & Construction</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-2 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={tool} alt="tools" className='w-30 h-30' />
            <p>Facilities Management & Maintenance</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-2 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={mech} alt="machine" className='w-30 h-30' />
            <p>Energy & Process Services 
</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-2 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={comp} alt="computer" className='w-30 h-30' />
            <p>Technology & E-Commerce</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-2 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={workr} alt="worker" className='w-30 h-30' />
            <p>General Contracts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
