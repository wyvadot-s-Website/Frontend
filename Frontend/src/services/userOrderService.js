import BASE_URL from "../utils/api";

export const fetchMyOrders = async (token, params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, v);
  });

  const res = await fetch(`${BASE_URL}/api/user/orders?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load orders");
  }

  return result;
};

export const fetchMyOrderById = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/user/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load order");
  }
  return result;
};
