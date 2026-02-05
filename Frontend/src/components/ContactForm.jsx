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
      question: "What services does Wyvadot Projects & Resources Ltd offer?",
      answer: "We provide a complete range of consulting services in Oil and Gas, Maritime, Engineering, and Construction projects. We also recruit and deploy highly skilled workforce for Manpower outsourcing requirements in specific projects undertaken by companies. Our staff is composed of a team of well-rounded individuals who possess industry experience in Oil and Gas, Maritime, General and Civil Engineering."
    },
    {
      question: "How do I book an oil rig or LNG Truck drivers? Are oil services available on demand?",
      answer: "You can reach out via our 'Contact Us' section. Either send us an email or give us a call and we will have you onboard ASAP."
    },
    {
      question: "What are your working hours?",
      answer: "Weekdays: 8am-5pm / Weekends: 9am-5pm"
    },
    {
      question: "What types of projects does Wyvadot PR offer?",
      answer: "We provide a complete range of activities including: Recruitment outsourcing, manpower supply, contract labor recruitment, Oil and Gas Manpower Supply, Procurement Management, Exploration & Maintenance, Civil Works / Marine Works & Maintenance, Engineering / Contracting Works, Fabrications and Installations (i.e. Software as a Service, Logistics, EPS-piping, HSE, etc.)"
    },
    {
      question: "What is a Civil/Upe planner?",
      answer: "Comprehensive project planning services and asset improvement delivered."
    },
    {
      question: "What made Wyvadot PR different?",
      answer: "We aim to contain the highest standards of Ethics and Quality in all our activities ensuring reliability, and consistency of quality of our delivered services."
    },
    {
      question: "Which is your commitment to quality?",
      answer: "Quality is our standard."
    },
    {
      question: "Can Wyvadot PR handle projects of any size or budget?",
      answer: "Yes! We pride ourselves in delivering the vision in an efficient client application with cutting edge delivery and quality that is second to none!"
    },
    {
      question: "Do you work long-on supported locations, or continental/Offshore as well?",
      answer: "We are specialists in both onshore (mainland) and offshore (marine, offshore oil and gas drilling platforms, FPSO's, or other vessels or installations operating in marine waters as well as onsite drilling). We are experts in pipeline gas, oil, water, and sewers; road construction, water supply, drainage and land development works."
    },
    {
      question: "What is your return on volume or partnex?",
      answer: "We work with our clients across an agreed-upon commercial framework where timely and key deliveries do not feed based on profit loss from investments made."
    },
    {
      question: "Do you have Client testimonials?",
      answer: "Yes - Our clients play a pivotal role with continuous emphasis on equity, trust, and a promise we continuously uphold in bridging the gap for our diverse clientele base."
    },
    {
      question: "Who to you cater to?",
      answer: "We are not a crowd per se and although we flourish in the shipping, Oil and Gas and Engineering world, we have maintained relationships as well as we have nurtured and have competent partnerships across Nigeria (e.g. Port Harcourt, Lagos, Delta, etc.)"
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