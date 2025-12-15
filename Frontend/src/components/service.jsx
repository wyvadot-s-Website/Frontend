import eng from '../assets/eng.png'
import cont from '../assets/contract.png'
import workr from '../assets/worker.png'
import tool from '../assets/tool.png'
import mech from '../assets/machine.png'
import comp from '../assets/comp.png'
function ServiceComponent() {
    return (
        <div className='flex max-w-6xl mx-auto flex-col pt-20 justify-center items-center text-center mb-10'>
        <h1 className='text-5xl font-bold mb-2'>What we Build, We Build With Purpose</h1>
        <p className='text-xs'>Our multidisplinary team delivers engineering construction, and maintenance solutions with precison and purpose </p>
        <div className="grid grid-cols-3 w-full gap-15 mt-15 ">
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={cont} alt="contracts" className='w-30 h-30' />
            <p className='text-lg font-medium max-w-[70%]'>Project Management & Resourcing</p>
        
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={eng} alt="engineer" className='w-30 h-30' />
            <p className='text-lg font-medium max-w-[70%]'>Core Engineering & Construction</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={tool} alt="tools" className='w-30 h-30' />
            <p className='text-lg font-medium max-w-[70%]'>Facilities Management & Maintenance</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={mech} alt="machine" className='w-30 h-30' />
            <p className='text-lg font-medium max-w-[70%]'>Energy & Process Services 
</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={comp} alt="computer" className='w-30 h-30' />
            <p className='text-lg font-medium max-w-[70%]'>Technology & E-Commerce</p>
          </div>
          <div className='bg-[#e5e3e3] h-60 flex flex-col gap-3 justify-center items-center text-center shadow-sm rounded-md'>
            <img src={workr} alt="worker" className='w-30 h-30' />
            <p className='text-lg font-medium max-w-[70%]'>General Contracts</p>
          </div>
        </div>
      </div>
    )
}

export default ServiceComponent