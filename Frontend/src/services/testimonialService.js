import BASE_URL from "../utils/api";

/**
 * GET TESTIMONIALS (PUBLIC)
 */
export const fetchTestimonials = async () => {
  const res = await fetch(`${BASE_URL}/api/testimonials`);
  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to load testimonials");
  }

  return result.data;
};
