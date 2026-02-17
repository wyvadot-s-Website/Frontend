import BASE_URL from "../utils/api";

// GET USERS (all admins)
export const fetchAdminUsers = async (token, { page = 1, limit = 20, search = "" } = {}) => {
  const query = new URLSearchParams({ page, limit, search }).toString();

  const res = await fetch(`${BASE_URL}/api/admin/user-management/users?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch users");
  return data;
};

// GET ADMINS (super_admin only)
export const fetchAdminAdmins = async (token, { page = 1, limit = 20, search = "" } = {}) => {
  const query = new URLSearchParams({ page, limit, search }).toString();

  const res = await fetch(`${BASE_URL}/api/admin/user-management/admins?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch admins");
  return data;
};

// DELETE ADMIN (super_admin only)
export const deleteAdminAccount = async (token, adminId) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/user-management/admins/${adminId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete admin");
  return data;
};
