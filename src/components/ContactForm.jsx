import { useState } from 'react';

function ContactForm() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    "What services does Wyvadot Projects & Resources Ltd offer?",
    "How do I book an oil rig or LNG Truck drivers? Are oil services available on demand?",
    "What are your working hours?",
    "What types of projects does Wyvadot PR offer?",
    "What is a Civil/Upe planner?",
    "What made Wyvadot PR different?",
    "Which is your commitment to quality?",
    "Can Wyvadot PR handle projects of any size or budget?",
    "Do you work long-on supported locations, or continental/Offshore as well?",
    "What is your return on volume or partnex?",
    "Do you have Client testimonials?",
    "Who to you cater to?"
  ];

  const clientLogos = [
    { name: "CAT", bg: "white", text: "black", bold: true },
    { name: "GTBank", bg: "#E94E1B", text: "white", logo: true },
    { name: "LAPDC", bg: "#0052A5", text: "white", logo: true },
    { name: "NNPC", bg: "white", hasImage: true },
    { name: "NAFDAC", bg: "white", text: "black", split: true },
    { name: "ABB", bg: "white", text: "#E5222E", bold: true }
  ];

  return (
    <div className="bg-white">
      {/* Client Logos Section */}
      <div className="bg-[#FF8D28] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-white text-4xl font-semibold mb-6">Clients / Expertise / Partners</h3>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {clientLogos.map((client, idx) => (
              <div 
                key={idx}
                className="h-20 px-8 flex items-center justify-center rounded"
                style={{ backgroundColor: client.bg }}
              >
                {client.name === "CAT" && (
                  <span className="text-3xl font-black" style={{ color: client.text }}>CAT</span>
                )}
                {client.name === "GTBank" && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded"></div>
                    <span className="text-xl font-bold text-white">GTBank</span>
                  </div>
                )}
                {client.name === "LAPDC" && (
                  <span className="text-2xl font-bold text-white">LAPDC</span>
                )}
                {client.name === "NNPC" && (
                  <span className="text-2xl font-bold text-green-600">NNPC</span>
                )}
                {client.name === "NAFDAC" && (
                  <div className="text-center">
                    <div className="text-xs font-bold text-black">NAFDAC</div>
                    <div className="text-xs font-bold text-black">RELIANCE</div>
                  </div>
                )}
                {client.name === "ABB" && (
                  <span className="text-3xl font-black" style={{ color: client.text }}>ABB</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold text-center text-[#404040]">Got questions?</h2>
        <p className="text-center text-[#404040] text-3xl font-semibold mb-12">We've got you.</p>
        
        <div className="space-y-3 mb-12">
          {faqs.map((question, idx) => (
            <div 
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700 pr-4 font-semibold">{question}</span>
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
                    Answer content would go here for: {question}
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
            Get in touch, and we’ll be happy to help you.
          </p>
          <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Send a message
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;