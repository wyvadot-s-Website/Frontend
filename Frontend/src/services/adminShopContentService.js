import BASE_URL from "../utils/api";

export const fetchShopContentAdmin = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop-content`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load shop content");
  }

  return result.data;
};

export const updateShopPage = async (data, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop-content/page`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update shop page");
  }

  return result.data;
};

export const uploadShopHeroImages = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop-content/hero/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to upload hero images");
  }

  return result.data;
};

export const deleteShopHeroImage = async (publicId, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/shop-content/hero/images/${publicId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to delete hero image");
  }

  return result.data;
};
