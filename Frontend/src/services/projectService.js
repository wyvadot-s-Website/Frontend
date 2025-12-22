import BASE_URL from "../utils/api.js";

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/api/projects`);

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
};
