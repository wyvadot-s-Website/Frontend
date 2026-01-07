import BASE_URL from "../utils/api";

/**
 * GET TEAM MEMBERS (ADMIN)
 */
export const fetchTeamAdmin = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/team`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/**
 * ADD TEAM MEMBER
 * name, position, bio, image
 */
export const addTeamMember = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/team`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to add team member");
  }

  return result;
};

/**
 * UPDATE TEAM MEMBER
 * edit name / position / bio / image
 */
export const updateTeamMember = async (id, formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/team/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update team member");
  }

  return result;
};

/**
 * DELETE TEAM MEMBER
 */
export const deleteTeamMember = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/team/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to delete team member");
  }

  return result;
};
