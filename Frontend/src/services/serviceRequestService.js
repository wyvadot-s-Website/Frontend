// src/services/serviceRequestService.js
import BASE_URL from "../utils/api";

/**
 * USER: SUBMIT SERVICE REQUEST (PMR for now)
 * serviceName + formData fields (JSON)
 */
export const submitServiceRequest = async (payload, token) => {
  const res = await fetch(`${BASE_URL}/api/service-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to submit service request");
  }

  return result;
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

  const result = await res.json();
  if (!res.ok || result.success === false) throw new Error(result.message || "Failed to accept service request");
  return result;
};

/**
 * ADMIN: UPDATE REQUEST
 * Can update: status, stage, assignedAdmin, adminNotes
 */
export const updateServiceRequestAdmin = async (id, updates, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/service-requests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update service request");
  }

  return result;
};
