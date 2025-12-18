import React from 'react'
import ContactForm from '../components/ContactForm'
import ServiceComponent from '../components/service'
import ChooseImage from "../../public/Union.png"
import SecondHero from '../components/SecondHero'
import Shop from '../components/SHop'
import Hero from "../../public/Hero.png"
import { Button } from "../components/ui/button"


  const Choose =[
    {
      title: "We're Passionate",
      content: "We have a proven record of accomplishment and are a reputable company in Africa. We ensure that all projects are done with utmost professionalism using quality materials while offering clients the support and accessibility."
    },
    {
      title: "Honet and Dependable",
      content: "For us, honesty is the only policy and we strive to complete all projects with integrity, not just with our clients, but also our suppliers and contractors. With numerous successful projects under our belt, we are one of the most trusted construction companies in Nigeria"
    },
    {
      title: "We are always improving",
      content: "We commit ourselves to complete all projects within the timeline set with our clients. We use the best of technology and tools to ensure that all jobs are done quickly but also giving attention to details and ensuring everything is done correctly."
    }

  ]

  const stats = [
    {
      value: '60+',
      label: 'Years of Combined Expertise'
    },
    {
      value: '50+',
      label: 'Projects Delivered'
    },
    {
      value: '99%',
      label: 'Repeat Clients / Customer Retention'
    },
    {
      value: '95%',
      label: 'On-Time Delivery Rate'
    }
  ]

function Home() {
  return (
    <div className=' bg-white font-SF'>
       <div className="bg-white pt-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className='relative mb-10'>
          <p className='absolute text-sm pl-2 lg:text-[40px] font-semibold max-w-[60%]'>Reliable Project Delivery built on Excellence and Strong Customer Relationships</p>
          <img src={Hero} alt="" className='w-full'/>
          <p className='max-w-[20%] text-xs absolute -right-2 bottom-5 font-semibold text-sm'>Driving results through expert project management, engineering solutions, human resourcing, and maintenance</p>
         <div className='absolute bottom-10 left-10 flex gap-7'> <Button variant="outline" className={'flex w-35 h-13 rounded-4xl font-outfit bg-gradient-to-tr from-[#FF8D28] to-[#9E4A00] text-white text-lg'}>Shop with us</Button>
          <Button variant="outline" className={'flex w-35 h-13 rounded-4xl bg-[#FFDDBE] font-outfit text-lg'}>Book us now</Button></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-geist">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {/* Stat Value */}
              <div className="text-5xl font-bold text-gray-900 mb-3">
                {stat.value} 
              </div>
              
              {/* Stat Label */}
              <div className="text-gray-600 text-md font-medium leading-relaxed">
                {stat.label}
              </div>
              
              {/* Divider - Show on all except last item on desktop */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
      <SecondHero />
      <ServiceComponent />
      <div className='flex flex-col gap-3 max-w-6xl mx-auto mb-20'>
        <div className='flex justify-center lg:justify-start items-center gap-1 mb-2'>
        <div className='flex w-5 h-1.5 bg-black rounded-lg place-self-center'/>
        <p className=" flex  text-gray-600 text-md font-medium place-self-center ">Our Company History</p>
        </div>
        <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
        <div className='flex-wrap lg:flex-nowrap flex w-full justify-between '>
          {Choose.map((item, index) => (
            <div key={index} className="mb-8 bg-[#FAFAFA] rounded-lg p-3 max-w-[30%] border border-[#F1F5F966] flex flex-col gap-4">
              <p  className='text-2xl font-semibold' >{item.title}</p>
              <p className="text-gray-600 font-normal text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
        <img src={ChooseImage} alt="Construction worker with equipment" className="w-full h-full object-cover"/>
      </div>

      <Shop />
      <ContactForm />
    </div>
  )
}


export default Home
