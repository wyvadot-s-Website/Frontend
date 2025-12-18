
import React from 'react'
import { Heart } from 'lucide-react'
import Image from "../../public/Hammer.png"
import {useNavigate} from  "react-router-dom"

function Shop( { onProductClick }) {

  const navigate = useNavigate()
  const products = [
    {
      id: 1,
      name: 'Hammer',
      price: '₦10,000.00',
      originalPrice: '₦20,000.00',
      rating: 5,
      image: Image
    },
    {
      id: 2,
      name: 'Hammer',
      price: '₦10,000.00',
      originalPrice: '₦20,000.00',
      rating: 5,
      image: Image
    },
    {
      id: 3,
      name: 'Hammer',
      price: '₦10,000.00',
      originalPrice: '₦20,000.00',
      rating: 5,
      image: Image
    },
    {
      id: 4,
      name: 'Hammer',
      price: '₦10,000.00',
      originalPrice: '₦20,000.00',
      rating: 5,
      image: Image
    }
  ]



  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Shop with us
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div key={product.id} onClick={() => onProductClick(product)} className=" rounded-lg overflow-hidden">
              {/* Product Details */}
              <div className="p-4">
                {/* Product Image Container */}
                <div className='bg-gray-50 border border-[#F1F5F966] rounded-lg mb-4 pb-2'>
                    <div className="relative p-0 flex items-center justify-center h-64">
                <button className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-40 h-40 object-contain"
                />
              </div>
                {/* Star Rating */}
                <div className="flex gap-1 px-5">
                  {[...Array(product.rating)].map((_, i) => (
                    <span key={i} className="text-black text-sm">★</span>
                  ))}
                </div>

                {/* Product Name */}
                <h3 className="text-gray-900 font-medium mb-2 px-5">
                  {product.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-4 px-5">
                  <span className="text-gray-900 font-semibold">
                    {product.price}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    {product.originalPrice}
                  </span>
                </div>

                </div>
                {/* Add to Cart Button */}
                <button className="w-full bg-[#FF8D28] hover:bg-[#e67d1f] text-white font-medium py-3 rounded-lg transition-colors">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="flex justify-center">
          <button className="bg-[#DC3545] hover:bg-[#c82333] text-white font-medium px-10 py-3 rounded-lg transition-colors" >
            See All
          </button>
        </div>
      </div>
    </div>
  )
}

export default Shop