// src/services/serviceRequestService.js
import BASE_URL from "../utils/api";

/**
 * USER: SUBMIT SERVICE REQUEST (PMR for now)
 * serviceName + formData fields (JSON)
 */
export const submitServiceRequest = async (payload, token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/service-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Get response text first to handle empty responses
    const text = await res.text();
    
    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      // If parsing fails, create error object
      result = { message: text || "Server returned invalid response" };
    }

    if (!res.ok) {
      throw new Error(result.message || `Server error: ${res.status}`);
    }

    return result;
  } catch (error) {
    console.error("Submit service request error:", error);
    throw error;
  }
};

/**
 * ADMIN: GET ALL SERVICE REQUESTS
 */
export const fetchServiceRequestsAdmin = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/service-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load service requests");
  }

  return result;
};

/**
 * ADMIN: GET ONE SERVICE REQUEST (DETAIL)
 */
export const fetchServiceRequestByIdAdmin = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/service-requests/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load service request");
  }

  return result;
};

/**
 * ADMIN: ACCEPT REQUEST (convenience route)
 */
export const acceptServiceRequestAdmin = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/admin/service-requests/${id}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Try parse JSON safely
  let result = null;
  try {
    result = await res.json();
  } catch {
    result = null;
  }

  // If backend responded OK, we accept it as success
  if (!res.ok) {
    throw new Error(result?.message || "Failed to assign");
  }

  return result || { success: true };
};
/**
 * ADMIN: UPDATE REQUEST
 * Can update: status, stage, assignedAdmin, adminNotes
 */
// ADMIN: UPDATE REQUEST
export const updateServiceRequestAdmin = async (id, updates, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/service-requests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  // Safe JSON parse (prevents false "failed" when backend returns no JSON)
  let result = null;
  try {
    result = await res.json();
  } catch {
    result = null;
  }

  // Treat HTTP 2xx as success
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update service request");
  }

  return result || { success: true };
};
