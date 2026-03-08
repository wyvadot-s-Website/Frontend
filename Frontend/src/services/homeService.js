import BASE_URL from "../utils/api";

const cache = {};
export const fetchHomeContent = async () => {
  if (cache.home) return cache.home;
  const res = await fetch(`${BASE_URL}/api/home`);
  if (!res.ok) throw new Error("Failed to load home content");
  const data = await res.json();
  cache.home = data;
  return data;
};