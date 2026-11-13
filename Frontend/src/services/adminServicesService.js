import BASE_URL from "../utils/api";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const request = async (url, options = {}, token) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders(token),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Services CMS request failed");
  }

  return data;
};

export const fetchServicesContentAdmin = (token) =>
  request(`${BASE_URL}/api/admin/services`, {}, token);

export const updateServicesPage = (pageData, token) =>
  request(`${BASE_URL}/api/admin/services/page`, {
    method: "PUT",
    body: JSON.stringify(pageData),
  }, token);

export const updateServices = (services, token) =>
  request(`${BASE_URL}/api/admin/services`, {
    method: "PUT",
    body: JSON.stringify({ services }),
  }, token);

export const uploadServicesHeroImages = (files, token) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("backgroundImages", file));
  return request(`${BASE_URL}/api/admin/services/hero-images`, {
    method: "PUT",
    body: formData,
  }, token);
};

export const uploadServiceImage = (serviceKey, file, token) => {
  const formData = new FormData();
  formData.append("image", file);
  return request(`${BASE_URL}/api/admin/services/${serviceKey}/image`, {
    method: "PUT",
    body: formData,
  }, token);
};

export const deleteServiceImage = (serviceKey, token) =>
  request(`${BASE_URL}/api/admin/services/${serviceKey}/image`, {
    method: "DELETE",
  }, token);

export const deleteService = (serviceKey, token) =>
  request(`${BASE_URL}/api/admin/services/${serviceKey}`, {
    method: "DELETE",
  }, token);
