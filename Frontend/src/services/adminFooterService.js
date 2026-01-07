import BASE_URL from "../utils/api";

// GET FOOTER (ADMIN)
export const fetchFooterAdmin = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/footer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// CREATE / UPDATE FOOTER
export const saveFooter = async (data, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/footer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to save footer");
  }

  return result;
};
