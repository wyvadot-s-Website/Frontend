import React from 'react'
import { Check } from 'lucide-react'

function CheckoutView({ cart, subtotal, shipping, total, onCompleteOrder }) {
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
              <span className="font-semibold">Checkout Detail</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">3</div>
              <span className="text-gray-500">Order Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Check Out</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">First name</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Last name</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Email address</label>
                  <input type="email" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Shipping Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                  <input type="radio" name="shipping" defaultChecked />
                  <div className="flex-1">
                    <p className="font-semibold">Free shipping</p>
                    <p className="text-sm text-gray-500">7-30 business days</p>
                  </div>
                  <span className="font-semibold">₦0</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                  <input type="radio" name="shipping" />
                  <div className="flex-1">
                    <p className="font-semibold">Regular shipping</p>
                    <p className="text-sm text-gray-500">3-14 business days</p>
                  </div>
                  <span className="font-semibold">₦7,500</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                  <input type="radio" name="shipping" />
                  <div className="flex-1">
                    <p className="font-semibold">Express shipping</p>
                    <p className="text-sm text-gray-500">1-3 business days</p>
                  </div>
                  <span className="font-semibold">₦22,500</span>
                </label>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Payment Card</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Email or mobile phone number</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Expiration date</label>
                    <input type="text" placeholder="MM/YY" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Security code</label>
                    <input type="text" placeholder="CVV" className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="font-bold text-xl mb-4">Order summary</h2>
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">₦{shipping.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-orange-500">₦{total.toLocaleString()}</span>
              </div>
            </div>
            
            <button onClick={onCompleteOrder} className="w-full bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600 mt-6">
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutView