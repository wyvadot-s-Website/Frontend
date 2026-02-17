// src/Layout/AdminLayout.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import AdminNotificationsPopover from "@/components/AdminNotificationsPopover";
import { fetchAdminNotifications } from "@/services/notificationService";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderKanban,
  ChevronDown,
  User,
  LogOut,
  Menu,
  Bell,
  Users, // ✅ NEW (User Management tab icon)
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

// ✅ role -> permissions
const ROLE_ACCESS = {
  super_admin: {
    dashboard: true,
    content: true,
    shop: true,
    projects: true,
    users: true, // ✅ NEW
  },

  content_admin: {
    dashboard: true,
    content: true,
    shop: false,
    projects: false,
    users: true, // ✅ NEW (can see users list)
  },

  shop_admin: {
    dashboard: true,
    content: false,
    shop: true,
    projects: false,
    users: true, // ✅ NEW
  },

  project_admin: {
    dashboard: true,
    content: false,
    shop: false,
    projects: true,
    users: true, // ✅ NEW
  },

  content_shop_admin: {
    dashboard: true,
    content: true,
    shop: true,
    projects: false,
    users: true, // ✅ NEW
  },

  content_project_admin: {
    dashboard: true,
    content: true,
    shop: false,
    projects: true,
    users: true, // ✅ NEW
  },

  shop_project_admin: {
    dashboard: true,
    content: false,
    shop: true,
    projects: true,
    users: true, // ✅ NEW
  },
};

function getInitials(name = "") {
  const parts = String(name).trim().split(" ").filter(Boolean);
  if (!parts.length) return "AD";
  const a = parts[0]?.[0] || "A";
  const b = parts[1]?.[0] || parts[0]?.[1] || "D";
  return (a + b).toUpperCase();
}

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Expecting login to store admin like:
  // localStorage.setItem("admin_token", token)
  // localStorage.setItem("admin_data", JSON.stringify(admin))
  const token = useMemo(() => localStorage.getItem("admin_token"), []);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

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
    // small poll so badge updates even if admin doesn't open dropdown
    if (!token) return;

    let alive = true;

    const pull = async () => {
      try {
        const data = await fetchAdminNotifications(token, 1, 1);
        if (!alive) return;
        setUnreadCount(Number(data.unread || 0));
      } catch {
        // ignore
      }
    };

    pull();
    const id = setInterval(pull, 25000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [token]);

  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_data") || "null");
    } catch {
      return null;
    }
  }, []);

  const role = admin?.role || "content_admin";
  const access = ROLE_ACCESS[role] || ROLE_ACCESS.content_admin;

  const allMenuItems = [
    {
      key: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/theboss/dashboard",
    },
    {
      key: "content",
      icon: FileText,
      label: "Content Management",
      path: "/theboss/content",
    },
    {
      key: "shop",
      icon: Briefcase,
      label: "Shop Management",
      path: "/theboss/services",
    },
    {
      key: "projects",
      icon: FolderKanban,
      label: "Project Management",
      path: "/theboss/projects",
    },

    // ✅ NEW TAB
    {
      key: "users",
      icon: Users,
      label: "User Management",
      path: "/theboss/user-management",
    },
  ];

  const menuItems = allMenuItems.filter((m) => access[m.key]);

  // ✅ Better active label detection (works for nested routes too)
  const activeLabel =
    menuItems.find((item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/")
    )?.label || "Dashboard";

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    setShowLogoutConfirm(false);
    navigate("/theboss"); // back to admin auth entry
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } bg-white border-r transition-all duration-300 overflow-hidden flex flex-col h-screen`}
        >
          <div className="p-4">
            <img src={logo} alt="" className="w-30" />
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold mb-3 px-3">
                Navigation
              </p>

              {menuItems.map((item, index) => {
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");

                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="border-t p-4">
            <DropdownMenu>
<DropdownMenuTrigger asChild>
  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      {admin?.avatar?.url ? (
        <img src={admin.avatar.url} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm flex items-center justify-center font-semibold">
          {getInitials(admin?.name)}
        </div>
      )}
    </div>
    <div className="flex-1 text-left min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{admin?.name || "Admin"}</p>
      <p className="text-xs text-gray-500 truncate">{admin?.email || "—"}</p>
    </div>
    <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
  </button>
</DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => {
                    navigate("account"); // ✅ /theboss/account
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>View account</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden border m-4 rounded-xl border border-[#E5E7EB]">
          {/* Header */}
          <header className="bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="h-9 w-9"
                >
                  <Menu size={18} />
                </Button>

                <h1 className="text-sm font-medium text-gray-900">
                  {activeLabel}
                </h1>
              </div>

              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  onClick={() => setNotifOpen((p) => !p)}
                >
                  <Bell size={18} className="text-gray-600" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Button>

                <AdminNotificationsPopover
                  open={notifOpen}
                  onClose={() => setNotifOpen(false)}
                  token={token}
                  onUnreadChange={(n) => setUnreadCount(Number(n || 0))}
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Confirm logout</h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out of the admin dashboard?
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

export default AdminLayout;
