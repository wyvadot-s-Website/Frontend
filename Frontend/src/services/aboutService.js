import BASE_URL from "../utils/api";

const cache = {};
export const fetchAboutContent = async () => {
  if (cache.about) return cache.about;
  const res = await fetch(`${BASE_URL}/api/about`);
  const data = await res.json();
  cache.about = data;
  return data;
};