export const setAdminToken = (token) => {
  localStorage.setItem("admin_token", token);
};

export const getAdminToken = () => {
  return localStorage.getItem("admin_token");
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_token");
};
