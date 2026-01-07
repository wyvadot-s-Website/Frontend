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
      <div className="mx-auto max-w-6xl relative pt-10">
        <img src={about.heroImage?.url} alt="About Hero" />

        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            About Us
          </h1>
        </div>
      </div>

      {/* ABOUT TEXT */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-5xl font-bold mb-6">About Us</h2>

            <div className="space-y-4 text-black">
              {about.aboutText?.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <img src={sideImage} alt="Company" className="rounded-lg shadow-lg" />
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
