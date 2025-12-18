import React from 'react'
import { Plus, Minus } from 'lucide-react'

function ProductDetail({ product, relatedProducts, quantity, setQuantity, onAddToCart, countdown }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <p className="text-sm text-gray-500">Home › Product › Tools › Hammer</p>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-gray-100 rounded-lg mb-4 aspect-square flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-64 h-64 object-contain" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-gray-100 rounded aspect-square flex items-center justify-center">
                  <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Tools & Equipment</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">★★★★★</div>
              <span className="text-sm text-gray-500">(5.0)</span>
            </div>
            
            <div className="text-3xl font-bold mb-4">₦{product.price.toLocaleString()}</div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Countdown */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold mb-2">Limited time offer ends in:</p>
              <div className="flex gap-4">
                {[
                  { label: 'DAYS', value: countdown.days },
                  { label: 'HOURS', value: countdown.hours },
                  { label: 'MINS', value: countdown.mins },
                  { label: 'SECS', value: countdown.secs }
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className="bg-white rounded px-3 py-2 font-bold text-xl">{item.value.toString().padStart(2, '0')}</div>
                    <div className="text-xs mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100">
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={onAddToCart} className="flex-1 bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* You might also like */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">You might also like</h2>
            <button className="text-white bg-red-500 px-4 py-2 rounded text-sm">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(item => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="bg-gray-100 rounded mb-3 aspect-square flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-4" />
                </div>
                <h3 className="font-semibold mb-1">{item.name}</h3>
                <div className="flex text-yellow-400 text-sm mb-2">{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</div>
                <p className="font-bold">₦{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail