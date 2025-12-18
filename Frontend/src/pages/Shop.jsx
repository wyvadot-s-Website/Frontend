import React, { useState } from 'react'
import ShopListing from './ShopListing'
import ProductDetail from './ProductDetail'
import CartView from './CartView'
import CheckoutView from './CheckoutView'
import OrderComplete from './OrderComplete'

function Shop() {
  const [currentView, setCurrentView] = useState('listing')
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState([])
  const [countdown] = useState({ days: 2, hours: 12, mins: 40, secs: 0 })

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

  const handleCompleteOrder = () => {
    setCurrentView('completed')
  }

  const handleViewHistory = () => {
    setCart([])
    setCurrentView('listing')
  }

  if (currentView === 'listing') {
    return (
      <ShopListing 
        onProductClick={(product) => setCurrentView('product')}
      />
    )
  }

  if (currentView === 'product') {
    return (
      <ProductDetail 
        product={product}
        relatedProducts={relatedProducts}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={addToCart}
        countdown={countdown}
      />
    )
  }

  if (currentView === 'cart') {
    return (
      <CartView 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onProceedToCheckout={() => setCurrentView('checkout')}
      />
    )
  }

  if (currentView === 'checkout') {
    return (
      <CheckoutView 
        cart={cart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onCompleteOrder={handleCompleteOrder}
      />
    )
  }

  if (currentView === 'completed') {
    return (
      <OrderComplete 
        cart={cart}
        onViewHistory={handleViewHistory}
      />
    )
  }
}

export default Shop