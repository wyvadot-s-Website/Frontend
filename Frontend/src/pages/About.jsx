import React, { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";
import SecondHero from "../components/SecondHero";
import History from "../components/History";
import Team from "../components/Team.jsx";
import { fetchAboutContent } from "../services/aboutService.js";

import sideImage from "../../public/348bd38987e246fe6f4e282afdac16933b48efd7.jpg";

function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const loadAbout = async () => {
      const data = await fetchAboutContent();
      setAbout(data.data);
    };
    loadAbout();
  }, []);

  if (!about) return null;

  return (
    <div className="bg-white font-SF">
      {/* HERO */}
      <div className="mx-auto max-w-5xl relative pt-10">
        <img src={about.heroImage?.url} alt="About Hero" />

        <div className="absolute inset-0 flex items-center justify-center">
          
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            About Us
          </h1>
        </div>
      </div>

      {/* ABOUT TEXT */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
    {/* Left Content */}
    <div className="order-2 lg:order-1">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-1.5 bg-[#FF8D28] rounded-full" />
        <p className="text-gray-600 text-sm font-medium">
          Our Company History
        </p>
      </div>
      
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
        About Us
      </h2>
      
      <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
        {about.aboutText?.split("\n").map((p, i) => (
          <p key={i} className="text-justify">{p}</p>
        ))}
      </div>
    </div>
    
    {/* Right Image */}
    <div className="order-1 lg:order-2">
      <img 
        src={sideImage} 
        alt="Company worker in safety gear" 
        className="w-full h-auto rounded-2xl shadow-lg object-cover"
      />
    </div>
  </div>
</div>

        {/* PROMISE SECTION */}
        <SecondHero
          promiseText={about.promiseText}
          promiseImages={about.promiseImages}
        />

        {/* HISTORY / VISION / MISSION (TEXT ONLY) */}
        <History
          historyText={about?.history}
          visionText={about?.vision}
          missionText={about?.mission}
        />
      </div>

      <div className="py-16 px-6 max-w-7xl mx-auto">
        <Team />
        
      </div>

      <ContactForm />
    </div>
  );
}

export default About;
