// src/components/navbar/UserNavbar.js (or wherever your file lives)
import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Search, Bell, LogOut, User } from "lucide-react";
import logo from "../../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png";

import UserNotificationsPopover from "@/components/UserNotificationsPopover";
import { fetchUserNotifications } from "@/services/notificationService";
import { useWishlist } from "@/context/WishlistContext";
import { getCurrentUser } from "@/services/userService";

import { fetchProducts } from "@/services/shopService";
import { fetchMyOrders } from "@/services/userOrderService";
import { fetchMyServiceRequests } from "@/services/userServiceRequestService";

import UserOrderDetailModal from "@/components/user/UserOrderDetailModal";
import ServiceRequestDetailModal from "@/components/user/ServiceRequestDetailModal";

function UserNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const [openProfile, setOpenProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const profileRef = useRef(null);

  // ✅ Global search
  const [navSearch, setNavSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [searchData, setSearchData] = useState({
    products: [],
    orders: [],
    services: [],
  });
  const searchRef = useRef(null);

  // ✅ detail modals (open from navbar)
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);

  const [cartCount, setCartCount] = useState(0);
  const { count: wishlistCount } = useWishlist();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Notifications (separate desktop vs mobile so they don’t fight)
  const [desktopNotifOpen, setDesktopNotifOpen] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // keep token in sync
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

  // close desktop notification popover on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setDesktopNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // notifications unread badge polling
  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

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

  // load current user
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

  // cart count from localStorage
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

  // close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
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

  const safeLower = (v) => String(v || "").toLowerCase();

  // ✅ Debounced global search
  useEffect(() => {
    const q = navSearch.trim();

    // reset when empty
    if (!q) {
      setSearchErr("");
      setSearchLoading(false);
      setSearchData({ products: [], orders: [], services: [] });
      return;
    }

    setSearchOpen(true);

    const t = setTimeout(async () => {
      setSearchLoading(true);
      setSearchErr("");

      try {
        // 1) products (public)
        const prodRes = await fetchProducts({ search: q, limit: 5, page: 1 });
        const products = Array.isArray(prodRes?.items) ? prodRes.items : [];

        // 2) orders + services (requires token)
        let orders = [];
        let services = [];

        if (token) {
          try {
            const ordRes = await fetchMyOrders(token, {
              search: q,
              limit: 5,
              page: 1,
            });
            const ordItems =
              ordRes?.items || ordRes?.data?.items || ordRes?.data || ordRes;
            orders = Array.isArray(ordItems) ? ordItems.slice(0, 5) : [];
          } catch {
            orders = [];
          }

          try {
            const srvRes = await fetchMyServiceRequests(token);
            const srvItems = srvRes?.data || srvRes?.items || srvRes;
            const all = Array.isArray(srvItems) ? srvItems : [];

            // filter client-side because your service endpoint currently has no params
            const qq = safeLower(q);
            services = all
              .filter((r) => {
                const projectId = safeLower(r?.projectId);
                const title = safeLower(r?.title);
                const serviceName = safeLower(r?.serviceName);
                const stage = safeLower(r?.stage);
                return (
                  projectId.includes(qq) ||
                  title.includes(qq) ||
                  serviceName.includes(qq) ||
                  stage.includes(qq)
                );
              })
              .slice(0, 5);
          } catch {
            services = [];
          }
        }

        setSearchData({ products, orders, services });
      } catch (err) {
        setSearchErr(err?.message || "Search failed");
        setSearchData({ products: [], orders: [], services: [] });
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [navSearch, token]);

  // click handlers
  const openProductFromSearch = (product) => {
    const id = product?._id || product?.id;
    if (!id) return;

    setSearchOpen(false);
    setNavSearch("");

    navigate("/shop", { state: { openProductId: id } });
  };

  const openOrderFromSearch = (order) => {
    const id = order?._id || order?.id;
    if (!id) return;

    setSearchOpen(false);
    setNavSearch("");

    if (!token) {
      navigate("/home");
      return;
    }

    setActiveOrderId(id);
    setOrderModalOpen(true);
  };

  const openServiceFromSearch = (req) => {
    const id = req?._id || req?.id;
    if (!id) return;

    setSearchOpen(false);
    setNavSearch("");

    if (!token) {
      navigate("/home");
      return;
    }

    setActiveServiceId(id);
    setServiceModalOpen(true);
  };

  const onEnterFallback = () => {
    const q = navSearch.trim();
    if (!q) return navigate("/shop");

    setSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  // ✅ One handler: open desktop popover on lg+, open mobile sheet on small screens
  const openNotifications = () => {
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    if (isMobile) {
      setMobileNotifOpen(true);
    } else {
      setDesktopNotifOpen((p) => !p);
    }
  };

  return (
    <>
      <nav className="bg-transparent sticky top-0 z-50 pt-2 sm:pt-3 lg:pt-5 px-5">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 shadow-lg rounded-2xl lg:rounded-full bg-white">
          <div className="flex justify-between items-center h-12 sm:h-14 lg:h-11">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Wyvadot PR Logo"
                className="h-8 sm:h-10 lg:h-12"
              />
            </Link>

            {/* Navigation - Desktop */}
            <div className="hidden lg:flex gap-6 items-center">
              <Link
                to="/home"
                className={`font-medium transition-colors ${
                  isActive("/home")
                    ? "bg-white text-orange-500 px-5 py-2 rounded-full"
                    : "text-black hover:text-orange-500"
                }`}
              >
                Home
              </Link>

              <Link
                to="/shop"
                className={`font-medium transition-colors ${
                  isActive("/shop")
                    ? "bg-white text-black px-5 py-2 rounded-full"
                    : "text-black hover:text-orange-500"
                }`}
              >
                Shop
              </Link>
            </div>

            {/* Mobile Right Section */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile Cart Icon */}
              <button
                onClick={() => navigate("/cart")}
                className="relative text-white p-1"
              >
                <ShoppingCart size={22} color="black" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="black"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm w-56 xl:w-72"
                />

                <Search
                  onClick={() => onEnterFallback()}
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                />

                {/* Dropdown */}
                {searchOpen && navSearch.trim() && (
                  <div className="absolute left-0 mt-2 w-96 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="text-xs text-gray-500">
                        Searching for:{" "}
                        <span className="font-semibold text-gray-900">
                          {navSearch.trim()}
                        </span>
                      </p>
                    </div>

                    {searchLoading ? (
                      <div className="px-4 py-6 text-sm text-gray-600">
                        Loading results...
                      </div>
                    ) : searchErr ? (
                      <div className="px-4 py-6 text-sm text-red-600">
                        {searchErr}
                      </div>
                    ) : (
                      <div className="max-h-[360px] overflow-auto">
                        {/* Products */}
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Products
                          </p>

                          {searchData.products.length === 0 ? (
                            <p className="text-sm text-gray-500 py-2">
                              No products found.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {searchData.products.map((p) => (
                                <button
                                  key={p._id}
                                  onClick={() => openProductFromSearch(p)}
                                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-left"
                                >
                                  <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                                    {p?.images?.[0]?.url ? (
                                      <img
                                        src={p.images[0].url}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-1"
                                      />
                                    ) : (
                                      <span className="text-[10px] text-gray-400">
                                        No image
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {p.name || "—"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {p.category || "Uncategorized"}
                                    </p>
                                  </div>

                                  <span className="text-xs text-orange-600 font-semibold">
                                    Open
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t" />

                        {/* Orders */}
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            My Orders
                          </p>

                          {!token ? (
                            <p className="text-sm text-gray-500 py-2">
                              Login to search your orders.
                            </p>
                          ) : searchData.orders.length === 0 ? (
                            <p className="text-sm text-gray-500 py-2">
                              No matching orders.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {searchData.orders.map((o) => (
                                <button
                                  key={o._id}
                                  onClick={() => openOrderFromSearch(o)}
                                  className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-left"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {o.orderId || "Order"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Status: {o.status || "—"}
                                    </p>
                                  </div>

                                  <span className="text-xs text-orange-600 font-semibold">
                                    View
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t" />

                        {/* Services */}
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            My Services
                          </p>

                          {!token ? (
                            <p className="text-sm text-gray-500 py-2">
                              Login to search your service requests.
                            </p>
                          ) : searchData.services.length === 0 ? (
                            <p className="text-sm text-gray-500 py-2">
                              No matching services.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {searchData.services.map((r) => (
                                <button
                                  key={r._id}
                                  onClick={() => openServiceFromSearch(r)}
                                  className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 text-left"
                                >
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {r.title || r.serviceName || "Service"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {r.projectId || "—"} • {r.stage || "—"}
                                    </p>
                                  </div>

                                  <span className="text-xs text-orange-600 font-semibold">
                                    View
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="px-4 py-3 border-t flex justify-between items-center">
                      <button
                        onClick={() => {
                          setSearchOpen(false);
                          setNavSearch("");
                        }}
                        className="text-xs text-gray-500 hover:text-gray-900"
                      >
                        Close
                      </button>

                      <button
                        onClick={() => onEnterFallback()}
                        className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                      >
                        View shop results
                      </button>
                    </div>
                  </div>
                )}
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

              {/* Notification (desktop popover) */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={openNotifications}
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
                  open={desktopNotifOpen}
                  onClose={() => setDesktopNotifOpen(false)}
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

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#212121] mt-2 mx-3 sm:mx-4 rounded-2xl shadow-lg z-50">
            <div className="px-4 py-3">
              {/* Search */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Search
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={() => {
                    onEnterFallback();
                    setMobileMenuOpen(false);
                  }}
                />

                {/* Mobile search results dropdown */}
                {searchOpen && navSearch.trim() && (
                  <div className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-[100] max-h-[70vh] overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-xs text-gray-400">
                        Searching for:{" "}
                        <span className="font-semibold text-white">
                          {navSearch.trim()}
                        </span>
                      </p>
                    </div>

                    {searchLoading ? (
                      <div className="px-4 py-6 text-sm text-gray-400">
                        Loading results...
                      </div>
                    ) : searchErr ? (
                      <div className="px-4 py-6 text-sm text-red-400">
                        {searchErr}
                      </div>
                    ) : (
                      <div>
                        {/* Products */}
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-gray-400 mb-2">
                            Products
                          </p>

                          {searchData.products.length === 0 ? (
                            <p className="text-sm text-gray-500 py-2">
                              No products found.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {searchData.products.map((p) => (
                                <button
                                  key={p._id}
                                  onClick={() => {
                                    openProductFromSearch(p);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-700 text-left"
                                >
                                  <div className="w-10 h-10 rounded-md bg-gray-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {p?.images?.[0]?.url ? (
                                      <img
                                        src={p.images[0].url}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-1"
                                      />
                                    ) : (
                                      <span className="text-[10px] text-gray-500">
                                        No img
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                      {p.name || "—"}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                      {p.category || "Uncategorized"}
                                    </p>
                                  </div>

                                  <span className="text-xs text-orange-500 font-semibold flex-shrink-0">
                                    Open
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-700" />

                        {/* Orders */}
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-gray-400 mb-2">
                            My Orders
                          </p>

                          {!token ? (
                            <p className="text-sm text-gray-500 py-2">
                              Login to search orders.
                            </p>
                          ) : searchData.orders.length === 0 ? (
                            <p className="text-sm text-gray-500 py-2">
                              No matching orders.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {searchData.orders.map((o) => (
                                <button
                                  key={o._id}
                                  onClick={() => {
                                    openOrderFromSearch(o);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-700 text-left"
                                >
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                      {o.orderId || "Order"}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                      Status: {o.status || "—"}
                                    </p>
                                  </div>

                                  <span className="text-xs text-orange-500 font-semibold flex-shrink-0">
                                    View
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-700" />

                        {/* Services */}
                        <div className="px-4 py-2">
                          <p className="text-xs font-semibold text-gray-400 mb-2">
                            My Services
                          </p>

                          {!token ? (
                            <p className="text-sm text-gray-500 py-2">
                              Login to search services.
                            </p>
                          ) : searchData.services.length === 0 ? (
                            <p className="text-sm text-gray-500 py-2">
                              No matching services.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {searchData.services.map((r) => (
                                <button
                                  key={r._id}
                                  onClick={() => {
                                    openServiceFromSearch(r);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-700 text-left"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-white truncate">
                                      {r.title || r.serviceName || "Service"}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                      {r.projectId || "—"} • {r.stage || "—"}
                                    </p>
                                  </div>

                                  <span className="text-xs text-orange-500 font-semibold flex-shrink-0">
                                    View
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="px-4 py-3 border-t border-gray-700 flex justify-between items-center sticky bottom-0 bg-gray-800">
                      <button
                        onClick={() => {
                          setSearchOpen(false);
                          setNavSearch("");
                        }}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Close
                      </button>

                      <button
                        onClick={() => {
                          onEnterFallback();
                          setMobileMenuOpen(false);
                        }}
                        className="text-xs font-semibold text-orange-500 hover:text-orange-400"
                      >
                        View shop results
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 mb-4">
                <Link
                  to="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    isActive("/home")
                      ? "bg-white text-black"
                      : "text-white hover:bg-gray-700"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    isActive("/shop")
                      ? "bg-white text-black"
                      : "text-white hover:bg-gray-700"
                  }`}
                >
                  Shop
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/wishlist");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
                >
                  <Heart size={18} />
                  <span className="text-sm">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-1.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/cart");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
                >
                  <ShoppingCart size={18} />
                  <span className="text-sm">Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-1.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* ✅ Mobile Notifications opens SAME component UI (desktop popover) but inside a sheet */}
                <button
                  onClick={() => {
                    setMobileNotifOpen(true);
                    // keep menu open or close it (your choice)
                    // setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
                >
                  <Bell size={18} />
                  <span className="text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/account");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
                >
                  <User size={18} />
                  <span className="text-sm">Account</span>
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                <LogOut size={18} />
                <span className="text-sm">Log out</span>
              </button>
            </div>
          </div>
        )}

        {/* ✅ Mobile Notifications Sheet (uses the SAME desktop component) */}
        {mobileNotifOpen && (
          <div
            className="lg:hidden fixed inset-0 z-[999] bg-black/50 flex items-end"
            onClick={() => setMobileNotifOpen(false)}
          >
            <div
              className="w-full bg-white rounded-t-3xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-5 py-4 flex justify-between items-center rounded-t-3xl z-10">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell size={20} />
                  Notifications
                </h3>
                <button
                  onClick={() => setMobileNotifOpen(false)}
                  className="text-gray-500 hover:text-gray-900 p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-4">
                <div className="relative w-full">
                  <UserNotificationsPopover
                    open={true}
                    variant="sheet"
                    onClose={() => setMobileNotifOpen(false)}
                    token={token}
                    onUnreadChange={(n) => setUnreadCount(Number(n || 0))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Order Detail Modal (opened from navbar search) */}
      <UserOrderDetailModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        token={token}
        orderId={activeOrderId}
      />

      {/* Service Detail Modal (opened from navbar search) */}
      <ServiceRequestDetailModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        token={token}
        requestId={activeServiceId}
      />

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
