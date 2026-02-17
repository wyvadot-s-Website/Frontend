// src/components/admin/UserProfileModal.jsx
import React, { useEffect, useState } from "react";
import { X, MapPin, ShoppingCart, Briefcase } from "lucide-react";
import BASE_URL from "@/utils/api";

function getInitials(u) {
  const a = (u?.firstName || "").trim()[0] || "";
  const b = (u?.lastName || "").trim()[0] || "";
  return (a + b).toUpperCase() || "U";
}

function formatCurrency(amount) {
  if (amount == null) return "₦0";
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(1)}K`;
  return `₦${amount}`;
}


function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserProfileModal({ user, token, onClose }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
const [fullUser, setFullUser] = useState(null);

  useEffect(() => {
    if (!user?._id || !token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders for this user
        const ordRes = await fetch(
          `${BASE_URL}/api/admin/shop/orders?userId=${user._id}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const ordData = await ordRes.json();
        const orders = ordData?.items || ordData?.data || [];

        // Fetch service requests for this user
        const srvRes = await fetch(
          `${BASE_URL}/api/admin/service-requests?userId=${user._id}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const srvData = await srvRes.json();
        const services = srvData?.items || srvData?.data || [];

        // Compute stats
        const totalSpent = orders.reduce(
          (sum, o) => sum + Number(o?.totalAmount || o?.total || 0),
          0
        );
        // Fetch full user profile (for avatar + extra fields)
const userRes = await fetch(
  `${BASE_URL}/api/admin/users/${user._id}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
const userData = await userRes.json();

setFullUser(userData?.user || userData);


        const ratings = orders
          .map((o) => Number(o?.rating))
          .filter((r) => r > 0);
        const avgRating =
          ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : null;

        setStats({
          shopCount: orders.length,
          totalSpent,
          avgRating,
        });

        // Build recent activity
        const orderActivity = orders.slice(0, 3).map((o) => ({
          type: "order",
          label: o?.items?.[0]?.name || o?.orderId || "Purchase",
          date: o?.createdAt,
        }));

        const serviceActivity = services.slice(0, 3).map((s) => ({
          type: "service",
          label: s?.title || s?.serviceName || "Service request",
          date: s?.createdAt,
        }));

        const combined = [...orderActivity, ...serviceActivity]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setActivity(combined);
     } catch (err) {
  console.error("Failed to load user profile modal data:", err);
  setStats({ shopCount: 0, totalSpent: 0, avgRating: null });
  setActivity([]);
}
 finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id, token]);

  if (!fullUser && loading) return null;


  const createdAt = fullUser?.createdAt || user?.createdAt;

const isNew =
  createdAt &&
  Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;


  const location = [fullUser?.city, fullUser?.country]
  .filter(Boolean)
  .join(", ") || null;


  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Customer Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* User info row */}
          <div className="flex items-center gap-4 mb-4">
            {fullUser?.avatar?.url ? (
  <img
    src={fullUser.avatar.url}
    alt="avatar"
    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
  />
) : (
  <div className="w-16 h-16 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xl font-semibold">
    {getInitials(fullUser || user)}
  </div>
)}


            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-gray-900 text-lg leading-tight">
                  {fullUser?.firstName || user.firstName} {fullUser?.lastName || user.lastName}
                </p>
                {isNew && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                    New
                  </span>
                )}
              </div>
              {location && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin size={11} />
                  <span>{location}</span>
                </div>
              )}
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {fullUser?.email || user?.email || "—"}

              </p>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 animate-pulse h-16" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-orange-500">
                  {stats?.shopCount ?? 0}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Shop</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-orange-500">
                  {formatCurrency(stats?.totalSpent)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Total Spent</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-orange-500">
                  {stats?.avgRating ?? "—"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Rating</p>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">
              Recent Activity
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">No recent activity.</p>
            ) : (
              <div className="divide-y">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      {item.type === "order" ? (
                        <ShoppingCart size={15} className="text-orange-500" />
                      ) : (
                        <Briefcase size={15} className="text-orange-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}