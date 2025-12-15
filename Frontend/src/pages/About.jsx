import React from 'react'
import ContactForm from '../components/ContactForm'
import sideImage from "../../public/348bd38987e246fe6f4e282afdac16933b48efd7.jpg"
import Aboutimg from "../../public/About Us.png"
import SecondHero from '../components/SecondHero'
import History from '../components/History'
function About() {
  return (
    <div className='bg-white'>
       <div 
              className=" 
                 mx-auto max-w-6xl                     
                rounded-4xl 
                relative 
                opacity-90 
               pt-10               
              "
            >
              {/* Background Image Container */}
              <img 
                src={Aboutimg}    /* 💡 IMPORTANT: Replace with your actual image path */
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
                  About Us
                </h1>
              </div>
        </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
  {/* About Us Section */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
    <div className="w-full col-span-1">
      <div className='flex justify-center lg:justify-start items-center gap-1 mb-2'>
        <div className='flex w-5 h-1.5 bg-orange-500 rounded-lg place-self-center'/>
        <p className=" flex  text-gray-600 text-md font-medium place-self-center ">Our Company History</p>
      </div>
      <h2 className="text-5xl font-bold text-gray-900 mb-6">About Us</h2>
      
      <div className="space-y-1 text-gray-600 font-medium text-md leading-relaxed">
        <p>
          Wyvadot Products & Resources Ltd is a fully fledge central Nigeria's Construction company and associated Resources. Founded in 2021 and is capable of Delivering a mile a wide range of Projects. We offer; Engineering, Constructions, Maintenance and Project management.
        </p>
        
        <p>
          The Company's construction services include Design and Build; and a 500,000 vehicle result driven professionalism model, we exist in Engineering, Construction, operations as a Mechanical, productify, for the projects they enroll. Our Management system is based on the Improved standard of Combined Services to an arm's manger ex.
        </p>
        
        <p>
          Wyvadot PR, and is consistent lasting satisfaction with value and integrity which established a reputation of delivering Innovative Construction Projects with a focus on safety, efficiency, and Environmental responsibility.
        </p>
        
        <p>
          Wyvadot PR has developed a unique as achieve a highly significant level of expertise, and professional growth in combined sequences which gives us the most strategic edge for innovation and efficiency while working on the certification of the clearest and proven world class standard and competitive best practices in all it assignment.
        </p>
        
        <p>
          The Company is committed to providing exceptional service and quality Wyvadot PR has now a minimum Health & safety Environmental Management system with a commitment to delivering the highest quality job.
        </p>
      </div>
    </div>
    <div className="flex justify-center lg:justify-end col-span-1 w-full">
      <img 
        src={sideImage} 
        alt="Construction site" 
        className="rounded-lg shadow-lg w-full max-w-md h-160 object-cover col-span-1"
      />
    </div>
  </div>
  <SecondHero />
  <History />
  {/* Team Section */}
  <div className="py-16 px-6 max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-10" style={{ lineHeight: '1.2' }}>
      Our Team
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
  {[
    {
      name: "Engr Fridelia C",
      title: "Project Manager",
      desc: "The Project Planning, Monitoring...",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
      name: "Engr Daniel E",
      title: "Building Maintenance Project Coordinator",
      desc: "Working at Wyvadot PR has enabled me...",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    },
    {
      name: "Engr Louis L.",
      title: "Technical Director",
      desc: "The quality of service is directly proportional...",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    {
      name: "Engr Henriette",
      title: "Project Coordinator",
      desc: "We are here with a clear aim...",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    }
  ].map((member, idx) => (
    <div
      key={idx}
      className={`bg-[#FAFAFA] rounded-2xl overflow-hidden px-6 pt-6 ${
        idx === 3 ? "lg:col-start-2" : ""
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-full h-full object-cover object-center rounded-xl"
        />
      </div>
      <div className="py-6">
        <h3 className="text-base font-semibold text-gray-900 mb-0.5">{member.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{member.title}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{member.desc}</p>
      </div>
    </div>
  ))}
</div>

  </div>
</div>
      
      <ContactForm />
    </div>
  )
}

export default About
