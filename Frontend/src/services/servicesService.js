import BASE_URL from "../utils/api";

export const fetchServicesContent = async () => {
  const res = await fetch(`${BASE_URL}/api/services`);
  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to load Services content");
  }

  return data.data;
};
