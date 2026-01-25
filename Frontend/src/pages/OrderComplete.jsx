import React, { useMemo } from "react";
import { Check } from "lucide-react";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

function formatDate(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function OrderComplete({ order, onViewHistory }) {
  const items = useMemo(() => {
    const list = order?.items || [];
    return Array.isArray(list) ? list : [];
  }, [order]);

  const orderCode = order?.orderId || order?._id || "—";
  const orderDate = formatDate(order?.createdAt);
  const total = order?.totals?.total ?? order?.totals?.grandTotal ?? 0;

  const paymentMethod =
    order?.payment?.method === "bank_transfer"
      ? "Bank Transfer"
      : order?.payment?.method
      ? "Card"
      : "—";

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
              <span className="text-gray-500">Shopping cart</span>
            </div>

            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <Check size={16} />
              </div>
              <span className="text-gray-500">Checkout details</span>
            </div>

            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="font-semibold text-green-600">Order complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Card */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
          <p className="text-sm text-gray-500 mb-2">Complete!</p>

          <div className="mb-2">
            <p className="text-gray-700">Thank you 🎉</p>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            Your order has been received
          </h1>

          {/* Thumbnails */}
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            {items.slice(0, 3).map((it, idx) => {
              const img = it?.image || it?.images?.[0]?.url || "";
              const qty = Number(it?.quantity || 1);

              return (
                <div key={`${it?.productId || it?.name || idx}`} className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-50 border flex items-center justify-center overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={it?.name || "Item"}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-[10px] text-gray-400">No image</div>
                    )}
                  </div>

                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                    {qty}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Order details */}
          <div className="max-w-sm mx-auto text-sm text-gray-700 space-y-3 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-500">Order code:</span>
              <span className="font-medium">{orderCode}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium">{orderDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Total:</span>
              <span className="font-medium">{formatMoney(total)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment method:</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
          </div>

          <button
            onClick={onViewHistory}
            className="px-10 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderComplete;
