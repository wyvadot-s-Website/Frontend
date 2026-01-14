import React, { useEffect, useState } from "react";
import PublicNavbar from "./PublicNavbar";
import UserNavbar from "./UserNavbar";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Listen for login/logout changes
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return isLoggedIn ? <UserNavbar /> : <PublicNavbar />;
}

export default Navbar;
