import BASE_URL from "../utils/api";

export const fetchShopContent = async () => {
  const res = await fetch(`${BASE_URL}/api/shop-content`);
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load shop content");
  }

  return result.data;
};
