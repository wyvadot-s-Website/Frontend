import BASE_URL from "../utils/api";

export const fetchProducts = async (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, v);
  });

  const res = await fetch(`${BASE_URL}/api/products?${qs.toString()}`);
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load products");
  }

  return result; // { success, items, page, ... }
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  const result = await res.json();

  if (!res.ok || result?.success === false) {
    throw new Error(result.message || "Failed to load product");
  }

  // ✅ return the product itself
  return result.item;
};