import BASE_URL from "../utils/api";

export const fetchWishlist = async (token) => {
  const res = await fetch(`${BASE_URL}/api/user/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to load wishlist");
  return result;
};

export const toggleWishlist = async (token, productId) => {
  const res = await fetch(`${BASE_URL}/api/user/wishlist/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to update wishlist");
  return result; // { success, wished }
};

export const removeWishlistItem = async (token, productId) => {
  const res = await fetch(`${BASE_URL}/api/user/wishlist/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to remove item");
  return result;
};
