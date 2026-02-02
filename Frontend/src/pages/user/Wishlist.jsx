import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { fetchWishlist, removeWishlistItem } from "@/services/wishlistService";
import { useWishlist } from "@/context/WishlistContext";

const formatNaira = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

function safeParseJSON(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export default function Wishlist() {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { remove: removeFromCtx, refresh } = useWishlist();

  const loadWishlist = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await fetchWishlist(token);
      setItems(Array.isArray(result?.items) ? result.items : []);
    } catch (err) {
      toast.error(err.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
    await refresh();
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRemove = async (productId) => {
    if (!token) return;
    try {
      await removeFromCtx(productId);
      setItems((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err.message || "Remove failed");
    }
  };

  // ✅ This makes Add to cart work (same storage + event your app already uses)
  const addToCart = (product) => {
    if (!product?._id) return;

    const stockQty = Number(product?.stockQuantity || 0);
    const isOut =
      product?.status === "out_of_stock" ||
      product?.status === "archived" ||
      stockQty <= 0;

    if (isOut) return toast.error("This product is out of stock");

    const imageUrl = product?.images?.[0]?.url || product?.image || "";

    const cart = safeParseJSON(
      localStorage.getItem("wyvadot_cart") || "[]",
      [],
    );
    const list = Array.isArray(cart) ? cart : [];

    const idx = list.findIndex(
      (c) => String(c?.productId || c?._id) === String(product._id),
    );

    if (idx >= 0) {
      const currentQty = Number(list[idx]?.quantity || 1);
      const nextQty = currentQty + 1;

      if (stockQty && nextQty > stockQty) {
        return toast.error(`Only ${stockQty} left in stock`);
      }

      list[idx] = { ...list[idx], quantity: nextQty };
    } else {
      list.push({
        productId: product._id,
        name: product.name,
        price: Number(product.price || 0),
        image: imageUrl,
        quantity: 1,
        category: product.category || "Uncategorized",
      });
    }

    localStorage.setItem("wyvadot_cart", JSON.stringify(list));
    window.dispatchEvent(new Event("wyvadot_cart_updated"));
    toast.success("Added to cart");
  };

  const rows = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl border">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="grid grid-cols-12 text-sm text-gray-500 font-medium">
            <div className="col-span-7">Product</div>
            <div className="col-span-2 text-left">Price</div>
            <div className="col-span-3 text-right">Action</div>
          </div>
        </div>

        {/* Body */}
<div className="divide-y">
  {loading ? (
    <div className="px-4 sm:px-6 py-10 text-sm text-gray-500">Loading...</div>
  ) : rows.length === 0 ? (
    <div className="px-4 sm:px-6 py-10 text-sm text-gray-500">
      No items in your wishlist yet.
    </div>
  ) : (
    rows.map((p) => {
      const img = p?.images?.[0]?.url || "";
      const stockQty = Number(p?.stockQuantity || 0);
      const isOut =
        p?.status === "out_of_stock" ||
        p?.status === "archived" ||
        stockQty <= 0;

      return (
        <div key={p._id} className="px-4 sm:px-6 py-4 sm:py-5">
          {/* Desktop Layout */}
          <div className="hidden sm:grid grid-cols-12 items-center gap-4">
            {/* Product (X + Image + Name) */}
            <div className="col-span-7 flex items-center gap-4">
              <button
                onClick={() => handleRemove(p._id)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100"
                title="Remove"
              >
                <X size={16} />
              </button>
              <div className="w-14 h-14 bg-gray-50 border rounded flex items-center justify-center overflow-hidden">
                {img ? (
                  <img
                    src={img}
                    alt={p?.name || "Product"}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-[10px] text-gray-400">No image</div>
                )}
              </div>
              <div className="font-medium text-gray-900">{p?.name || "—"}</div>
            </div>
            {/* Price */}
            <div className="col-span-2 text-sm text-gray-900">
              {formatNaira(p?.price)}
            </div>
            {/* Action */}
            <div className="col-span-3 flex justify-end">
              <button
                onClick={() => addToCart(p)}
                disabled={isOut}
                className={`px-6 py-2 rounded-lg text-sm font-medium ${
                  isOut
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Add to cart
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex items-start gap-3 sm:hidden">
            {/* Image */}
            <div className="w-16 h-16 flex-shrink-0 bg-gray-50 border rounded flex items-center justify-center overflow-hidden">
              {img ? (
                <img
                  src={img}
                  alt={p?.name || "Product"}
                  className="w-full h-full object-contain p-1.5"
                />
              ) : (
                <div className="text-[10px] text-gray-400">No image</div>
              )}
            </div>

            {/* Info + Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {p?.name || "—"}
                </p>
                <button
                  onClick={() => handleRemove(p._id)}
                  className="w-6 h-6 flex-shrink-0 rounded-full border flex items-center justify-center text-gray-400 hover:bg-gray-100"
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </div>
              <p className="text-sm text-gray-900 mt-1">
                {formatNaira(p?.price)}
              </p>
              <button
                onClick={() => addToCart(p)}
                disabled={isOut}
                className={`mt-2.5 w-full px-4 py-1.5 rounded-lg text-xs font-medium ${
                  isOut
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
      </div>
    </div>
  );
}
