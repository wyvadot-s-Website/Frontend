import React, { useState } from 'react'
import { ArrowLeft, Package, CreditCard, RefreshCw, Headphones, SlidersHorizontal, Search } from 'lucide-react'
import { Heart } from 'lucide-react'
import union from "../../public/SHop.png"
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
function ShopListing({ onProductClick }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPrices, setSelectedPrices] = useState([])

  const products = [
    { id: 1, name: 'Hammer', price: 8000, rating: 5, image: 'https://images.unsplash.com/photo-1580689155611-8f318b7c4b5c?w=300&q=80' },
    { id: 2, name: 'Screwdriver', price: 5000, rating: 4, image: 'https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=300&q=80' },
    { id: 3, name: 'Pliers', price: 6500, rating: 5, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&q=80' },
    { id: 4, name: 'Wrench', price: 7000, rating: 4, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&q=80' },
    { id: 5, name: 'Drill', price: 15000, rating: 5, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&q=80' },
    { id: 6, name: 'Saw', price: 12000, rating: 4, image: 'https://images.unsplash.com/photo-1580689155611-8f318b7c4b5c?w=300&q=80' },
    { id: 7, name: 'Level', price: 4500, rating: 5, image: 'https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=300&q=80' },
    { id: 8, name: 'Tape Measure', price: 3000, rating: 4, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&q=80' },
    { id: 9, name: 'Chisel Set', price: 9500, rating: 5, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&q=80' }
  ]

 const categories = [
    'All',
    'Building Materials',
    'Drills',
    'Exterior Decoration',
    'Grinders',
    'Hand Tools',
    'Interior Decoration',
    'Saws',
    'Uncategorized',
    'Vacuum'
  ]

  const priceRanges = [
    { label: 'All Price', value: 'all' },
    { label: '₦1,000 - ₦9,999', value: '1000-9999' },
    { label: '₦10,000 - ₦19,999', value: '10000-19999' },
    { label: '₦20,000 - ₦29,999', value: '20000-29999' },
    { label: '₦30,000 - ₦39,999', value: '30000-39999' },
    { label: '₦40,000+', value: '40000+' }
  ]

  const togglePrice = (value) => {
    if (selectedPrices.includes(value)) {
      setSelectedPrices(selectedPrices.filter(p => p !== value))
    } else {
      setSelectedPrices([...selectedPrices, value])
    }
  }



  return (
    <div className="min-h-screen bg-white mt-10" >

      {/* Hero Section */}
      <div 
                    className=" 
                      h-125 max-w-6xl mx-auto                     
                      rounded-4xl 
                      relative 
                      opacity-90                     
                    "
                  >
                    {/* Background Image Container */}
                    <img 
                      src={union}    /* 💡 IMPORTANT: Replace with your actual image path */
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
                       Projects
                      </h1>
                    </div>
                  </div>

      {/* Features Bar */}
      <div className="border-b max-w-6xl mx-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-8">
            <div className="flex flex-col items-start gap-3 bg-[#F3F5F7] p-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#0d0c0c"><g fill="none" stroke="#0d0c0c" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M16 6.25v9.51c-.12.149-.217.314-.29.49H8.29a2.5 2.5 0 0 0-4.58 0H3a1 1 0 0 1-1-1v-9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2m6 7.11v2.89h-1.71a2.49 2.49 0 0 0-4.29-.49V7.25h2.43a1 1 0 0 1 .86.49l.91 1.51l1.23 2.05a4 4 0 0 1 .57 2.06"/><path d="M8.5 17.25a2.5 2.5 0 1 1-4.79-1a2.5 2.5 0 0 1 4.79 1m12 0a2.5 2.5 0 1 1-4.79-1c.073-.176.17-.341.29-.49a2.49 2.49 0 0 1 4.29.49c.14.315.212.656.21 1m-9.5-6H6m5-3H6"/></g></svg>
              <div className='flex flex-col gap-2 items-start'>
                <p className="font-semibold text-md">Reliable Delivery</p>
                <p className="text-sm text-gray-500">Tracked, Secure, Nationwide</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 bg-[#F3F5F7] p-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 14 14" fill="#0d0c0c"><g fill="none" stroke="#0d0c0c" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11.5v2m2.5-3v2m-5-2v2m8-12h-11a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1"/><path d="M7 6.25a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5m-4.225-1.5a.25.25 0 0 1 0-.5m0 .5a.25.25 0 0 0 0-.5m8.45.5a.25.25 0 1 1 0-.5m0 .5a.25.25 0 1 0 0-.5"/></g></svg>
              <div className='flex flex-col gap-2 items-start'>
                <p className="font-semibold text-sm">Secure Payment</p>
                <p className="text-xs text-gray-500">100% secure payment</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 bg-[#F3F5F7] p-8">
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#0d0c0c" d="M47 19.8v-2.6c0-8-6-14.8-13.6-15.4c-4.2-.4-8.4 1.1-11.5 3.9S17 12.5 17 16.6v3.2C11.2 20.9 6.8 26 6.8 32.2v18.1c0 6.6 5.4 11.9 11.9 11.9h26.4c6.6 0 12-5.4 12-12V32c.1-6-4.3-11-10.1-12.2M24.9 9C27.1 7 30 6 33 6.3c5.3.5 9.5 5.3 9.5 10.9v2.3h-21v-3c0-2.8 1.2-5.5 3.4-7.5m27.8 41.3c0 4.1-3.4 7.5-7.5 7.5H18.8c-4.1 0-7.4-3.3-7.4-7.4V32.2c0-4.5 3.6-8.1 8.1-8.1h25c4.5 0 8.2 3.6 8.2 7.9z"/><path fill="#0d0c0c" d="M32 34.5c-1.2 0-2.3 1-2.3 2.3v10.5c0 1.2 1 2.3 2.3 2.3c1.2 0 2.3-1 2.3-2.3V36.7c0-1.2-1.1-2.2-2.3-2.2"/></svg>
              <div className='flex flex-col gap-2 items-start'>
                <p className="font-semibold text-sm">Easy Returns</p>
                <p className="text-xs text-gray-500">30 days return policy</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 bg-[#F3F5F7] p-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><path fill="#0d0c0c" d="M26 29h-.17C6.18 27.87 3.39 11.29 3 6.23A3 3 0 0 1 5.76 3h5.51a2 2 0 0 1 1.86 1.26L14.65 8a2 2 0 0 1-.44 2.16l-2.13 2.15a9.37 9.37 0 0 0 7.58 7.6l2.17-2.15a2 2 0 0 1 2.17-.41l3.77 1.51A2 2 0 0 1 29 20.72V26a3 3 0 0 1-3 3ZM6 5a1 1 0 0 0-1 1v.08C5.46 12 8.41 26 25.94 27a1 1 0 0 0 1.06-.94v-5.34l-3.77-1.51l-2.87 2.85l-.48-.06c-8.7-1.09-9.88-9.79-9.88-9.88l-.06-.48l2.84-2.87L11.28 5Z"/></svg>
              <div className='flex flex-col gap-2 items-start'>
                <p className="font-semibold text-sm">24/7 Support</p>
                <p className="text-xs text-gray-500">Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="col-span-1">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Filter Button */}
            <Button variant="outline" className="w-full mb-6 justify-start gap-2">
              <SlidersHorizontal size={18} />
              Filter
            </Button>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-bold text-sm uppercase mb-4">CATEGORIES</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left text-sm py-1 ${
                      selectedCategory === category 
                        ? 'text-orange-500 font-semibold' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-bold text-sm uppercase mb-4">PRICE</h3>
              <div className="space-y-3">
                {priceRanges.map((range, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={range.value}
                      checked={selectedPrices.includes(range.value)}
                      onCheckedChange={() => togglePrice(range.value)}
                      className={selectedPrices.includes(range.value) ? 'border-orange-500 bg-orange-500' : ''}
                    />
                    <label
                      htmlFor={range.value}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">Showing 1-9 of 123 results</p>
              <select className="border rounded px-4 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Best Rating</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-6">
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

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100">
                ←
              </button>
              <button className="w-8 h-8 border rounded flex items-center justify-center bg-orange-500 text-white">
                1
              </button>
              <button className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100">
                2
              </button>
              <button className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100">
                3
              </button>
              <button className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopListing