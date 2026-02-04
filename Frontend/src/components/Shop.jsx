import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { fetchProducts } from '../services/shopService'
import { toast } from 'sonner'
import AuthModal from '@/pages/AuthModal.jsx'

function formatNaira(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
}

// Helper to get a stable random seed based on current date
function getDailySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// Seeded random shuffle (Fisher-Yates)
function seededShuffle(array, seed) {
  const arr = [...array];
  let currentSeed = seed;
  
  // Simple seeded random number generator
  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
}

function Shop({ onProductClick }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalView, setAuthModalView] = useState("login");

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch products with a reasonable limit (more than 4 to randomize)
        const result = await fetchProducts({ 
          limit: 20, // Fetch more to have variety for randomization
          status: 'active', // Only show active products
          inStock: 'true' // Only show in-stock products
        });

        if (result.success && result.items?.length > 0) {
          // Get daily seed and shuffle
          const seed = getDailySeed();
          const shuffled = seededShuffle(result.items, seed);
          
          // Take first 4 from shuffled array
          setProducts(shuffled.slice(0, 4));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleClick = () => { 
    navigate("/shop");
  };

  // Handle product click - check if logged in
  const handleProductClick = (productId) => {
    if (!isLoggedIn) {
      toast.error("Please login to view product details");
      setAuthModalView("login");
      setShowAuthModal(true);
      return;
    }
    
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  // Handle add to cart - check if logged in
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      setAuthModalView("login");
      setShowAuthModal(true);
      return;
    }
    
    // Add to cart functionality
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-6">
            Shop with us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden animate-pulse">
                <div className="p-4">
                  <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-6">
            Shop with us
          </h2>
          <div className="text-center text-gray-600 py-12">
            No products available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-6">
          Shop with us
        </h2>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => {
            const id = product._id || product.id;
            const displayPrice = product.effectivePrice ?? product.price;
            const strikePrice = product.isOnSale
              ? (product.originalPrice ?? product.oldPrice)
              : null;
            const imageUrl = product.images?.[0]?.url || product.image || '';
            const ratingAvg = Number(product?.ratingAverage || 0);
            const stars = Math.round(ratingAvg);

            return (
              <div 
                key={id} 
                onClick={() => handleProductClick(id)} 
                className="rounded-lg overflow-hidden cursor-pointer"
              >
                {/* Product Details */}
                <div className="p-4">
                  {/* Product Image Container */}
                  <div className='bg-gray-50 border border-[#F1F5F966] rounded-lg mb-4 pb-2'>
                    <div className="relative p-0 flex items-center justify-center h-64">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          if (!isLoggedIn) {
                            toast.error("Please login to use Wishlist");
                            setAuthModalView("login");
                            setShowAuthModal(true);
                            return;
                          }
                          
                          // Add wishlist functionality here if needed
                          toast.success("Added to wishlist");
                        }}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Wishlist"
                      >
                        <Heart className="w-5 h-5 text-gray-400" />
                      </button>
                      <img 
                        src={imageUrl} 
                        alt={product.name}
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                    
                    {/* Star Rating */}
                    <div className="flex items-center gap-2 px-5">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-sm ${i < stars ? "text-black" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({ratingAvg.toFixed(1)})
                      </span>
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="text-gray-900 font-medium mb-2 px-5">
                      {product.name}
                    </h3>
                    
                    {/* Pricing */}
                    <div className="flex items-center gap-2 mb-4 px-5">
                      <span className="text-gray-900 font-semibold">
                        {formatNaira(displayPrice)}
                      </span>
                      {strikePrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {formatNaira(strikePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-[#FF8D28] hover:bg-[#e67d1f] text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* See All Button */}
        <div className="flex justify-center">
          <button 
            className="bg-[#DC3545] hover:bg-[#c82333] text-white font-medium px-10 py-3 rounded-lg transition-colors" 
            onClick={handleClick}
          >
            See All
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialView={authModalView}
      />
    </div>
  );
}

export default Shop;