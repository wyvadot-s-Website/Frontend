import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPaystack } from "../services/orderService";
import { toast } from "sonner";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const reference = params.get("reference"); // Paystack sends this
        const orderId = params.get("orderId"); // we include this in callback_url
        if (!reference) throw new Error("Missing payment reference");

        const res = await verifyPaystack({ reference, orderId: orderId || "" });
        const paid = !!res.paid;
        const order = res.order;

        if (!paid) {
          toast.error("Payment not successful");
          return navigate("/cart");
        }
        
        const paidOrderId = order?.orderId;
        const email = order?.customer?.email;

        if (!paidOrderId || !email) {
          throw new Error("Missing orderId or email for receipt");
        }

        // Clear cart ONLY AFTER payment is confirmed
        localStorage.removeItem("wyvadot_cart");
        window.dispatchEvent(new Event("wyvadot_cart_updated"));


        toast.success("Payment successful");
        navigate(
          `/order-complete?orderId=${encodeURIComponent(paidOrderId)}&email=${encodeURIComponent(email)}`,
        );
      } catch (err) {
        toast.error(err.message || "Payment verification failed");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white border rounded-lg p-8 text-center w-full max-w-md">
        <p className="font-semibold mb-2">Verifying payment...</p>
        <p className="text-sm text-gray-600">
          Please wait. Do not close this page.
        </p>
        {loading ? (
          <div className="mt-4 text-sm text-gray-500">Loading…</div>
        ) : null}
      </div>
    </div>
  );
}
