import React, { useState } from 'react'
import ContactForm from '../components/ContactForm'
function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const products = Array.from({length: 12}, (_, i) => ({
    id: i + 1,
    name: `Hammer ${i + 1}`,
    price: (15 + i * 5).toFixed(2),
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300'
  }))
  
  return (
    <div>
      <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200')"}}>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">PRODUCTS</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{product.name}</h3>
                <p className="text-orange-500 font-bold text-xl">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600">
            Load More Products
          </button>
        </div>
      </div>
      
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              
              <div>
                <p className="text-orange-500 font-bold text-3xl mb-6">${selectedProduct.price}</p>
                <p className="text-gray-600 mb-6">
                  High-quality professional hammer designed for construction and industrial use. Durable construction with ergonomic grip for extended use.
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <input type="number" defaultValue="1" min="1" className="w-24 px-3 py-2 border rounded" />
                </div>
                
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ContactForm />
    </div>
  )
}
export default Products