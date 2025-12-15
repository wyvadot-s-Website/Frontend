import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 inline-block">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound
