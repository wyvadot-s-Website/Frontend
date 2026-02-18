import React, { useEffect, useState } from "react";
import PublicNavbar from "./PublicNavbar";
import UserNavbar from "./UserNavbar";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // ✅ Listen for login/logout changes
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // ✅ This fires when token changes in SAME tab (logout, login)
    window.addEventListener("wyvadot_auth_updated", handleAuthChange);

    // ✅ This fires when token changes in ANOTHER tab
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("wyvadot_auth_updated", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return isLoggedIn ? <UserNavbar /> : <PublicNavbar />;
}

export default Navbar;