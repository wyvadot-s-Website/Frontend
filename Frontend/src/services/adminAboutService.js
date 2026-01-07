import BASE_URL from "../utils/api";

/**
 * GET ABOUT CONTENT (ADMIN)
 */
export const fetchAboutAdmin = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/about`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/**
 * UPDATE ABOUT TEXT CONTENT
 */
export const updateAboutText = async (data, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/about/text`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update About text");
  }

  return result;
};

/**
 * UPDATE ABOUT HERO IMAGE
 */
export const updateAboutHeroImage = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/about/hero-image`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Hero image upload failed");
  }

  return result;
};

/**
 * ADD PROMISE IMAGE
 */
export const addPromiseImage = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/about/promise-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Promise image upload failed");
  }

  return result;
};

/**
 * DELETE PROMISE IMAGE
 */
export const deletePromiseImage = async (id, token) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/about/promise-image/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to delete promise image");
  }

  return result;
};
