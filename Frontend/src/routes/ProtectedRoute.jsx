<<<<<<< HEAD
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
=======
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
>>>>>>> b8a47e3376525587c83abb68aff0ce7e2b23cc86
    return <Navigate to="/" replace />;
  }

  return children;
}

<<<<<<< HEAD
export default ProtectedRoute;
=======
export default ProtectedRoute;
>>>>>>> b8a47e3376525587c83abb68aff0ce7e2b23cc86
