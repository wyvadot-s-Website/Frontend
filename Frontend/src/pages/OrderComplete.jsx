import React from 'react'
import { Check } from 'lucide-react'

function OrderComplete({ cart, onViewHistory }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <Check size={16} />
              </div>
              <span className="text-gray-500">Shopping Cart</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <Check size={16} />
              </div>
              <span className="text-gray-500">Checkout Detail</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <Check size={16} />
              </div>
              <span className="font-semibold">Order Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Completed!</h1>
          <p className="text-xl text-gray-600 mb-8">Thank you!</p>
          <p className="text-gray-600 mb-8">Your order has been received</p>

          {/* Order Items */}
          <div className="flex justify-center gap-8 mb-8">
            {cart.map(item => (
              <div key={item.id} className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg mb-2 mx-auto relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full text-xs flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <p className="text-sm font-semibold">{item.name}</p>
              </div>
            ))}
          </div>

          <button onClick={onViewHistory} className="bg-gray-900 text-white px-8 py-3 rounded font-semibold hover:bg-gray-800">
            Purchase History
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderComplete