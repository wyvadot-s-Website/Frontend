import BASE_URL from "../utils/api";

export const fetchAdminMe = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to load admin profile");
  }
  return data.admin;
};
