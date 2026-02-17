// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Users, ShoppingCart, FileText, Package } from "lucide-react";

import { Button } from "@/components/ui/button";

// Reuse your existing role access logic (same as AdminLayout)
const ROLE_ACCESS = {
  super_admin: { dashboard: true, content: true, shop: true, projects: true },

  content_admin: { dashboard: true, content: true, shop: false, projects: false },
  shop_admin: { dashboard: true, content: false, shop: true, projects: false },
  project_admin: { dashboard: true, content: false, shop: false, projects: true },

  content_shop_admin: { dashboard: true, content: true, shop: true, projects: false },
  content_project_admin: { dashboard: true, content: true, shop: false, projects: true },
  shop_project_admin: { dashboard: true, content: false, shop: true, projects: true },
};

// ✅ Existing services
import { fetchAdminProducts, fetchAdminOrders } from "@/services/adminShopService";
import { fetchServiceRequestsAdmin } from "@/services/serviceRequestService";

// ✅ Content CMS fetchers you already have
import { fetchProjectsAdmin } from "@/services/adminProjectService";
import { fetchTeamAdmin } from "@/services/adminTeamService";
import { fetchTestimonialsAdmin } from "@/services/adminTestimonialService";

// ✅ NEW: user management fetcher (users list)
import { fetchAdminUsers } from "@/services/adminUserManagementService"; // <-- ensure this path matches your file name

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN" });

