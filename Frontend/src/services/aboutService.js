import BASE_URL from "../utils/api";

/**
 * GET ABOUT CONTENT (PUBLIC)
 */
export const fetchAboutContent = async () => {
  const res = await fetch(`${BASE_URL}/api/about`);
  return res.json();
};
