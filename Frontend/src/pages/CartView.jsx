// src/components/CartView.jsx (replace the whole file with this)
import React from "react";
import { Plus, Minus, Trash2, Check } from "lucide-react";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

function CartView({
  cart,
  updateQuantity,
  removeFromCart,
  subtotal,
  shipping,
  total,
  onProceedToCheckout,
}) {
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
              <span className="font-semibold text-sm">Shopping Cart</span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">
                2
              </div>
              <span className="text-gray-500 text-sm">Checkout Detail</span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">
                3
              </div>
              <span className="text-gray-500 text-sm">Order Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg p-10 text-center text-gray-600">
                <img src="../../../public/Frame 2147224274.png" alt="Your cart is empty" className='flex place-self-center p-5' />
              </div>
            ) : (
              cart.map((item) => {
                // ✅ Use a stable id for cart operations (supports normalized cart items)
                const id = item?._id || item?.id || item?.__cartId;

                // ✅ Prefer normalized image field, fallback to images array
                const img =
                  item?.image || item?.images?.[0]?.url || item?.images?.[0]?.secure_url;

                const stockQty = Number(item?.stockQuantity ?? 0);
                const isOut =
                  item?.status === "out_of_stock" ||
                  item?.status === "archived" ||
                  stockQty <= 0;

                return (
                  <div key={id} className="bg-white rounded-lg p-6 flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                      {img ? (
                        <img
                          src={img}
                          alt={item?.name || "Product"}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No image</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item?.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item?.category || "Uncategorized"}
                      </p>

                      {/* Optional stock line */}
                      {stockQty ? (
                        <p className="text-xs text-gray-500 mb-2">
                          Stock: <span className="font-semibold">{stockQty}</span>
                        </p>
                      ) : null}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(id, Number(item.quantity || 1) - 1)}
                          className="p-1 border rounded"
                          disabled={Number(item.quantity || 1) <= 1}
                          title="Decrease"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-3">{item.quantity}</span>

                        <button
                          onClick={() => updateQuantity(id, Number(item.quantity || 1) + 1)}
                          className="p-1 border rounded"
                          disabled={!!stockQty && Number(item.quantity || 1) >= stockQty}
                          title="Increase"
                        >
                          <Plus size={14} />
                        </button>

                        {isOut ? (
                          <span className="ml-2 text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">
                            Out of stock
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold mb-2">
                        {formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}
                      </p>

                      <button
                        onClick={() => removeFromCart(id)}
                        className="text-red-500 text-sm"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="font-bold text-xl mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatMoney(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">{formatMoney(shipping)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{formatMoney(total)}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded font-semibold transition-colors ${
                cart.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartView;
