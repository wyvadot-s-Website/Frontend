// src/services/shopService.js
// ✅ CORRECTLY FIXED: fetch() with template literals INSIDE parentheses

import BASE_URL from "../utils/api";

/**
 * Fetch products with optional filters and pagination
 * @param {Object} params - Filter parameters (category, search, minPrice, maxPrice, sort, inStock, page, limit)
 * @returns {Promise<Object>} - { success, items, page, totalPages, total, limit }
 */
export const fetchProducts = async (params = {}) => {
  const qs = new URLSearchParams();
  
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      qs.append(k, v);
    }
  });

  // ✅ CORRECT: fetch( `template literal` )
  //                   ↑ parenthesis first, then backtick
  const res = await fetch(`${BASE_URL}/api/products?${qs.toString()}`);
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load products");
  }

  return result; // { success, items, page, totalPages, total, limit }
};

/**
 * Fetch a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product object
 */
export const fetchProductById = async (id) => {
  // ✅ CORRECT: fetch( `template literal` )
  //                   ↑ parenthesis first, then backtick
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  const result = await res.json();

  if (!res.ok || result?.success === false) {
    throw new Error(result.message || "Failed to load product");
  }

  // ✅ Return the product itself
  return result.item;
};