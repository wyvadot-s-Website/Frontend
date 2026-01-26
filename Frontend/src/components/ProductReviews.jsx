import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchProductReviews, upsertProductReview } from "@/services/reviewService";

export default function ProductReviews({ productId, onStatsUpdated }) {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const load = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetchProductReviews(productId);
      setItems(Array.isArray(res.items) ? res.items : []);
    } catch (err) {
      toast.error(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to rate this product");
      return;
    }

    try {
      const stats = await upsertProductReview(token, productId, { rating, comment });
      toast.success("Review submitted");
      setComment("");
      await load();
      onStatsUpdated?.(stats); // update ProductDetail rating display
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    }
  };

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-xl font-bold mb-4">Ratings & Reviews</h3>

      {/* Form */}
      <div className="bg-gray-50 border rounded-lg p-5 mb-6">
        <div className="font-semibold mb-3">Write a review</div>

        {!token ? (
          <div className="text-sm text-gray-600">Login to rate and review this product.</div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border rounded px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded p-3 text-sm"
              placeholder="Write your review..."
              rows={4}
            />

            <button className="px-5 py-2 rounded bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800">
              Submit
            </button>
          </form>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading reviews...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">No reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <div key={r._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">
                  {r?.user?.firstName || "User"} {r?.user?.lastName || ""}
                </div>
                <div className="text-sm font-semibold">{Number(r.rating).toFixed(1)}</div>
              </div>
              <div className="text-sm text-gray-600 mt-2">{r.comment || "—"}</div>
              <div className="text-xs text-gray-400 mt-2">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}