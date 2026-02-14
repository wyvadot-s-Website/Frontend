import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CAT from "../../public/cat.png"
import GTB from "../../public/gtb.png"
import Arise from "../../public/Ariel.png"
import NNPC from "../../public/nnpc.png"
import Baldor from "../../public/baldor.png"
import ABB from "../../public/abb.png"
import Marquee from "react-fast-marquee";

function ContactForm() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  
  const faqs = [
  {
    question: "What is Wyvadot PR?",
    answer: "Wyvadot Projects & Resources Ltd is a fully Nigerian-owned company offering project management services, engineering, building/facility maintenance, consultancy and human resourcing for both technical and non-technical projects and operations."
  },
  {
    question: "Where is Wyvadot PR located and how can I contact them?",
    answer: "We operate country wide with stronger presence in Benin City, Port Harcourt, Warri, Asaba, Abuja and Lagos proudly serve clients within Nigeria and have competent stakeholders outside Nigeria in the US, UK, Canada. +234 810 273 0544 • wyvadotpr@gmail.com • projects@wyvadotpr.com"
  },
  {
    question: "What are your working hours?",
    answer: "Our working hours are Monday – Saturday: 8:00 AM – 6:00 PM, Sunday: Closed. However, our WhatsApp customer service is available 24/7, so you can always reach us anytime."
  },
  {
    question: "What types of services does Wyvadot PR offer?",
    answer: "We provide a complete range of solutions, including: Project management (planning, coordination & control), Engineering Management, Construction Management, Building and facilities Management & Maintenance, Consultancy and Human Resourcing, E-Commerce, New Technology Implementation (AI, Software as a Service, Upgrades, Retrofitting), Civil, Mechanical, electrical, instrumentation maintenance, Energy services (Oil & Gas), Smart home installations, cleaning, plumbing, painting, finishing & renovations, interior & exterior decoration."
  },
  {
    question: "Who are your typical clients?",
    answer: "Our Clients are people and Establishments who need experienced, dedicated and value oriented professionals."
  },
  {
    question: "What makes Wyvadot PR different?",
    answer: "We aim to ensure the highest standard of customer service and relationship, where we are committed to ensure achievement of mutual goals."
  },
  {
    question: "What is your commitment to quality?",
    answer: "We aim to: Deliver products & services that meet or exceed client expectations, Continuously improve our internal processes, Ensure compliance with industry standards while encouraging innovation."
  },
  {
    question: "How can I engage Wyvadot PR for a project?",
    answer: "You can book us directly online using the 'Book Us Now' button on our website. Simply fill out your project details, and our team will contact you to schedule a consultation and provide a tailored quote. Alternatively, you can purchase an already pre-packaged service from our e-commerce website. You can also contact us via our Instagram, Whatsapp, phone or email for personalized assistance."
  },
  {
    question: "Can Wyvadot PR handle all phases of a project?",
    answer: "Yes — we provide complete project management, covering concept, design, execution, and handover, so you don't have to coordinate multiple contractors."
  },
  {
    question: "Do you work only on residential projects, or commercial/industrial too?",
    answer: "We handle all sectors — residential, commercial, and industrial — including civil, mechanical, electrical, instrumentation & energy projects."
  },
  {
    question: "How can I request a quote or proposal?",
    answer: "Click the 'Book Us Now' button or email us at projects@wyvadotpr.com with your project details. We'll review your request and send a custom quote within 24–48 hours."
  },
  {
    question: "Do you have client testimonials?",
    answer: "Yes — our clients praise our project organization, attention to detail, and on-time delivery. You can read their feedback on our website."
  },
  {
    question: "Where do you operate?",
    answer: "We operate country wide with stronger presence in Benin City, Port Harcourt, Warri, Asaba, Abuja and Lagos proudly serve clients within Nigeria and have competent stakeholders outside Nigeria in the US, UK, Canada."
  }
];

  const clientLogos = [
    { name: "CAT", bg: "white", text: "black", logo: CAT },
    { name: "GTBank", bg: "#E94E1B", text: "white", logo: GTB},
    { name: "LAPDC", bg: "#0052A5", text: "white", logo: Arise },
    { name: "NNPC", bg: "white", logo: NNPC },
    { name: "NAFDAC", bg: "white", text: "black", logo: Baldor },
    { name: "ABB", bg: "white", text: "#E5222E", logo: ABB }
  ];

  return (
    <div className="bg-white">
      {/* Client Logos Section */}
      <div className="bg-[#FF8D28] py-15 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-white text-4xl font-semibold mb-6">Clients / Expertise / Partners</h3>
          
          <div className="relative">
            {/* Left gradient fade */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FF8D28] to-transparent z-10 pointer-events-none"></div>
            
            {/* Right gradient fade */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FF8D28] to-transparent z-10 pointer-events-none"></div>
            
            <Marquee 
              gradient={false} 
              speed={50}
              pauseOnHover={true}
              className="py-8"
            >
              {clientLogos.map((client, idx) => (
                <div key={idx} className="mx-8">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="w-40 h-auto object-contain"
                  />
                </div>
              ))}
            </Marquee>
          </div>             
        </div>
      </div>
    

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold text-center text-[#404040]">Got questions?</h2>
        <p className="text-center text-[#404040] text-3xl font-semibold mb-12">We've got you.</p>
        
        <div className="space-y-3 mb-12">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700 pr-4 font-semibold">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-[#FF8D28] rounded-2xl p-8 text-center flex flex-col items-center gap-2">
          <h3 className="text-white text-2xl font-bold mb-2">Still have a question?</h3>
          <p className="text-white text-md mb-6">
            Get in touch, and we'll be happy to help you.
          </p>
          <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors" onClick={() => navigate('/contact')}>
            Send a message
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;