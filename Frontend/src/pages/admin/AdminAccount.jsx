import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchAdminMe } from "@/services/adminAccountService";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase() || "AD";
}

export default function AdminAccount() {
  const token = localStorage.getItem("admin_token");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const me = await fetchAdminMe(token);
        setAdmin(me);

        // keep AdminLayout dropdown accurate
        localStorage.setItem("admin_data", JSON.stringify(me));
      } catch (err) {
        toast.error(err.message || "Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  const initials = useMemo(() => getInitials(admin?.name), [admin?.name]);

  const roleLabel = useMemo(() => {
    const r = admin?.role || "";
    return r
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [admin?.role]);

  const createdAt = admin?.createdAt
    ? new Date(admin.createdAt).toLocaleDateString()
    : "—";

  if (!token) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <p className="text-sm text-gray-600">You are not logged in.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <p className="text-sm text-gray-600">Loading account…</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <p className="text-sm text-gray-600">Account not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-900">{admin.name}</p>
          <p className="text-sm text-gray-600">{admin.email}</p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full ${
            admin.isVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {admin.isVerified ? "Verified" : "Not Verified"}
        </span>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Account details</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Role</p>
            <p className="font-medium text-gray-900">{roleLabel || "—"}</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Created</p>
            <p className="font-medium text-gray-900">{createdAt}</p>
          </div>

          <div className="border rounded-lg p-4 md:col-span-2">
            <p className="text-gray-500">Admin ID</p>
            <p className="font-medium text-gray-900 break-all">{admin._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