function StatCard({ icon: Icon, title, value, details }) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-orange-50">
          <Icon className="h-4 w-4 text-orange-600" />
        </div>
      </div>

      <p className="text-xs text-gray-600 font-medium mt-3">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>

      {Array.isArray(details) && details.length ? (
        <div className="mt-3 space-y-1">
          {details.map((d, i) => (
            <p key={i} className="text-xs text-gray-500">
              {d}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({ title, actionLabel, onAction, children }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {actionLabel ? (
          <Button className="bg-[#FF8D28] hover:bg-[#e67d1f]" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_data") || "null");
    } catch {
      return null;
    }
  }, []);

  const role = admin?.role || "content_admin";
  const access = ROLE_ACCESS[role] || ROLE_ACCESS.content_admin;

  // ===== DATA STATES =====
  const [loading, setLoading] = useState(false);

  // shop
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // projects/services
  const [serviceRequests, setServiceRequests] = useState([]);

  // ✅ users (for user management)
  const [users, setUsers] = useState([]);

  // content
  const [contentCounts, setContentCounts] = useState({
    projects: 0,
    team: 0,
    testimonials: 0,
    pages: 6,
  });

  // ===== ROUTE PROTECT =====
  useEffect(() => {
    if (!token) {
      toast.error("Please login as admin.");
      navigate("/theboss");
    }
  }, [token, navigate]);

  // ===== LOAD DASHBOARD DATA =====
  useEffect(() => {
    if (!token) return;

    const run = async () => {
      setLoading(true);
      try {
        const jobs = [];

        // ✅ USERS (all admins)
        jobs.push(
          (async () => {
            const res = await fetchAdminUsers(token, { page: 1, limit: 50, search: "" });
            // support common API shapes
            const items =
              res?.items ||
              res?.data?.items ||
              res?.data ||
              res?.users ||
              [];
            setUsers(Array.isArray(items) ? items : []);
          })()
        );

        // SHOP (only if allowed)
        if (access.shop) {
          jobs.push(
            (async () => {
              const prodRes = await fetchAdminProducts(token, { search: "" });
              const prodItems =
                prodRes.items || prodRes.data?.items || prodRes.data || prodRes;
              setProducts(Array.isArray(prodItems) ? prodItems : []);

              const orderRes = await fetchAdminOrders(token, { search: "" });
              const orderItems =
                orderRes.items || orderRes.data?.items || orderRes.data || orderRes;
              setOrders(Array.isArray(orderItems) ? orderItems : []);
            })()
          );
        }

        // PROJECTS/SERVICES (only if allowed)
        if (access.projects) {
          jobs.push(
            (async () => {
              const res = await fetchServiceRequestsAdmin(token);
              const items = res?.data || res || [];
              setServiceRequests(Array.isArray(items) ? items : []);
            })()
          );
        }

        // CONTENT (only if allowed)
        if (access.content) {
          jobs.push(
            (async () => {
              const [pRes, tRes, tesRes] = await Promise.all([
                fetchProjectsAdmin(token),
                fetchTeamAdmin(token),
                fetchTestimonialsAdmin(token),
              ]);

              const projectsArr = Array.isArray(pRes?.data)
                ? pRes.data
                : Array.isArray(pRes)
                ? pRes
                : [];
              const teamArr = Array.isArray(tRes)
                ? tRes
                : Array.isArray(tRes?.data)
                ? tRes.data
                : [];
              const testArr = Array.isArray(tesRes?.data)
                ? tesRes.data
                : Array.isArray(tesRes)
                ? tesRes
                : [];

              setContentCounts((prev) => ({
                ...prev,
                projects: projectsArr.length,
                team: teamArr.length,
                testimonials: testArr.length,
              }));
            })()
          );
        }

        await Promise.all(jobs);
      } catch (err) {
        toast.error(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token, access.shop, access.projects, access.content]);

  // ===== DERIVED =====
  const revenue = useMemo(() => {
    if (!Array.isArray(orders)) return 0;
    return orders.reduce(
      (sum, o) => sum + Number(o?.totals?.total || o?.total || 0),
      0
    );
  }, [orders]);

  const latestOrders = useMemo(() => {
    const arr = Array.isArray(orders) ? [...orders] : [];
    arr.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    return arr.slice(0, 5);
  }, [orders]);

  const latestRequests = useMemo(() => {
    const arr = Array.isArray(serviceRequests) ? [...serviceRequests] : [];
    arr.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    return arr.slice(0, 5);
  }, [serviceRequests]);

  const latestUsers = useMemo(() => {
    const arr = Array.isArray(users) ? [...users] : [];
    arr.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    return arr.slice(0, 5);
  }, [users]);

  // Build stat cards based on access (so roles only see their own parts)
  const statCards = useMemo(() => {
    const cards = [];

    // ✅ REPLACE Content Items card with Users card (everyone sees)
    cards.push({
      icon: Users,
      title: "Total Users",
      value: String(users.length),
      details: ["User management"],
    });

    if (access.shop) {
      cards.push({
        icon: Package,
        title: "Total Products",
        value: String(products.length),
        details: ["Shop management"],
      });

      cards.push({
        icon: ShoppingCart,
        title: "Total Orders",
        value: String(orders.length),
        details: [orders.length ? `Revenue: ${formatMoney(revenue)}` : "No orders yet"],
      });
    }

    if (access.projects) {
      cards.push({
        icon: FileText,
        title: "Services Form Submitted",
        value: String(serviceRequests.length),
        details: ["Project management"],
      });
    }

    return cards;
  }, [
    users.length,
    access.shop,
    access.projects,
    products.length,
    orders.length,
    revenue,
    serviceRequests.length,
  ]);

  const colsClass =
    statCards.length >= 4
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      : statCards.length === 3
      ? "grid-cols-1 md:grid-cols-3"
      : statCards.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1";

  return (
    <div className="space-y-6">
      {/* Top stat cards */}
      <div className={`grid ${colsClass} gap-6`}>
        {statCards.map((c, i) => (
          <StatCard key={i} {...c} />
        ))}
      </div>

      {/* Loading hint */}
      {loading ? <p className="text-sm text-gray-600">Loading dashboard…</p> : null}

      {/* Overview sections */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

        {/* ✅ RECENT USERS */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Users</h2>

            <button
              onClick={() => navigate("/theboss/user-management")} 
              // 👆 change this if your actual route differs
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg"
            >
              View all
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {latestUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-sm text-gray-500">
                      No users yet.
                    </td>
                  </tr>
                ) : (
                  latestUsers.map((u) => {
                    const name = [u?.firstName, u?.middleName, u?.lastName].filter(Boolean).join(" ");
                    const joined = u?.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <tr key={u._id} className="text-sm">
                        <td className="py-3 text-gray-800">{name || "—"}</td>
                        <td className="py-3 text-gray-500">{u?.email || "—"}</td>
                        <td className="py-3 text-gray-500">{joined}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {latestUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No users yet.</p>
            ) : (
              latestUsers.map((u) => {
                const name = [u?.firstName, u?.middleName, u?.lastName].filter(Boolean).join(" ");
                const joined = u?.createdAt
                  ? new Date(u.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—";

                return (
                  <div key={u._id} className="border rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{name || "—"}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">{u?.email || "—"}</p>
                    <p className="text-xs text-gray-500 mt-1">Joined: {joined}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PROJECT TABLE */}
        {access.projects ? (
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Project</h2>
              <button
                onClick={() => navigate("/theboss/projects")}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg"
              >
                View all
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs border-b">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Tel</th>
                    <th className="pb-3 font-medium">Country</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {latestRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-sm text-gray-500">
                        No service requests yet.
                      </td>
                    </tr>
                  ) : (
                    latestRequests.map((r) => {
                      const status = r.stage || "Pending";
                      const statusMap = {
                        Completed: "bg-green-100 text-green-600",
                        Pending: "bg-green-100 text-green-600",
                        Active: "bg-green-100 text-green-600",
                        Execution: "bg-blue-100 text-blue-600",
                        Rejected: "bg-red-100 text-red-600",
                        "Site Visit": "bg-purple-100 text-purple-600",
                        Review: "bg-yellow-100 text-yellow-700",
                        Documentation: "bg-orange-100 text-orange-600",
                      };
                      const statusCls = statusMap[status] || "bg-green-100 text-green-600";

                      return (
                        <tr key={r._id} className="text-sm">
                          <td className="py-3 text-gray-800">{r.contact?.name || "—"}</td>
                          <td className="py-3 text-gray-500">{r.contact?.email || "—"}</td>
                          <td className="py-3 text-gray-500">{r.contact?.countryCode || "—"}</td>
                          <td className="py-3 text-gray-500">{r.contact?.tel || "—"}</td>

                          <td className="py-3">
                            <span className={`px-3 py-1 text-xs rounded-full ${statusCls}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {latestRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No service requests yet.</p>
              ) : (
                latestRequests.map((r) => {
                  const status = r.stage || "Pending";
                  const statusMap = {
                    Completed: "bg-green-100 text-green-600",
                    Pending: "bg-green-100 text-green-600",
                    Active: "bg-green-100 text-green-600",
                    Execution: "bg-blue-100 text-blue-600",
                    Rejected: "bg-red-100 text-red-600",
                    "Site Visit": "bg-purple-100 text-purple-600",
                    Review: "bg-yellow-100 text-yellow-700",
                    Documentation: "bg-orange-100 text-orange-600",
                  };
                  const statusCls = statusMap[status] || "bg-green-100 text-green-600";

                  return (
                    <div key={r._id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {r.contact?.name || "—"}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${statusCls}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{r.contact?.email || "—"}</p>
                      <p className="text-xs text-gray-500">
                        {r.contact?.phone || "—"} • {r.contact?.country || "—"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : null}

        {/* ORDERS TABLE */}
        {access.shop ? (
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Orders</h2>
              <button
                onClick={() => navigate("/theboss/services")}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg"
              >
                View all
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs border-b">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {latestOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-sm text-gray-500">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    latestOrders.map((o) => {
                      const status = o.status || "processing";
                      const statusMap = {
                        processing: "bg-orange-100 text-orange-600",
                        pending: "bg-orange-100 text-orange-600",
                        pending_payment: "bg-orange-100 text-orange-600",
                        shipped: "bg-blue-100 text-blue-600",
                        delivered: "bg-green-100 text-green-600",
                        cancelled: "bg-red-100 text-red-600",
                        "still in cart": "bg-gray-100 text-gray-600",
                        still_in_cart: "bg-gray-100 text-gray-600",
                      };
                      const statusCls = statusMap[status] || "bg-gray-100 text-gray-600";

                      const displayStatus = String(status)
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());

                      const productName = o?.items?.[0]?.name || "—";
                      const createdAt = o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—";

                      return (
                        <tr key={o._id} className="text-sm">
                          <td className="py-3 text-gray-800">{o?.customer?.fullName || "—"}</td>
                          <td className="py-3 text-gray-500">{createdAt}</td>
                          <td className="py-3 text-gray-500">{productName}</td>
                          <td className="py-3">
                            <span className={`px-3 py-1 text-xs rounded-full ${statusCls}`}>
                              {displayStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {latestOrders.length === 0 ? (
                <p className="text-sm text-gray-500">No orders yet.</p>
              ) : (
                latestOrders.map((o) => {
                  const status = o.status || "processing";
                  const statusMap = {
                    processing: "bg-orange-100 text-orange-600",
                    pending: "bg-orange-100 text-orange-600",
                    pending_payment: "bg-orange-100 text-orange-600",
                    shipped: "bg-blue-100 text-blue-600",
                    delivered: "bg-green-100 text-green-600",
                    cancelled: "bg-red-100 text-red-600",
                    "still in cart": "bg-gray-100 text-gray-600",
                    still_in_cart: "bg-gray-100 text-gray-600",
                  };
                  const statusCls = statusMap[status] || "bg-gray-100 text-gray-600";

                  const displayStatus = String(status)
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());

                  const productName = o?.items?.[0]?.name || "—";
                  const createdAt = o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <div key={o._id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {o?.customer?.fullName || "—"}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${statusCls}`}>
                          {displayStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{productName}</p>
                      <p className="text-xs text-gray-500">{createdAt}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : null}

        {/* PROJECT/SERVICE OVERVIEW */}
        {access.projects ? (
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Forms</h2>
              <button
                onClick={() => navigate("/theboss/projects")}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg"
              >
                View all
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs border-b">
                    <th className="pb-3 font-medium">Forms</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Form Type</th>
                    <th className="pb-3 font-medium">Submitted</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {latestRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-sm text-gray-500">
                        No service requests yet.
                      </td>
                    </tr>
                  ) : (
                    latestRequests.map((r) => {
                      const submittedDate = r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })
                        : "—";

                      const submittedTime = r.createdAt
                        ? new Date(r.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "";

                      return (
                        <tr key={r._id} className="text-sm">
                          <td className="py-3 text-gray-800">{r.projectId || "—"}</td>
                          <td className="py-3 text-gray-500">{r.contact?.email || "—"}</td>
                          <td className="py-3">
                            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                              Contact Info
                            </span>
                          </td>
                          <td className="py-3 text-gray-500">
                            {submittedDate} {submittedTime}
                          </td>
                          <td className="py-3">
                            <Button
                              onClick={() => navigate(`/theboss/service-requests/${r._id}`)}
                              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {latestRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No service requests yet.</p>
              ) : (
                latestRequests.map((r) => {
                  const submittedDate = r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "—";

                  const submittedTime = r.createdAt
                    ? new Date(r.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "";

                  return (
                    <div key={r._id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {r.projectId || "—"}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {r.contact?.email || "—"}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 flex-shrink-0">
                          Contact Info
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {submittedDate} {submittedTime}
                      </p>
                      <Button
                        onClick={() => navigate(`/theboss/service-requests/${r._id}`)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg"
                      >
                        Details
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : null}

        {/* ✅ KEEP Content Overview section as-is */}
        {access.content ? (
          <SectionCard
            title="Content Overview"
            actionLabel="View all"
            onAction={() => navigate("/theboss/content")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-600">Pages</p>
                <p className="text-lg font-semibold">{contentCounts.pages}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-600">Projects</p>
                <p className="text-lg font-semibold">{contentCounts.projects}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-600">Team Members</p>
                <p className="text-lg font-semibold">{contentCounts.team}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-600">Testimonials</p>
                <p className="text-lg font-semibold">{contentCounts.testimonials}</p>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}
