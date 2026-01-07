import BASE_URL from "../utils/api";

export const fetchHomeContent = async () => {
  const res = await fetch(`${BASE_URL}/api/home`);
  if (!res.ok) throw new Error("Failed to load home content");
  return res.json();
};
