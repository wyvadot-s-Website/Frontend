import BASE_URL from "../utils/api";

export const fetchAdminNotifications = async (token, page = 1, limit = 20) => {
  const res = await fetch(
    `${BASE_URL}/api/notifications/admin?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load notifications");
  return data;
};

export const markAdminNotificationsRead = async (token, { ids = [], all = false }) => {
  const res = await fetch(`${BASE_URL}/api/notifications/admin/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids, all }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark as read");
  return data;
};


export const fetchUserNotifications = async (token, page = 1, limit = 20) => {
  const res = await fetch(
    `${BASE_URL}/api/notifications/user?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load notifications");
  return data;
};

export const markUserNotificationsRead = async (token, { ids = [], all = false }) => {
  const res = await fetch(`${BASE_URL}/api/notifications/user/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids, all }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark as read");
  return data;
};