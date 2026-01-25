import BASE_URL from "../utils/api";

export const adminSignup = async (data) => {
  const res = await fetch(`${BASE_URL}/api/admin/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Signup failed");
  return result;
};

export const adminVerifyOTP = async ({ email, code }) => {
  const res = await fetch(`${BASE_URL}/api/admin/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Verification failed");
  return result;
};

export const adminLogin = async (data) => {
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Login failed");
  return result;
};
