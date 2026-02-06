// ProductDetail.jsx - DEBUG VERSION
// ✅ Added console logs to help identify the issue

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import ProductReviews from "@/components/ProductReviews";
import { fetchProductById } from "@/services/shopService";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

function ProductDetail({
  product: productProp,
  relatedProducts = [],
  quantity = 1,
  setQuantity = () => {},
  onAddToCart,
}) {
  const params = useParams();
  const routeId = params.id || params.productId || params.pid || params._id;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ FIX: ALL useState hooks MUST be at the top
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(productProp || null);
  const [activeImg, setActiveImg] = useState(0);
  const [ratingAvgLocal, setRatingAvgLocal] = useState(0);
  const [ratingCountLocal, setRatingCountLocal] = useState(0);
  const [tick, setTick] = useState(0);

  // ✅ Wishlist hook
  const { isWished, toggle } = useWishlist();

  // ✅ DEBUG: Log what's happening
  useEffect(() => {
    console.log("🔍 ProductDetail Debug:");
    console.log("  - routeId:", routeId);
    console.log("  - productProp:", productProp);
    console.log("  - current product state:", product);
  }, [routeId, productProp, product]);

  // ✅ Fetch product by ID
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // If parent passed product, use it
      if (productProp) {
        console.log("✅ Using productProp from parent");
        setProduct(productProp);
        return;
      }

      // If no routeId, can't fetch
      if (!routeId) {
        console.log("❌ No routeId available");
        setProduct(null);
        return;
      }

      try {
        console.log(`🌐 Fetching product with ID: ${routeId}`);
        setLoading(true);
        
        const res = await fetchProductById(routeId);
        console.log("📦 API Response:", res);

        // Support either shape: direct product OR { item: product }
        const p = res?.item || res;
        console.log("📦 Extracted product:", p);

        if (mounted) {
          setProduct(p || null);
          console.log(p ? "✅ Product loaded successfully" : "❌ No product data");
        }
      } catch (e) {
        console.error("❌ Error fetching product:", e);
        if (mounted) {
          setProduct(null);
          toast.error(e?.message || "Failed to load product");
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("✅ Loading finished");
        }
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [routeId, productProp]);

  // Keep images stable when product changes
  useEffect(() => setActiveImg(0), [product?._id]);

  // ✅ Update local ratings when product changes
  useEffect(() => {
    setRatingAvgLocal(Number(product?.ratingAverage || 0));
    setRatingCountLocal(Number(product?.ratingCount || 0));
  }, [product?._id, product?.ratingAverage, product?.ratingCount]);

  // ✅ SALE LOGIC
  const saleMeta = useMemo(() => {
    const price = Number(product?.price || 0);
    const old = Number(product?.oldPrice || 0);
    const end = product?.saleEndsAt
      ? new Date(product.saleEndsAt).getTime()
      : null;
    const now = Date.now();

    const hasDiscount = old > 0 && old > price;
    const isInTimer = !!end && !Number.isNaN(end) && end > now;
    const isOnSale = hasDiscount && isInTimer;

    const displayPrice = hasDiscount && end && end <= now ? old : price;
    const strikePrice = isOnSale ? old : null;

    return { isOnSale, displayPrice, strikePrice, end };
  }, [product]);

  // ✅ Live ticking countdown
  useEffect(() => {
    if (!saleMeta.isOnSale) return;
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [saleMeta.isOnSale]);

  const countdown = useMemo(() => {
    if (!saleMeta.isOnSale) return null;
    return null; // Simplified for debugging
  }, [saleMeta.isOnSale]);

  const discountPercent = useMemo(() => {
    if (!saleMeta.isOnSale) return null;
    const current = Number(saleMeta.displayPrice || 0);
    const old = Number(saleMeta.strikePrice || 0);
    if (!old || old <= current || current <= 0) return null;
    return Math.round(((old - current) / old) * 100);
  }, [saleMeta]);

  // ✅ Early returns AFTER all hooks
  if (loading) {
    console.log("⏳ Showing loading state");
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-gray-600 text-center">
            <div className="text-xl mb-4">Loading product...</div>
            <div className="text-sm text-gray-500">Product ID: {routeId}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product?._id) {
    console.log("❌ Showing 'not found' state - product:", product);
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-gray-600 text-center">
            <div className="text-xl mb-4">Product not found</div>
            <div className="text-sm text-gray-500 mb-4">Product ID: {routeId}</div>
            <button
              onClick={() => navigate("/shop")}
              className="bg-orange-500 text-white px-6 py-2 rounded"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("✅ Rendering product:", product);

  // Rest of your component rendering code...
  const images = product?.images?.length ? product.images : [];
  const mainImage = images[activeImg]?.url || images[0]?.url;
  const wished = isWished(product?._id);

  const isOut =
    product?.status === "out_of_stock" ||
    product?.status === "archived" ||
    Number(product?.stockQuantity || 0) <= 0;

  const stockQty = Number(product?.stockQuantity || 0);

  const handleMinus = () => setQuantity(Math.max(1, Number(quantity || 1) - 1));
  const handlePlus = () => {
    const q = Number(quantity || 1);
    if (!stockQty) return setQuantity(q + 1);
    if (q + 1 > stockQty) return toast.error(`Only ${stockQty} left in stock`);
    setQuantity(q + 1);
  };

  const handleAddToCart = () => {
    if (isOut) return toast.error("This product is out of stock");
    if (stockQty && Number(quantity || 1) > stockQty)
      return toast.error(`Only ${stockQty} left in stock`);
    onAddToCart?.(product, Number(quantity || 1));
  };

  const handleWishlist = async () => {
    if (!token) {
      toast.error("Please login to use Wishlist");
      navigate("/login");
      return;
    }

    try {
      await toggle(product._id);
      toast.success("Wishlist updated");
    } catch (err) {
      toast.error(err.message || "Wishlist failed");
    }
  };

  const renderStars = (avg) => {
    const full = Math.round(Number(avg || 0));
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < full ? "text-black" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Shop</span>
        </button>
        <p className="text-sm text-gray-500">
          Home › Shop › {product?.category || "Uncategorized"} › {product?.name || "Product"}
        </p>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-gray-100 rounded-lg mb-4 aspect-square flex items-center justify-center relative">
              {discountPercent ? (
                <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discountPercent}%
                </span>
              ) : null}

              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 p-2 hover:bg-white/70 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wished ? "text-red-500 fill-red-500" : "text-gray-600"
                  }`}
                />
              </button>

              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product?.name}
                  className="w-72 h-72 object-contain"
                />
              ) : (
                <div className="text-gray-500">No image</div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(images.length ? images : Array.from({ length: 4 })).map(
                (img, i) => (
                  <button
                    key={img?.public_id || i}
                    onClick={() => setActiveImg(i)}
                    className={`bg-gray-100 rounded aspect-square flex items-center justify-center p-2 border ${
                      i === activeImg
                        ? "border-orange-500"
                        : "border-transparent"
                    }`}
                  >
                    {img?.url ? (
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-gray-400">—</div>
                    )}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {product?.category || "Uncategorized"}
            </p>

            <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              {renderStars(ratingAvgLocal)}
              <span className="text-sm text-gray-500">
                ({Number(ratingAvgLocal || 0).toFixed(1)})
                {ratingCountLocal ? ` • ${ratingCountLocal} reviews` : ""}
              </span>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <div className="text-3xl font-bold">
                {formatMoney(saleMeta.displayPrice)}
              </div>
              {saleMeta.strikePrice ? (
                <div className="text-gray-400 line-through">
                  {formatMoney(saleMeta.strikePrice)}
                </div>
              ) : null}
            </div>

            <p className="text-gray-600 mb-6">{product?.description || ""}</p>

            {/* Stock */}
            <div className="mb-4">
              {isOut ? (
                <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                  Out of stock
                </span>
              ) : (
                <span className="text-sm text-gray-600">
                  Stock: <span className="font-semibold">{stockQty}</span>
                </span>
              )}
            </div>

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded">
                <button
                  onClick={handleMinus}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border-x">
                  {Number(quantity || 1)}
                </span>
                <button
                  onClick={handlePlus}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOut}
                className={`flex-1 py-3 rounded font-semibold transition-colors ${
                  isOut
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#FF8D28] text-white hover:bg-[#e67d1f]"
                }`}
              >
                {isOut ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Reviews */}
            <ProductReviews
              productId={product._id}
              onStatsUpdated={(stats) => {
                setRatingAvgLocal(Number(stats?.ratingAverage || 0));
                setRatingCountLocal(Number(stats?.ratingCount || 0));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
