import BASE_URL from "../utils/api";

/**
 * GET PROJECTS (ADMIN)
 */
export const fetchProjectsAdmin = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/**
 * ADD PROJECT
 * title, description, image
 */
export const addProject = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to add project");
  }

  return result;
};

/**
 * UPDATE PROJECT
 */
export const updateProject = async (id, formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/projects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to update project");
  }

  return result;
};

/**
 * DELETE PROJECT
 */
export const deleteProject = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Failed to delete project");
  }

  return result;
};
