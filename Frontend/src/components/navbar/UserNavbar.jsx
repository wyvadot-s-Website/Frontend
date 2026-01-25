import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Search, Bell, LogOut, User } from "lucide-react";
import logo from "../../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png";
import UserNotificationsPopover from "@/components/UserNotificationsPopover";
import { fetchUserNotifications } from "@/services/notificationService";
import { useWishlist } from "@/context/WishlistContext";
import { getCurrentUser } from "@/services/userService";

function UserNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const [openProfile, setOpenProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileRef = useRef(null);

  const [navSearch, setNavSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const { count: wishlistCount } = useWishlist();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("token"));

    window.addEventListener("wyvadot_auth_updated", sync);
    window.addEventListener("storage", (e) => {
      if (e.key === "token") sync();
    });

    return () => {
      window.removeEventListener("wyvadot_auth_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;

    let alive = true;

    const pull = async () => {
      try {
        const data = await fetchUserNotifications(token, 1, 1);
        if (!alive) return;
        setUnreadCount(Number(data.unread || 0));
      } catch {}
    };

    pull();
    const id = setInterval(pull, 25000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let alive = true;

    (async () => {
      try {
        const data = await getCurrentUser(token);
        if (!alive) return;
        setUser(data?.user || null);
      } catch {
        // token invalid
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("wyvadot_auth_updated"));
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  const initials = useMemo(() => {
    const first = (user?.firstName || "").trim();
    const last = (user?.lastName || "").trim();
    const a = first ? first[0] : "";
    const b = last ? last[0] : "";
    const val = (a + b).toUpperCase();
    return val || "U";
  }, [user]);

  const displayName = useMemo(() => {
    const first = (user?.firstName || "").trim();
    const last = (user?.lastName || "").trim();
    const full = `${first} ${last}`.trim();
    return full || "User";
  }, [user]);

  useEffect(() => {
    const compute = () => {
      try {
        const saved = localStorage.getItem("wyvadot_cart");
        const parsed = saved ? JSON.parse(saved) : [];
        const count = Array.isArray(parsed)
          ? parsed.reduce((sum, i) => sum + Number(i?.quantity || 0), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    compute();

    const onUpdated = () => compute();
    window.addEventListener("wyvadot_cart_updated", onUpdated);

    const onStorage = (e) => {
      if (e.key === "wyvadot_cart") compute();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("wyvadot_cart_updated", onUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpenProfile(false);
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <>
      <nav className="bg-transparent sticky top-0 z-50 pt-5">
        <div className="max-w-6xl mx-auto px-6 py-2 shadow-lg lg:rounded-full bg-white">
          <div className="flex justify-between items-center h-11">
            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="Wyvadot PR Logo" className="h-12" />
            </Link>

            {/* Navigation */}
            <div className="hidden lg:flex gap-6 items-center">
              <Link
                to="/home"
                className={`font-medium transition-colors ${
                  isActive("/home")
                    ? "bg-[#FF8D28] text-black px-5 py-2 rounded-full"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Home
              </Link>

              <Link
                to="/shop"
                className={`font-medium transition-colors ${
                  isActive("/shop")
                    ? "bg-[#FF8D28] text-black px-5 py-2 rounded-full"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Shop
              </Link>
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = navSearch.trim();
                      navigate(
                        q ? `/shop?search=${encodeURIComponent(q)}` : "/shop",
                      );
                    }
                  }}
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm w-56"
                />
                <Search
                  onClick={() => {
                    const q = navSearch.trim();
                    navigate(
                      q ? `/shop?search=${encodeURIComponent(q)}` : "/shop",
                    );
                  }}
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                />
              </div>

              {/* Wishlist */}
              <button
                onClick={() => navigate("/wishlist")}
                className="relative text-gray-600 hover:text-orange-500"
                title="Wishlist"
              >
                <Heart size={20} />

                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative text-gray-600 hover:text-orange-500"
                title="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Notification */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((p) => !p)}
                  className="relative text-gray-600 hover:text-orange-500"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                <UserNotificationsPopover
                  open={notifOpen}
                  onClose={() => setNotifOpen(false)}
                  token={token}
                  onUnreadChange={(n) => setUnreadCount(Number(n || 0))}
                />
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setOpenProfile((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold"
                >
                  {initials}
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border z-50">
                    <div className="flex items-center gap-3 p-4 border-b">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{displayName}</p>
                        <p className="text-xs text-gray-500">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          setOpenProfile(false);
                          navigate("/account");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        View account
                      </button>

                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Confirm logout</h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              >
                No
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserNavbar;
