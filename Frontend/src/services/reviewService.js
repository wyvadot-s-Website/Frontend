import BASE_URL from "../utils/api";

export const fetchProductReviews = async (productId) => {
  const res = await fetch(`${BASE_URL}/api/products/${productId}/reviews`);
  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to load reviews");
  return result; // { success, items }
};

export const upsertProductReview = async (token, productId, payload) => {
  const res = await fetch(`${BASE_URL}/api/products/${productId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload), // { rating, comment }
  });
  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to submit review");
  return result; // { success, ratingAverage, ratingCount }
};

export const deleteMyProductReview = async (token, productId) => {
  const res = await fetch(`${BASE_URL}/api/products/${productId}/reviews/mine`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to delete review");
  return result;
};