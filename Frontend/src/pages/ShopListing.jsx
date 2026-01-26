import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search, Heart, ShoppingCart } from "lucide-react";
import union from "../../public/SHop.png";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";

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
      <div className="h-125 max-w-6xl mx-auto rounded-4xl relative opacity-90">
        <img src={union} alt="Shop hero" className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold z-10">
            Shop
          </h1>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-b max-w-6xl mx-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-8">
            {/* (unchanged icons/blocks) */}
            {/* ... keep your 4 blocks exactly as they are ... */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="col-span-1">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="pr-10"
                  value={searchUI}
                  onChange={(e) => setSearchUI(e.target.value)}
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            {/* Filter Button (kept) */}
            <Button
              variant="outline"
              className="w-full mb-6 justify-start gap-2"
            >
              <SlidersHorizontal size={18} />
              Filter
            </Button>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-bold text-sm uppercase mb-4">CATEGORIES</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(category);
                      onChangeCategory?.(category);
                    }}
                    className={`block w-full text-left text-sm py-1 ${
                      selectedCategory === category
                        ? "text-orange-500 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <h3 className="font-bold text-sm uppercase mb-4">PRICE</h3>
              <div className="space-y-3">
                {priceRanges.map((range, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={range.value}
                      checked={selectedPrice === range.value}
                      onCheckedChange={() => handleTogglePrice(range.value)}
                      className={
                        selectedPrice === range.value
                          ? "border-orange-500 bg-orange-500"
                          : ""
                      }
                    />
                    <label
                      htmlFor={range.value}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* In-stock (optional but backend supports it) */}
            <div>
              <h3 className="font-bold text-sm uppercase mb-4">AVAILABILITY</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters?.inStock === "true"}
                  onCheckedChange={(checked) =>
                    onChangeInStock?.(checked ? "true" : "")
                  }
                  className={
                    filters?.inStock === "true"
                      ? "border-orange-500 bg-orange-500"
                      : ""
                  }
                />
                <label
                  htmlFor="inStock"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  In stock only
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {products.length} product
                {products.length !== 1 ? "s" : ""}
                {total ? ` (Total: ${total})` : ""}
              </p>

              <select
                className="border rounded px-4 py-2 text-sm"
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
              <div className="grid grid-cols-3 gap-6">
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

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isOut) return;
                            onAddToCartFromListing?.(product);
                          }}
                          disabled={isOut}
                          className={`w-full font-medium py-3 rounded-lg transition-colors ${
                            isOut
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-[#FF8D28] hover:bg-[#e67d1f] text-white"
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

            {/* ✅ Functional Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                  disabled={page <= 1}
                  onClick={() => onChangePage?.(page - 1)}
                >
                  ←
                </button>

                {pagesToShow.map((p) => (
                  <button
                    key={p}
                    onClick={() => onChangePage?.(p)}
                    className={`w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 ${
                      p === page
                        ? "bg-orange-500 text-white hover:bg-orange-500"
                        : ""
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
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

      {/* Floating Cart Button – Guest shop only */}
      {showFloatingCart && typeof onOpenCart === "function" && (
        <button
          onClick={onOpenCart}
          className="
            fixed bottom-6 right-6
            w-14 h-14 rounded-full
            bg-[#FF8D28] hover:bg-[#e67d1f]
            text-white shadow-lg
            flex items-center justify-center
            z-50
          "
          title="View cart"
        >
          <ShoppingCart size={22} />

          {cartCount > 0 && (
            <span
              className="
                absolute -top-2 -right-2
                min-w-[24px] h-6
                px-2
                rounded-full
                bg-black text-white
                text-xs font-bold
                flex items-center justify-center
              "
            >
              {cartCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default ShopListing;
