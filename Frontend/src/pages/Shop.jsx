import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, Check } from 'lucide-react'

function Shop() {
  const [currentView, setCurrentView] = useState('product') // product, cart, checkout, completed
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState([])
  const [countdown, setCountdown] = useState({ days: 2, hours: 12, mins: 40, secs: 0 })

  const product = {
    id: 1,
    name: 'Hammer',
    price: 8000.00,
    description: 'Quality construction hammer for professional and DIY use',
    image: 'https://images.unsplash.com/photo-1580689155611-8f318b7c4b5c?w=400&q=80'
  }

  const relatedProducts = [
    { id: 2, name: 'SCREWDRIVER', price: 5000.00, rating: 4, image: 'https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=300&q=80' },
    { id: 3, name: 'PLIERS', price: 6500.00, rating: 5, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&q=80' },
    { id: 4, name: 'WRENCH', price: 7000.00, rating: 4, image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&q=80' },
    { id: 5, name: 'DRILL', price: 15000.00, rating: 5, image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&q=80' }
  ]

  const addToCart = () => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
    setCurrentView('cart')
  }

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 2000
  const total = subtotal + shipping

  // Product Detail View
  if (currentView === 'product') {
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
                <button onClick={addToCart} className="flex-1 bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600">
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

  // Cart View
  if (currentView === 'cart') {
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
                <span className="font-semibold">Shopping Cart</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">2</div>
                <span className="text-gray-500">Checkout Detail</span>
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
          <h1 className="text-3xl font-bold mb-8">Cart</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-6 flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Color: Red</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded">
                        <Minus size={14} />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold mb-2">₦{(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 h-fit">
              <h2 className="font-bold text-xl mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">₦{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setCurrentView('checkout')} className="w-full bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Checkout View
  if (currentView === 'checkout') {
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
              
              <button onClick={() => setCurrentView('completed')} className="w-full bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600 mt-6">
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Completed View
  if (currentView === 'completed') {
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

            <button onClick={() => {
              setCart([])
              setCurrentView('product')
            }} className="bg-gray-900 text-white px-8 py-3 rounded font-semibold hover:bg-gray-800">
              Purchase History
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Shop