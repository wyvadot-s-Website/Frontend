import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isTokenExpired, setupTokenExpirationCheck } from "../utils/TokenUtils";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Set up automatic token expiration checking
    const cleanup = setupTokenExpirationCheck(() => {
      // This runs when token expires
      navigate("/", { replace: true });
    }, "token");

    // Listen for storage events (logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      cleanup();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  // Initial check
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
