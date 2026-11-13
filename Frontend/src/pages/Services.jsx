import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import union from "../assets/Union.png";
import ServiceComponent from "../components/service";
import ContactForm from "../components/ContactForm";
import { Button } from "../components/ui/button";
import { fetchServicesContent } from "../services/servicesService";
import { DEFAULT_SERVICES } from "../utils/servicesContent";

const Services = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeHero, setActiveHero] = useState(0);
  const heroImages = content?.hero?.backgroundImages || [];

  useEffect(() => {
    fetchServicesContent()
      .then((data) => {
        setContent(data);
        setActiveHero(0);
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="mx-auto max-w-5xl animate-pulse rounded-4xl bg-gray-200 px-5 py-40 lg:px-0" />
      </div>
    );
  }

  const heroImage = heroImages[activeHero]?.url || heroImages[0]?.url || union;
  const services = content ? content.services || [] : DEFAULT_SERVICES;
  const cta = content?.cta || {};

  return (
    <div className="py-10 bg-white mx-auto">
      <div className="max-w-5xl mx-auto relative px-5 lg:px-0">
        <img src={heroImage} alt="Services" className="w-full h-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold z-10">
            {content?.hero?.title || "Our Services"}
          </h1>
          {content?.hero?.subtitle && (
            <p className="mt-4 max-w-2xl text-white/90 text-base md:text-lg">{content.hero.subtitle}</p>
          )}
        </div>
      </div>

      <ServiceComponent services={services} intro={content?.intro} />

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl bg-[#FF8D28] px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">{cta.heading || "Ready to start your project?"}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">{cta.description || "Tell us about your needs and our team will help you find the right solution."}</p>
          <Button
            onClick={() => navigate(cta.buttonLink || "/contact")}
            className="mt-6 rounded-lg bg-white px-8 py-3 font-semibold text-orange-500 hover:bg-gray-100"
          >
            {cta.buttonText || "Contact Us"}
          </Button>
        </div>
      </section>

      <ContactForm />
    </div>
  );
};

export default Services;
