// ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Heart } from "lucide-react";
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

function getCountdownParts(endDate) {
  if (!endDate) return null;

  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (Number.isNaN(end) || diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return { days, hours, mins, secs };
}

/**
 * Works in BOTH cases:
 * 1) Parent passes `product` (as before)
 * 2) Parent doesn’t pass `product` -> it will fetch using route param :id
 */
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

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(productProp || null);

  // ✅ If parent didn’t supply product, fetch it by :id
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (productProp) {
        setProduct(productProp);
        return;
      }

      if (!routeId) {
        setProduct(null);
        return;
      }

      try {
        setLoading(true);
        const res = await fetchProductById(routeId);

        // ✅ support either shape: direct product OR { item: product }
        const p = res?.item || res;

        setProduct(p || null);
      } catch (e) {
        if (mounted) {
          setProduct(null);
          toast.error(e?.message || "Failed to load product");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [routeId, productProp]);

  // ✅ Prevent “empty 0.00 product” UI
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 text-gray-600">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product?._id) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 text-gray-600">
          Product not found.
        </div>
      </div>
    );
  }

  const [activeImg, setActiveImg] = useState(0);

  // keep images stable when product changes
  useEffect(() => setActiveImg(0), [product?._id]);

  const images = product?.images?.length ? product.images : [];
  const mainImage = images[activeImg]?.url || images[0]?.url;

  const { isWished, toggle } = useWishlist();
  const wished = isWished(product?._id);

  // ✅ SALE LOGIC (frontend-safe)
  // - If saleEndsAt is future AND oldPrice exists -> sale active (discounted price = product.price)
  // - If saleEndsAt is past AND oldPrice exists -> revert display to oldPrice (no strike)
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

    // When sale is active: show price (discounted), strike oldPrice
    // When sale ended: show oldPrice as the current price (revert), no strike
    const displayPrice = hasDiscount && end && end <= now ? old : price;
    const strikePrice = isOnSale ? old : null;

    return { isOnSale, displayPrice, strikePrice, end };
  }, [product]);

  // ✅ Live ticking countdown (useMemo alone won’t update the UI)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!saleMeta.isOnSale) return;
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [saleMeta.isOnSale]);

  const countdown = useMemo(() => {
    if (!saleMeta.isOnSale) return null;
    return getCountdownParts(product?.saleEndsAt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleMeta.isOnSale, product?.saleEndsAt, tick]);

  const discountPercent = useMemo(() => {
    if (!saleMeta.isOnSale) return null;
    const current = Number(saleMeta.displayPrice || 0);
    const old = Number(saleMeta.strikePrice || 0);
    if (!old || old <= current || current <= 0) return null;
    return Math.round(((old - current) / old) * 100);
  }, [saleMeta]);

  // ✅ Ratings local (updates immediately after review submit)
  const [ratingAvgLocal, setRatingAvgLocal] = useState(
    Number(product?.ratingAverage || 0),
  );
  const [ratingCountLocal, setRatingCountLocal] = useState(
    Number(product?.ratingCount || 0),
  );

  useEffect(() => {
    setRatingAvgLocal(Number(product?.ratingAverage || 0));
    setRatingCountLocal(Number(product?.ratingCount || 0));
  }, [product?._id, product?.ratingAverage, product?.ratingCount]);

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
        <p className="text-sm text-gray-500">
          Home › Shop › {product?.category || "Uncategorized"} ›{" "}
          {product?.name || "Product"}
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
                title="Wishlist (login required)"
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

          {/* Product Info + Reviews */}
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

            {/* Countdown (only when sale is active + timer future) */}
            {countdown ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold mb-2">
                  Limited time offer ends in:
                </p>

                <div className="flex gap-4">
                  {[
                    { label: "DAYS", value: countdown.days },
                    { label: "HOURS", value: countdown.hours },
                    { label: "MINS", value: countdown.mins },
                    { label: "SECS", value: countdown.secs },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="bg-white rounded px-3 py-2 font-bold text-xl">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="text-xs mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Stock line */}
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

        {/* You might also like */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">You might also like</h2>
            <button className="text-white bg-red-500 px-4 py-2 rounded text-sm">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => {
              const img = item?.images?.[0]?.url;
              const rAvg = Number(item?.ratingAverage || 0);

              return (
                <div key={item._id} className="border rounded-lg p-4">
                  <div className="bg-gray-100 rounded mb-3 aspect-square flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={item.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="text-gray-500 text-sm">No image</div>
                    )}
                  </div>

                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <div className="mb-2">{renderStars(rAvg)}</div>
                  <p className="font-bold">{formatMoney(item.price)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
