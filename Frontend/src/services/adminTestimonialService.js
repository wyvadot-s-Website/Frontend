import BASE_URL from "../utils/api";

/**
 * GET TESTIMONIALS (ADMIN)
 */
export const fetchTestimonialsAdmin = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/testimonial`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/**
 * ADD TESTIMONIAL
 */
export const addTestimonial = async (data, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/testimonial`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to add testimonial");
  }

  return result;
};

/**
 * UPDATE TESTIMONIAL
 */
export const updateTestimonial = async (id, data, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/testimonial/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update testimonial");
  }

  return result;
};

/**
 * DELETE TESTIMONIAL
 */
export const deleteTestimonial = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/testimonial/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to delete testimonial");
  }

  return result;
};
