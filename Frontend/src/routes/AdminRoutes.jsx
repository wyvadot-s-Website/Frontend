import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAdminToken } from "../utils/adminAuth";
import { isTokenExpired, setupTokenExpirationCheck } from "../utils/TokenUtils";

const AdminRoutes = ({ children }) => {
  const navigate = useNavigate();
  const token = getAdminToken();

  useEffect(() => {
    // Set up automatic token expiration checking
    const cleanup = setupTokenExpirationCheck(() => {
      // This runs when admin token expires
      navigate("/theboss", { replace: true });
    }, "adminToken"); // Make sure this matches your localStorage key

    // Listen for storage events (logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "adminToken" && !e.newValue) {
        navigate("/theboss", { replace: true });
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
    localStorage.removeItem("adminToken"); // Make sure this matches your localStorage key
    return <Navigate to="/theboss" replace />;
  }

  return children;
};

export default AdminRoutes;
