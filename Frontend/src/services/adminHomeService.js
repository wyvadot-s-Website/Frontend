import BASE_URL from "../utils/api";

export const fetchHomeContent = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/home`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const updateHero = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/home/hero`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Hero update failed");
  }

  return data;
};


export const updateStats = async (stats, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/home/stats`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ stats }),
  });
  return res.json();
};

export const addWhyChoose = async (data, token) => {
  const res = await fetch(`${BASE_URL}/api/admin/home/why-choose-us`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteWhyChoose = async (id, token) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/home/why-choose-us/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
};
