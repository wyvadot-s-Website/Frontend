import BASE_URL from "../utils/api";

// GET FOOTER (PUBLIC)
export const fetchFooter = async () => {
  const res = await fetch(`${BASE_URL}/api/footer`);
  return res.json();
};
