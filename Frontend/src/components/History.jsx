import React from 'react'
import History from "../../public/History.png"
import Vision from "../../public/Vision.png"
import Mission from "../../public/Mission.png"
function HistoryVisionMission() {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className='flex justify-center lg:justify-start items-center gap-1 mb-2'>
              <div className='flex w-5 h-1.5 bg-orange-500 rounded-lg place-self-center'/>
              <p className=" flex  text-gray-600 text-md font-medium place-self-center ">Our Company History</p>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">History</h2>
            <p className="text-gray-600 leading-relaxed">
              Wyvadot PR was founded as a result of the burning desire to create a medium where result-driven professionals could add value to Engineering, Construction and Maintenance projects, by delivering services of long-lasting quality, packaged, and exhibiting the highest standard of Customer Service to all who engage us.
            </p>
          </div>
          <div className="relative">
            <div className="relative transform rotate-2">
              <img 
                src={History} 
                alt="Construction workers on site"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Our Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative transform -rotate-2">
              <img 
                src={Vision} 
                alt="Industrial offshore platform"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent rounded-lg"></div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className='flex justify-center lg:justify-start items-center gap-1 mb-2'>
              <div className='flex w-5 h-1.5 bg-orange-500 rounded-lg place-self-center'/>
              <p className=" flex  text-gray-600 text-md font-medium place-self-center ">Our Company History</p>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To be the best Project Delivery Company with the highest standard of Customer Service and rapid project execution in Africa.
            </p>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className='flex justify-center lg:justify-start items-center gap-1 mb-2'>
              <div className='flex w-5 h-1.5 bg-orange-500 rounded-lg place-self-center'/>
              <p className=" flex  text-gray-600 text-md font-medium place-self-center ">Our Company History</p>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To deliver complete solutions to problems, by utilizing the best people and optimising resources, with sustainability in mind, in the management and execution of Projects.
            </p>
          </div>
          <div className="relative">
            <div className="relative transform rotate-2">
              <img 
                src={Mission}
                alt="Engineers discussing project"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HistoryVisionMission