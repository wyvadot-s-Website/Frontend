import React from 'react'
import History from "../../public/History.png"
import Vision from "../../public/Vision.png"
import Mission from "../../public/Mission.png"
import HistoryImg from "../../public/History.png";
import VisionImg from "../../public/Vision.png";
import MissionImg from "../../public/Mission.png";

function HistoryVisionMission({ historyText, visionText, missionText }) {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* HISTORY */}
        <Section
          title="History"
          text={historyText}
          image={HistoryImg}
        />

        {/* VISION */}
        <Section
          title="Our Vision"
          text={visionText}
          image={VisionImg}
          reverse
        />

        {/* MISSION */}
        <Section
          title="Our Mission"
          text={missionText}
          image={MissionImg}
        />
      </div>
    </div>
  );
}

function Section({ title, text, image, reverse }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>
      <div>
        <h2 className="text-5xl font-bold mb-6">{title}</h2>
        <p className="text-gray-600 leading-relaxed">{text}</p>
      </div>

      <img src={image} alt={title} className="rounded-lg shadow-xl" />
    </div>
  );
}

export default HistoryVisionMission