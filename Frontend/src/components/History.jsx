import React from 'react'
import HistoryImg from "../../public/History.png";
import VisionImg from "../../public/Vision.png";
import MissionImg from "../../public/Mission.png";

function HistoryVisionMission({ historyText, visionText, missionText }) {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-32 lg:space-y-30">
        {/* HISTORY */}
        <Section
        subtitle="Our Company History"
          title="History"
          text={historyText}
          image={HistoryImg}
          imagePosition="right"
        />
        
        {/* VISION */}
        <Section
        subtitle="Our Company History"
          title="Our Vision"
          text={visionText}
          image={VisionImg}
          imagePosition="left"
        />
        
        {/* MISSION */}
        <Section
        subtitle="Our Company History"
          title="Our Mission"
          text={missionText}
          image={MissionImg}
          imagePosition="right"
        />
      </div>
    </div>
  );
}

function Section({subtitle, title, text, image, imagePosition }) {
  const isRight = imagePosition === "right";
  
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
      isRight ? "" : "lg:grid-flow-dense"
    }`}>
      {/* Text Content */}
      <div className={`${isRight ? "lg:order-1" : "lg:order-2"}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-1.5 bg-[#FF8D28] rounded-full" />
          <p className="text-gray-600 text-sm font-medium">
           {subtitle}
          </p>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-900">
          {title}
        </h2>
        
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {text}
        </p>
      </div>
      
      {/* Image with Tilted Layered Effect */}
      <div className={`relative ${isRight ? "lg:order-2" : "lg:order-1"}`}>
        <div className="relative w-full aspect-[4/3]">
          {/* Background tilted image (darker/shadow layer) */}
          <div className="absolute inset-0 transform rotate-3 translate-x-3 translate-y-3">
            <div className="w-full h-full rounded-2xl "></div>
          </div>
          
          {/* Middle tilted layer */}
          <div className="absolute inset-0 transform rotate-2 translate-x-2 translate-y-2">
            <div className="w-full h-full rounded-2xl"></div>
          </div>
          
          {/* Main image - slight tilt */}
          <div className="relative transform rotate-1">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryVisionMission;