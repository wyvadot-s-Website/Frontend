import BASE_URL from "../utils/api";

// ===============================
// USER AUTH SERVICES
// ===============================

// SIGN UP USER
export const signupUser = async (formData) => {
  const res = await fetch(`${BASE_URL}/users/signup`, {  // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }
  return data;
};

// VERIFY EMAIL (SIGNUP)
export const verifyUserEmail = async ({ email, code }) => {
  const res = await fetch(`${BASE_URL}/users/verify-email`, {  // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Verification failed");
  }
  return data;
};

// LOGIN USER
export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/users/login`, {  // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

// GOOGLE AUTH
export const googleAuthUser = async (idToken) => {
  const res = await fetch(`${BASE_URL}/users/google`, {  // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Google authentication failed");
  }
  return data;
};

// ===============================
// PASSWORD RESET SERVICES
// ===============================

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/users/forgot-password`, {  // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Password reset request failed");
  }
  return data;
};

// VERIFY RESET CODE
export const verifyResetCode = async ({ email, code }) => {
  const res = await fetch(`${BASE_URL}/users/verify-reset-code`, {  // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Reset code verification failed");
  }
  return data;
};

// RESET PASSWORD
export const resetPassword = async ({ email, code, newPassword }) => {
  const res = await fetch(`${BASE_URL}/users/reset-password`, {  // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Password reset failed");
  }
  return data;
};

// ===============================
// AUTH SESSION
// ===============================

// GET CURRENT USER (TOKEN VALIDATION)
export const getCurrentUser = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {  // ✅ FIXED
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Authentication failed");
  }
  return data;
};