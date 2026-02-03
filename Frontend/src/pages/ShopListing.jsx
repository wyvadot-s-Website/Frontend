import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search, Heart, ShoppingCart } from "lucide-react";
import union from "../../public/SHop.png";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import FeatureCards from "../pages/FeatureCards.jsx"; 

function formatNaira(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
}

function parseRange(value) {
  if (value === "all") return { minPrice: "", maxPrice: "" };
  if (value.endsWith("+")) {
    const min = Number(value.replace("+", ""));
    return { minPrice: String(min), maxPrice: "" };
  }
  const [min, max] = value.split("-").map(Number);
  return { minPrice: String(min), maxPrice: String(max) };
}

function ShopListing({
  products = [],
  onProductClick,
  cartCount = 0,
  onOpenCart,
  onAddToCartFromListing,
  showFloatingCart = true,

  // ✅ controlled filters/pagination (from UserShop / GuestShop)
  filters,
  meta,
  onChangeCategory,
  onChangeSearch,
  onChangePriceRange,
  onChangeInStock,
  onChangeSort,
  onChangePage,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isWished, toggle } = useWishlist();

  const categories = [
    "All",
    "Building Materials",
    "Equipment and Components",
    "Building Plans",
    "Solar system",
    "Installations",
    "Software",
    "Furniture & Decor",
    "Rentals",
    "Wyvadot Merch",
    "Uncategorized",
  ];

  const priceRanges = [
    { label: "All Price", value: "all" },
    { label: "₦1,000 - ₦9,999", value: "1000-9999" },
    { label: "₦10,000 - ₦19,999", value: "10000-19999" },
    { label: "₦20,000 - ₦29,999", value: "20000-29999" },
    { label: "₦30,000 - ₦39,999", value: "30000-39999" },
    { label: "₦40,000+", value: "40000+" },
  ];

  // local UI state (controlled by props, but kept for input responsiveness)
  const [searchUI, setSearchUI] = useState(filters?.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters?.category || "All",
  );
  const [selectedPrice, setSelectedPrice] = useState("all"); // single select
  const [showFilters, setShowFilters] = useState(false);

  // keep UI in sync when parent changes filters externally
  useEffect(() => setSearchUI(filters?.search || ""), [filters?.search]);
  useEffect(
    () => setSelectedCategory(filters?.category || "All"),
    [filters?.category],
  );

  // Search debounce (FIX: don't reset page if value didn't change)
  useEffect(() => {
    const current = String(filters?.search || "");
    const next = String(searchUI || "");

    // ✅ if same value, do nothing (prevents page resetting to 1)
    if (current === next) return;

    const t = setTimeout(() => {
      onChangeSearch?.(next);
    }, 400);

    return () => clearTimeout(t);
  }, [searchUI, filters?.search, onChangeSearch]);
  
  // Try to infer which price range is active (optional)
  useEffect(() => {
    const min = String(filters?.minPrice ?? "");
    const max = String(filters?.maxPrice ?? "");
    if (!min && !max) return setSelectedPrice("all");

    // Find match in priceRanges
    const found = priceRanges.find((r) => {
      const parsed = parseRange(r.value);
      return String(parsed.minPrice) === min && String(parsed.maxPrice) === max;
    });
    setSelectedPrice(found ? found.value : "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.minPrice, filters?.maxPrice]);

  const page = Number(filters?.page || meta?.page || 1);
  const totalPages = Number(meta?.totalPages || 1);
  const total = Number(meta?.total || 0);

  const pagesToShow = useMemo(() => {
    const tp = Math.max(1, totalPages);
    const p = Math.min(Math.max(1, page), tp);

    // window of 5 pages
    const start = Math.max(1, p - 2);
    const end = Math.min(tp, start + 4);
    const realStart = Math.max(1, end - 4);

    return Array.from({ length: end - realStart + 1 }, (_, i) => realStart + i);
  }, [page, totalPages]);

  const handleTogglePrice = (value) => {
    // single-select behavior
    const next = value === selectedPrice ? "all" : value;
    setSelectedPrice(next);
    onChangePriceRange?.(parseRange(next));
  };

  return (
    <div className="min-h-screen bg-white mt-10">
      {/* Hero Section */}
      {/* Hero Section */}
<div className="px-5 lg:px-0 max-w-6xl mx-auto rounded-2xl sm:rounded-4xl relative overflow-hidden mb-6 sm:mb-10 mx-4 sm:mx-6 lg:mx-auto">
  <img src={union} alt="Shop hero" className="w-full h-full object-cover" />
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold z-10">
      Shop
    </h1>
  </div>
</div>
    
        <FeatureCards />
      {/* Features Bar */}
      <div className="max-w-6xl mx-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-8">
            {/* (unchanged icons/blocks) */}
            {/* ... keep your 4 blocks exactly as they are ... */}
          </div>
        </div>
      </div>

     {/* Main Content */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
{/* Mobile Filter Toggle */}
<div className="lg:hidden mb-6">
  <Button
    variant="outline"
    className="w-full justify-start gap-2 border-gray-300"
    onClick={() => setShowFilters(!showFilters)}
  >
    <SlidersHorizontal size={18} />
    {showFilters ? "Hide Filters" : "Show Filters"}
  </Button>
</div>

{/* Sidebar Filters - Add state for mobile toggle */}
<div className={`${showFilters ? 'block' : 'hidden'} lg:block col-span-1 bg-white p-4 sm:p-6 rounded-lg`}>
  {/* Remove the desktop filter button on mobile */}
  <Button
    variant="outline"
    className="hidden lg:flex w-full mb-6 justify-start gap-2 border-gray-300"
  >
    <SlidersHorizontal size={18} />
    Filter
  </Button>

  {/* Categories */}
  <div className="mb-8">
    <h3 className="font-bold text-sm uppercase mb-4 text-black">CATEGORIES</h3>
    <div className="space-y-2.5">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => {
            setSelectedCategory(category);
            onChangeCategory?.(category);
          }}
          className={`block w-full text-left text-sm py-1 transition-colors ${
            selectedCategory === category
              ? "text-orange-500 font-semibold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  </div>

  {/* Price */}
  <div className="mb-8">
    <h3 className="font-bold text-sm uppercase mb-4 text-black">PRICE</h3>
    <div className="space-y-3">
      {priceRanges.map((range, index) => (
        <div key={index} className="flex items-center justify-between">
          <label
            htmlFor={range.value}
            className="text-sm text-gray-600 cursor-pointer flex-1"
          >
            {range.label}
          </label>
          <Checkbox
            id={range.value}
            checked={selectedPrice === range.value}
            onCheckedChange={() => handleTogglePrice(range.value)}
            className={
              selectedPrice === range.value
                ? "border-orange-500 bg-orange-500 data-[state=checked]:bg-orange-500"
                : "border-gray-300"
            }
          />
        </div>
      ))}
    </div>
  </div>

  {/* Availability (optional - remove if not in image) */}
  <div>
    <h3 className="font-bold text-sm uppercase mb-4 text-black">AVAILABILITY</h3>
    <div className="flex items-center justify-between">
      <label
        htmlFor="inStock"
        className="text-sm text-gray-600 cursor-pointer flex-1"
      >
        In stock only
      </label>
      <Checkbox
        id="inStock"
        checked={filters?.inStock === "true"}
        onCheckedChange={(checked) =>
          onChangeInStock?.(checked ? "true" : "")
        }
        className={
          filters?.inStock === "true"
            ? "border-orange-500 bg-orange-500"
            : "border-gray-300"
        }
      />
    </div>
  </div>
    </div>

          {/* Products Grid */}
          <div className="col-span-1 lg:col-span-3">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
    <p className="text-sm sm:text-base text-gray-600">
      Showing {products.length} product{products.length !== 1 ? "s" : ""}
      {total ? ` (Total: ${total})` : ""}
    </p>

    <select
      className="w-full sm:w-auto border rounded px-4 py-2 text-sm"
      value={filters?.sort || "newest"}
      onChange={(e) => onChangeSort?.(e.target.value)}
    >
      <option value="newest">Sort by: Newest</option>
      <option value="price_asc">Sort by: Price (Low → High)</option>
      <option value="price_desc">Sort by: Price (High → Low)</option>
    </select>
  </div>

            {/* Empty state */}
            {products.length === 0 ? (
              <div className="border rounded-lg p-10 text-center text-gray-600">
                No products found for these filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => {
                  const id = product._id || product.id;
                  const wished = isWished(id);
                  const displayPrice = product.effectivePrice ?? product.price;
                  const strikePrice = product.isOnSale
                    ? (product.originalPrice ?? product.oldPrice)
                    : null;
                  const imageUrl =
                    product.images?.[0]?.url || product.image || "";
                  const ratingAvg = Number(product?.ratingAverage || 0);
                  const stars = Math.round(ratingAvg);
                  const stockQty = Number(product?.stockQuantity || 0);
                  const isOut =
                    product?.status === "out_of_stock" ||
                    product?.status === "archived" ||
                    stockQty <= 0;

                  return (
                    <div
                      key={id}
                      onClick={() => onProductClick?.(id)}
                      className="rounded-lg overflow-hidden cursor-pointer"
                    >
                      <div className="p-4">
                        <div className="bg-gray-50 border border-[#F1F5F966] rounded-lg mb-4 pb-2">
                          <div className="relative p-0 flex items-center justify-center h-64">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();

                                if (!token) {
                                  toast.error("Please login to use Wishlist");
                                  navigate("/login");
                                  return;
                                }

                                try {
                                  await toggle(id);
                                  toast.success("Wishlist updated");
                                } catch (err) {
                                  toast.error(err.message || "Wishlist failed");
                                }
                              }}
                              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                              title="Wishlist"
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  wished
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>

                            {isOut ? (
                              <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-orange-600">
                                Out of Stock
                              </span>
                            ) : null}

                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-40 h-40 object-contain"
                            />
                          </div>

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

                          <h3 className="text-gray-900 font-medium mb-2 px-5">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-4 px-5">
                            <span className="text-gray-900 font-semibold">
                              {formatNaira(displayPrice)}
                            </span>
                            {strikePrice ? (
                              <span className="text-gray-400 line-through text-sm">
                                {formatNaira(strikePrice)}
                              </span>
                            ) : null}
                          </div>

                          <div className="px-5 pb-3 text-xs text-gray-500">
                            {isOut
                              ? "No stock available"
                              : `Stock: ${stockQty}`}
                          </div>
                        </div>

                        {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isOut) return;
          onAddToCartFromListing?.(product);
        }}
        disabled={isOut}
        className={`w-full font-medium py-2.5 rounded-lg transition-colors text-sm ${
          isOut
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-400 hover:bg-gray-500 text-white"
        }`}
      >
        {isOut ? "Out of Stock" : "Add to cart"}
      </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
{totalPages > 1 && (
  <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 flex-wrap">
    <button
      className="w-8 h-8 sm:w-10 sm:h-10 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 text-sm sm:text-base"
      disabled={page <= 1}
      onClick={() => onChangePage?.(page - 1)}
    >
      ←
    </button>

    {pagesToShow.map((p) => (
      <button
        key={p}
        onClick={() => onChangePage?.(p)}
        className={`w-8 h-8 sm:w-10 sm:h-10 border rounded flex items-center justify-center hover:bg-gray-100 text-sm sm:text-base ${
          p === page
            ? "bg-orange-500 text-white hover:bg-orange-500"
            : ""
        }`}
      >
        {p}
      </button>
    ))}

    <button
      className="w-8 h-8 sm:w-10 sm:h-10 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 text-sm sm:text-base"
      disabled={page >= totalPages}
      onClick={() => onChangePage?.(page + 1)}
    >
      →
    </button>
  </div>
)}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
{showFloatingCart && typeof onOpenCart === "function" && (
  <button
    onClick={onOpenCart}
    className="
      fixed bottom-4 right-4 sm:bottom-6 sm:right-6
      w-12 h-12 sm:w-14 sm:h-14 rounded-full
      bg-[#FF8D28] hover:bg-[#e67d1f]
      text-white shadow-lg
      flex items-center justify-center
      z-50
    "
    title="View cart"
  >
    <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />

    {cartCount > 0 && (
      <span className="
        absolute -top-1 -right-1 sm:-top-2 sm:-right-2
        min-w-[20px] h-5 sm:min-w-[24px] sm:h-6
        px-1.5 sm:px-2
        rounded-full
        bg-black text-white
        text-xs font-bold
        flex items-center justify-center
      ">
        {cartCount}
      </span>
    )}
  </button>
)}
    </div>
  );
}

export default ShopListing;
