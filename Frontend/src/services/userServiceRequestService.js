import BASE_URL from "../utils/api";

/**
 * USER: GET MY SERVICE REQUESTS
 * GET /api/service-requests/mine
 */
export const fetchMyServiceRequests = async (token) => {
  const res = await fetch(`${BASE_URL}/api/service-requests/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load your service requests");
  }

  return result;
};

/**
 * USER: GET ONE OF MY REQUESTS (DETAIL)
 * GET /api/service-requests/:id
 */
export const fetchMyServiceRequestById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/service-requests/${id}`, {
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
