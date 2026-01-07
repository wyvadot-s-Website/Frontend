import BASE_URL from "../utils/api";

/**
 * GET TEAM MEMBERS (PUBLIC)
 */
export const fetchTeam = async () => {
  const res = await fetch(`${BASE_URL}/api/team`);
  return res.json();
};
