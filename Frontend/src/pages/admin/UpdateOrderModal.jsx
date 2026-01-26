// src/components/admin/UpdateOrderModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
];

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

const UpdateOrderModal = ({ open, onClose, onSubmit, loading, order }) => {
  const [status, setStatus] = useState("processing");
  const [note, setNote] = useState("");
  const [downloads, setDownloads] = useState([{ name: "", url: "" }]);

  const items = useMemo(() => (Array.isArray(order?.items) ? order.items : []), [order]);
  const updates = useMemo(() => (Array.isArray(order?.updates) ? order.updates : []), [order]);
  const existingDownloads = useMemo(
    () => (Array.isArray(order?.downloads) ? order.downloads : []),
    [order]
  );

  useEffect(() => {
    if (!open || !order) return;
    setStatus(order?.status || "processing");
    setNote("");
    setDownloads([{ name: "", url: "" }]);
  }, [open, order]);

  const handleClose = () => onClose?.();

  const addRow = () => setDownloads((d) => [...d, { name: "", url: "" }]);

  const updateRow = (idx, key, value) => {
    setDownloads((prev) => prev.map((d, i) => (i === idx ? { ...d, [key]: value } : d)));
  };

  const removeRow = (idx) => {
    setDownloads((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedDownloads = downloads
      .filter((d) => d.name?.trim() && d.url?.trim())
      .map((d) => ({ name: d.name.trim(), url: d.url.trim() }));

    await onSubmit?.({
      id: order?._id,
      status,
      note,
      downloads: cleanedDownloads, // ✅ uses your existing backend "downloads" append logic
      close: handleClose,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <p className="text-xs text-gray-500 mt-1">
            {order?.orderId || "—"} • {formatDate(order?.createdAt)}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* ✅ Summary (same style idea as user modal) */}
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Status:</span>
                <span className={`px-3 py-1 text-xs rounded-full ${statusPill(order?.status)}`}>
                  {statusLabel(order?.status)}
                </span>
              </div>

              <div>
                <span className="text-gray-500">Payment:</span>{" "}
                <span className="font-medium">{order?.payment?.status || "—"}</span>
              </div>

              <div>
                <span className="text-gray-500">Total:</span>{" "}
                <span className="font-semibold">{formatMoney(order?.totals?.total || 0)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mt-3">
              <div>
                <span className="text-gray-500">Customer:</span>{" "}
                {order?.customer?.fullName || "—"}
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> {order?.customer?.phone || "—"}
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Email:</span> {order?.customer?.email || "—"}
              </div>
            </div>
          </div>

          {/* ✅ Items with images (same as user modal) */}
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
                          <span className="text-[10px] text-gray-400">No image</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium">{it?.name || "—"}</p>
                        <p className="text-xs text-gray-500">{it?.category || "Uncategorized"}</p>
                        <div className="text-xs text-gray-600 mt-2">
                          Qty: {qty} • Price: {formatMoney(price)}
                        </div>
                      </div>

                      <div className="text-sm font-semibold">{formatMoney(price * qty)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ✅ Existing downloads (admin can see what user will see) */}
          <div className="border rounded-lg p-4">
            <p className="font-semibold mb-3">Downloads</p>

            {existingDownloads.length === 0 ? (
              <p className="text-sm text-gray-600">No downloads yet.</p>
            ) : (
              <div className="space-y-2">
                {existingDownloads.map((d, i) => (
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

          {/* ✅ Updates history (optional but you already have it) */}
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

          {/* ✅ Admin update form (same controller you already have) */}
          <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-6">
            <p className="font-semibold">Update This Order</p>

            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Update Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[110px]"
                placeholder="Describe what has been done"
              />
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm">Add Downloads</p>
                <button
                  type="button"
                  onClick={addRow}
                  className="text-sm underline hover:text-orange-600"
                >
                  + Add another
                </button>
              </div>

              <div className="space-y-3">
                {downloads.map((d, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <input
                      value={d.name}
                      onChange={(e) => updateRow(idx, "name", e.target.value)}
                      placeholder="File name (e.g. Design.pdf)"
                      className="sm:col-span-2 border rounded-md px-3 py-2 text-sm"
                    />
                    <input
                      value={d.url}
                      onChange={(e) => updateRow(idx, "url", e.target.value)}
                      placeholder="URL (Drive link, etc.)"
                      className="sm:col-span-3 border rounded-md px-3 py-2 text-sm"
                    />

                    {downloads.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="sm:col-span-5 text-xs text-red-600 underline justify-self-end"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-500 mt-3">
                Tip: Use public/shareable links so the user can download.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Close
              </Button>

              <Button
                type="submit"
                className="bg-[#FF8D28] hover:bg-[#e67d1f]"
                disabled={loading || !order?._id}
              >
                {loading ? "Saving..." : "Save Update"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
