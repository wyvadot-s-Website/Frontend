import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import OrderComplete from "./OrderComplete";
import { fetchPaidOrderForReceipt } from "../services/orderService";

export default function OrderCompletePage() {
  const [params] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const orderId = params.get("orderId");
        const email = params.get("email");

        if (!orderId || !email) {
          throw new Error("Missing orderId or email");
        }

        const res = await fetchPaidOrderForReceipt({ orderId, email });
        const fetched = res.data || res;

        if (fetched?.payment?.status !== "paid") {
          throw new Error("Payment not confirmed for this order");
        }

        setOrder(fetched);
      } catch (err) {
        toast.error(err.message || "Failed to load receipt");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white border rounded-lg p-8 text-center w-full max-w-md">
          <p className="font-semibold mb-2">Loading receipt...</p>
          <p className="text-sm text-gray-600">Please wait.</p>
          <div className="mt-4 text-sm text-gray-500">Loading…</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white border rounded-lg p-8 text-center w-full max-w-md">
          <p className="font-semibold mb-2">Receipt not available</p>
          <p className="text-sm text-gray-600">
            We couldn’t load your paid order receipt.
          </p>
          <button
            className="mt-5 px-6 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-800"
            onClick={() => (window.location.href = "/shop")}
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <OrderComplete
      order={order}
      onViewHistory={() => (window.location.href = "/shop")}
    />
  );
}
