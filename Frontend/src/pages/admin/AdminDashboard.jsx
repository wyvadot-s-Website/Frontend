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

// ✅ These already exist in your project (from the code you pasted)
import { fetchAdminProducts, fetchAdminOrders } from "@/services/adminShopService";
import { fetchServiceRequestsAdmin } from "@/services/serviceRequestService";

// ✅ Content CMS fetchers you already have in your CMS pages
import { fetchProjectsAdmin } from "@/services/adminProjectService";
import { fetchTeamAdmin } from "@/services/adminTeamService";
import { fetchTestimonialsAdmin } from "@/services/adminTestimonialService";

// If you already have these components and want to keep the same design,
// you can swap the inline cards below to use them.
// import { StatsCard } from "@/components/dashboard/StatsCard";

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

  // content
  const [contentCounts, setContentCounts] = useState({
    projects: 0,
    team: 0,
    testimonials: 0,
    pages: 6, // Home, About, Projects, Team, Testimonials, Footer (your tabs)
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

        // SHOP (only if allowed)
        if (access.shop) {
          jobs.push(
            (async () => {
              const prodRes = await fetchAdminProducts(token, { search: "" });
              const prodItems = prodRes.items || prodRes.data?.items || prodRes.data || prodRes;
              setProducts(Array.isArray(prodItems) ? prodItems : []);

              const orderRes = await fetchAdminOrders(token, { search: "" });
              const orderItems = orderRes.items || orderRes.data?.items || orderRes.data || orderRes;
              setOrders(Array.isArray(orderItems) ? orderItems : []);
            })(),
          );
        }

        // PROJECTS/SERVICES (only if allowed)
        if (access.projects) {
          jobs.push(
            (async () => {
              const res = await fetchServiceRequestsAdmin(token);
              const items = res?.data || res || [];
              setServiceRequests(Array.isArray(items) ? items : []);
            })(),
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

              // projects admin service returns {success, data} in your CMS
              const projectsArr = Array.isArray(pRes?.data) ? pRes.data : Array.isArray(pRes) ? pRes : [];
              const teamArr = Array.isArray(tRes) ? tRes : Array.isArray(tRes?.data) ? tRes.data : [];
              const testArr = Array.isArray(tesRes?.data) ? tesRes.data : Array.isArray(tesRes) ? tesRes : [];

              setContentCounts((prev) => ({
                ...prev,
                projects: projectsArr.length,
                team: teamArr.length,
                testimonials: testArr.length,
              }));
            })(),
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
    return orders.reduce((sum, o) => sum + Number(o?.totals?.total || o?.total || 0), 0);
  }, [orders]);

  const latestProducts = useMemo(() => {
    const arr = Array.isArray(products) ? [...products] : [];
    arr.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    return arr.slice(0, 5);
  }, [products]);

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

  // Build stat cards based on access (so roles only see their own parts)
  const statCards = useMemo(() => {
    const cards = [];

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

    if (access.content) {
      const totalContentItems =
        Number(contentCounts.pages || 0) +
        Number(contentCounts.projects || 0) +
        Number(contentCounts.team || 0) +
        Number(contentCounts.testimonials || 0);

      cards.push({
        icon: Users,
        title: "Content Items",
        value: String(totalContentItems),
        details: [
          `Pages: ${contentCounts.pages}`,
          `Projects: ${contentCounts.projects}`,
          `Team: ${contentCounts.team}`,
          `Testimonials: ${contentCounts.testimonials}`,
        ],
      });
    }

    return cards;
  }, [access.shop, access.projects, access.content, products.length, orders.length, revenue, serviceRequests.length, contentCounts]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHOP OVERVIEW */}
        {access.shop ? (
          <SectionCard
            title="Shop Overview"
            actionLabel="View all"
            onAction={() => navigate("/theboss/services")}
          >
            <div className="space-y-5">
              {/* Products first (as you requested) */}
              <div>
                <p className="text-sm font-semibold text-gray-900">Recent Products</p>
                {latestProducts.length === 0 ? (
                  <p className="text-sm text-gray-600 mt-2">No products yet.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {latestProducts.map((p) => (
                      <div key={p._id} className="flex items-center justify-between border rounded-lg p-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-600">
                            {p.category || "Uncategorized"} • {formatMoney(p.price)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          Stock: {p.stockQuantity ?? 0}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Orders (preview) */}
              <div>
                <p className="text-sm font-semibold text-gray-900">Recent Orders</p>
                {latestOrders.length === 0 ? (
                  <p className="text-sm text-gray-600 mt-2">No orders yet.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {latestOrders.map((o) => (
                      <div key={o._id} className="flex items-center justify-between border rounded-lg p-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {o.orderId || "—"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {o?.customer?.email || "—"}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatMoney(o?.totals?.total || o?.total || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>
        ) : null}

        {/* PROJECT/SERVICE OVERVIEW */}
        {access.projects ? (
          <SectionCard
            title="Project/Service Overview"
            actionLabel="View all"
            onAction={() => navigate("/theboss/projects")}
          >
            {latestRequests.length === 0 ? (
              <p className="text-sm text-gray-600">No service requests yet.</p>
            ) : (
              <div className="space-y-2">
                {latestRequests.map((r) => (
                  <div key={r._id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {r.projectId || "—"} • {r.title || "—"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {r.contact?.name || "—"} • {r.contact?.email || "—"}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Number(r.progress ?? 0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        ) : null}

        {/* CONTENT OVERVIEW */}
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
