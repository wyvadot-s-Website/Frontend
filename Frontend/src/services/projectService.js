import BASE_URL from "../utils/api";

/**
 * GET PROJECTS (PUBLIC)
 */
export const fetchProjectsPublic = async () => {
  const res = await fetch(`${BASE_URL}/api/projects`);
  return res.json();
};
