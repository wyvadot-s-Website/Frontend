import ContactForm from '../components/ContactForm'


function Services() {
  const services = [
    {name: 'Welding', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400'},
    {name: 'Plumbing', img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400'},
    {name: 'Generator Repair', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400'},
    {name: 'Electrical', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'},
    {name: 'Iron Bending', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400'},
    {name: 'Fabrication', img: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400'}
  ]
  
  return (
    <div>
      <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200')"}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">OUR SERVICES</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of construction and technical services to meet all your project needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${service.img})`}}></div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">Professional {service.name.toLowerCase()} services with experienced technicians.</p>
                <button className="text-orange-500 font-medium hover:text-orange-600">Learn More →</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600">
            View All Services
          </button>
        </div>
      </div>
      
      <div className="bg-orange-500 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-white text-center font-bold">Trusted / Supported / Partners</h3>
        </div>
      </div>
      
      <ContactForm />
    </div>
  )
}

export default Services