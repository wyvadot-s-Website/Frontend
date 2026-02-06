// Token utility functions for both user and admin tokens

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Treat invalid tokens as expired
  }
};

/**
 * Get the user token and check if it's valid
 * @returns {string|null} - The token if valid, null otherwise
 */
export const getValidUserToken = () => {
  const token = localStorage.getItem("token");
  
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }
  
  return token;
};

/**
 * Get the admin token and check if it's valid
 * @returns {string|null} - The token if valid, null otherwise
 */
export const getValidAdminToken = () => {
  const token = localStorage.getItem("adminToken"); // Adjust based on your key
  
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("adminToken");
    return null;
  }
  
  return token;
};

/**
 * Get time remaining until token expires in milliseconds
 * @param {string} token - The JWT token
 * @returns {number} - Milliseconds until expiration, or 0 if expired/invalid
 */
const getTimeUntilExpiration = (token) => {
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const timeLeft = expirationTime - Date.now();
    
    return timeLeft > 0 ? timeLeft : 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Set up automatic token expiration checking with smart interval
 * @param {Function} onExpire - Callback function to run when token expires
 * @param {string} tokenKey - The localStorage key for the token
 * @returns {Function} - Cleanup function to stop checking
 */
export const setupTokenExpirationCheck = (onExpire, tokenKey = "token") => {
  const checkToken = () => {
    const token = localStorage.getItem(tokenKey);
    
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(tokenKey);
      if (onExpire) onExpire();
      return true; // Token expired
    }
    return false; // Token still valid
  };

  // Check immediately
  if (checkToken()) return () => {}; // Already expired, no need to set interval

  // Determine check interval based on time until expiration
  const token = localStorage.getItem(tokenKey);
  const timeLeft = getTimeUntilExpiration(token);
  
  let checkInterval;
  if (timeLeft < 5 * 60 * 1000) {
    // Less than 5 minutes left: check every 10 seconds
    checkInterval = 10000;
  } else if (timeLeft < 1 * 60 * 60 * 1000) {
    // Less than 1 hour left: check every minute
    checkInterval = 60000;
  } else {
    // More than 1 hour: check every 5 minutes
    checkInterval = 5 * 60000;
  }

  // Check periodically
  const interval = setInterval(checkToken, checkInterval);

  // Return cleanup function
  return () => clearInterval(interval);
};

/**
 * Logout user and clear token
 * @param {string} tokenKey - The localStorage key for the token
 */
export const logout = (tokenKey = "token") => {
  localStorage.removeItem(tokenKey);
  // You can add additional cleanup here (clear other data, etc.)
};

/**
 * Get token expiration info (useful for debugging)
 * @param {string} tokenKey - The localStorage key for the token
 * @returns {Object|null} - Token info or null
 */
export const getTokenInfo = (tokenKey = "token") => {
  const token = localStorage.getItem(tokenKey);
  
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const now = Date.now();
    const timeLeft = expirationTime - now;
    
    return {
      expiresAt: new Date(expirationTime),
      isExpired: timeLeft <= 0,
      timeLeftMs: Math.max(0, timeLeft),
      timeLeftMinutes: Math.floor(Math.max(0, timeLeft) / 1000 / 60),
      timeLeftHours: Math.floor(Math.max(0, timeLeft) / 1000 / 60 / 60),
      timeLeftDays: Math.floor(Math.max(0, timeLeft) / 1000 / 60 / 60 / 24),
      payload
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    return null;
  }
};