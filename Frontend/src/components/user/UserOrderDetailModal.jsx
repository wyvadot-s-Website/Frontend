// src/components/user/UserOrderDetailModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchMyOrderById } from "@/services/userOrderService";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB");
};

const statusLabel = (s) => {
  if (s === "pending_payment") return "Pending Payment";
  if (s === "processing") return "Processing";
  if (s === "shipped") return "Shipped";
  if (s === "delivered") return "Delivered";
  return s || "—";
};

const statusPill = (s) => {
  if (s === "processing") return "bg-orange-100 text-orange-700";
  if (s === "shipped") return "bg-blue-100 text-blue-700";
  if (s === "delivered") return "bg-green-100 text-green-700";
  if (s === "pending_payment") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
};

export default function UserOrderDetailModal({ open, onClose, token, orderId }) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const items = useMemo(
    () => (Array.isArray(order?.items) ? order.items : []),
    [order],
  );
  const updates = useMemo(
    () => (Array.isArray(order?.updates) ? order.updates : []),
    [order],
  );
  const downloads = useMemo(
    () => (Array.isArray(order?.downloads) ? order.downloads : []),
    [order],
  );

  useEffect(() => {
    const run = async () => {
      if (!open) return;
      if (!token || !orderId) return;

      setLoading(true);
      try {
        const res = await fetchMyOrderById(token, orderId);
        setOrder(res?.data || null);
      } catch (err) {
        toast.error(err.message || "Failed to load order");
        setOrder(null);
        onClose?.();
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orderId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Order Details
          </DialogTitle>

          <p className="text-xs text-gray-600 mt-1">
            {order?.orderId || "—"} • {formatDate(order?.createdAt)}
          </p>
        </DialogHeader>

        {loading || !order ? (
          <div className="py-8 text-sm text-gray-600">
            {loading ? "Loading..." : "No data found."}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${statusPill(
                      order?.status,
                    )}`}
                  >
                    {statusLabel(order?.status)}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">Payment:</span>{" "}
                  <span className="font-medium">
                    {order?.payment?.status || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">Total:</span>{" "}
                  <span className="font-semibold">
                    {formatMoney(order?.totals?.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Items with images */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-3">Items</p>

              {items.length === 0 ? (
                <p className="text-sm text-gray-600">No items found.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((it, idx) => {
                    const img = it?.image || "";
                    const qty = Number(it?.quantity || 0);
                    const price = Number(it?.price || 0);

                    return (
                      <div
                        key={`${it?.productId || it?.name || idx}`}
                        className="flex gap-3 items-start border rounded-md p-3"
                      >
                        <div className="w-16 h-16 rounded-md border bg-gray-50 overflow-hidden flex items-center justify-center">
                          {img ? (
                            <img
                              src={img}
                              alt={it?.name || "Item"}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">
                              No image
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {it?.name || "—"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {it?.category || "Uncategorized"}
                          </p>

                          <div className="text-xs text-gray-600 mt-2">
                            Qty: {qty} • Price: {formatMoney(price)}
                          </div>
                        </div>

                        <div className="text-sm font-semibold">
                          {formatMoney(price * qty)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Downloads */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-3">Downloads</p>

              {downloads.length === 0 ? (
                <p className="text-sm text-gray-600">No downloads yet.</p>
              ) : (
                <div className="space-y-2">
                  {downloads.map((d, i) => (
                    <a
                      key={d?._id || i}
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm underline text-gray-900 hover:text-orange-600"
                    >
                      {d.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Admin updates timeline */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-3">Updates</p>

              {updates.length === 0 ? (
                <p className="text-sm text-gray-600">No updates yet.</p>
              ) : (
                <div className="space-y-3">
                  {updates.map((u, i) => (
                    <div key={u?._id || i} className="border rounded-md p-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Status: {statusLabel(u?.status)}</span>
                        <span>{formatDate(u?.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap">
                        {u?.note || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}