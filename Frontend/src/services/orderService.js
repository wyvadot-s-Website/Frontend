import BASE_URL from "../utils/api";

export const createPublicOrder = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to create order");
  return result;
};

export const createUserOrder = async (payload, token) => {
  const res = await fetch(`${BASE_URL}/api/user/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to create order");
  return result;
};


export const initPaystack = async ({ orderId, paymentMethod }, token) => {
  const res = await fetch(`${BASE_URL}/api/paystack/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, paymentMethod }),
  });

  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Paystack init failed");
  return result;
};


export const initPaystackGuest = async ({ orderId, paymentMethod, email }) => {
  const res = await fetch(`${BASE_URL}/api/paystack/initialize/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, paymentMethod, email }),
  });

  const result = await res.json();
  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Paystack init failed");
  }
  return result;
};

// ✅ verify is PUBLIC now (no token)
export const verifyPaystack = async ({ reference, orderId }) => {
  const qs = new URLSearchParams({ reference, orderId }).toString();
  const res = await fetch(`${BASE_URL}/api/paystack/verify?${qs}`);
  const result = await res.json();
  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Paystack verify failed");
  }
  return result;
};

export const fetchPaidOrderForReceipt = async ({ orderId, email }) => {
  const qs = new URLSearchParams({ orderId, email }).toString();
  const res = await fetch(`${BASE_URL}/api/orders/track?${qs}`);
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load order receipt");
  }

  return result;
};
