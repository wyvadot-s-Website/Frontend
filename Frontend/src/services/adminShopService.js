// src/services/adminShopService.js
import BASE_URL from "../utils/api";

/**
 * ADMIN: GET ALL PRODUCTS (shop management)
 * optional params: status, category, search, page, limit, sort
 */
export const fetchAdminProducts = async (token, params = {}) => {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, v);
  });

  const res = await fetch(`${BASE_URL}/api/admin/shop/products?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load admin products");
  }

  return result;
};

/**
 * ADMIN: CREATE PRODUCT (multipart/form-data)
 * formData must include:
 * name, description, price, oldPrice?, saleEndsAt?, category, stockQuantity, status?
 * and images[] as "images"
 */
export const createAdminProduct = async (token, formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type manually for FormData
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to create product");
  }

  return result;
};

/**
 * ADMIN: UPDATE PRODUCT (JSON)
 */
export const updateAdminProduct = async (id, updates, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update product");
  }

  return result;
};

/**
 * ADMIN: UPDATE PRODUCT STATUS
 */
export const updateAdminProductStatus = async (id, status, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop/products/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update product status");
  }

  return result;
};

/**
 * ADMIN: ARCHIVE PRODUCT (soft delete)
 */
export const archiveAdminProduct = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to archive product");
  }

  return result;
};

/**
 * ADMIN: GET ALL ORDERS (shop management)
 * optional params: search, status, page, limit
 */
export const fetchAdminOrders = async (token, params = {}) => {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, v);
  });

  const res = await fetch(`${BASE_URL}/api/admin/shop/orders?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load admin orders");
  }

  return result;
};

/**
 * ADMIN: GET ORDER BY ID
 */
export const fetchAdminOrderById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load order");
  }
  return result;
};

/**
 * ADMIN: UPDATE ORDER (status + note)
 * PATCH /api/admin/shop/orders/:id
 * payload: { status: "processing"|"shipped"|"delivered", note: "..." }
 */
export const updateAdminOrder = async (id, payload, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update order");
  }

  return result;
};
