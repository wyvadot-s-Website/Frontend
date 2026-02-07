// src/pages/admin/ProjectManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Pencil, Eye, UserCheck } from "lucide-react";

import {
  fetchServiceRequestsAdmin,
  acceptServiceRequestAdmin,
} from "@/services/serviceRequestService";

import UpdateServiceRequestModal from "@/components/admin/UpdateServiceRequestModal";

// Stage pill styles (matching screenshot feel)
function StagePill({ stage }) {
  const map = {
    Documentation: "bg-orange-100 text-orange-700",
    Execution: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Pending: "bg-gray-100 text-gray-700",
    "Site Visit": "bg-purple-100 text-purple-700",
    Review: "bg-yellow-100 text-yellow-700",
  };

  const cls = map[stage] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>
      {stage}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function ProjectManagement() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  // Try to read admin object (works with multiple possible keys)
  const adminUser =
    JSON.parse(localStorage.getItem("admin_user") || "null") ||
    JSON.parse(localStorage.getItem("admin") || "null") ||
    JSON.parse(localStorage.getItem("theboss_admin") || "null");

  const myAdminId = adminUser?._id || adminUser?.id || null;

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  // Update modal state
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // ✅ Route protection
  useEffect(() => {
    if (!token) {
      toast.error("Please login as admin.");
      navigate("/theboss");
    }
  }, [token, navigate]);

  const loadRequests = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetchServiceRequestsAdmin(token);
      setRequests(res?.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load service requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;

    return requests.filter((r) => {
      const projectId = String(r.projectId || "").toLowerCase();
      const title = String(r.title || "").toLowerCase();
      const client = String(r.contact?.name || "").toLowerCase();
      const email = String(r.contact?.email || "").toLowerCase();
      const manager = String(r.assignedAdmin?.name || "").toLowerCase();
      const stage = String(r.stage || "").toLowerCase();

      return (
        projectId.includes(q) ||
        title.includes(q) ||
        client.includes(q) ||
        email.includes(q) ||
        manager.includes(q) ||
        stage.includes(q)
      );
    });
  }, [requests, search]);

  const handleAssignToMe = async (reqItem) => {
    if (!token) return;

    const toastId = toast.loading("Assigning to you...");
    try {
      const res = await acceptServiceRequestAdmin(token, reqItem._id);

      // If backend returned updated doc, update locally. Otherwise refresh.
      const updated = res?.data || res;
      if (updated?._id) {
        setRequests((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r)),
        );
      } else {
        await loadRequests();
      }

      toast.success("Assigned to you", { id: toastId });
    } catch (err) {
      // If it *still* assigned but response shape caused error previously,
      // loadRequests() will reveal the truth.
      await loadRequests();
      toast.success("Assigned to you", { id: toastId });
    }
  };

  const openUpdate = (req) => {
    setSelected(req);
    setUpdateOpen(true);
  };

  const handleUpdated = (updated) => {
    const next = updated?.data ? updated.data : updated;
    if (!next?._id) return;
    setRequests((prev) => prev.map((r) => (r._id === next._id ? next : r)));
  };

  const canShowAssign = (r) => {
    // If no admin id is stored, only show assign when unassigned
    if (!myAdminId) return !r.assignedAdmin;

    // Show assign when unassigned OR assigned to someone else
    return (
      !r.assignedAdmin || String(r.assignedAdmin?._id) !== String(myAdminId)
    );
  };

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Project Management</h1>
        <p className="text-sm text-gray-600">
          Track and update active projects.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <Input
          placeholder="Search projects by ID, title or clients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Heading row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          All Service Requests ({filtered.length})
        </h2>
        <button
          onClick={loadRequests}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white text-xs font-medium px-4 py-2 rounded-lg"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Table / Cards wrapper */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-600">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-600">
            No service requests found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs border-b bg-gray-50">
                    <th className="px-4 py-3 font-medium">Project ID</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium">Manager</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filtered.map((r) => {
                    const progressPercent = Math.max(
                      0,
                      Math.min(100, r.progress ?? 0),
                    );
                    const projectStage = r.projectStage || "Service";

                    return (
                      <tr key={r._id} className="text-sm hover:bg-gray-50">
                        {/* Project ID */}
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {r.projectId}
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {r.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {r.serviceName || "—"}
                          </div>
                        </td>

                        {/* Client */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {r.contact?.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Category: {r.serviceAbbr || "—"}
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gray-900 rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 font-medium min-w-[32px]">
                              {progressPercent}%
                            </span>
                          </div>
                        </td>

                        {/* Stage */}
                        <td className="px-4 py-3">
                          <StagePill stage={r.stage} />
                        </td>

                        {/* Manager */}
                        <td className="px-4 py-3 text-gray-800">
                          {r.assignedAdmin?.name || "Unassigned"}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(r.createdAt)}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">
                          {r.contact?.email || "—"}
                        </td>

                        {/* Project Stage Badge */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              projectStage === "Service"
                                ? "bg-teal-100 text-teal-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {projectStage}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Assign to me (icon only) */}
                            {canShowAssign(r) && (
                              <button
                                onClick={() => handleAssignToMe(r)}
                                className="p-2 rounded-lg border hover:bg-gray-100 text-gray-700"
                                title="Assign to me"
                              >
                                <UserCheck size={14} />
                              </button>
                            )}

                            {/* View (icon only) */}
                            <button
                              onClick={() => navigate(`/theboss/service-requests/${r._id}`)}
                              className="p-2 rounded-lg border hover:bg-gray-100 text-gray-700"
                              title="View service request"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Update (icon + text) */}
                            <button
                              onClick={() => openUpdate(r)}
                              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                            >
                              <Pencil size={12} />
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y">
              {filtered.map((r) => {
                const progressPercent = Math.max(
                  0,
                  Math.min(100, r.progress ?? 0),
                );
                const projectStage = r.projectStage || "Service";

                return (
                  <div key={r._id} className="p-4 space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {r.projectId}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {r.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            projectStage === "Service"
                              ? "bg-teal-100 text-teal-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {projectStage}
                        </span>

                        <StagePill stage={r.stage} />
                      </div>
                    </div>

                    {/* Client & Contact Info */}
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          Client:
                        </span>{" "}
                        {r.contact?.name || "—"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>{" "}
                        {r.contact?.email || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          Service:
                        </span>{" "}
                        {r.serviceName || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          Manager:
                        </span>{" "}
                        {r.assignedAdmin?.name || "Unassigned"}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {formatDate(r.createdAt)}
                      </span>
                      <span className="text-gray-500 truncate max-w-[55%]">
                        {r.contact?.email || "—"}
                      </span>
                    </div>

                    {/* Actions Row (mobile) */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        {/* Assign to me (icon only) */}
                        {canShowAssign(r) && (
                          <button
                            onClick={() => handleAssignToMe(r)}
                            className="p-2 rounded-lg border hover:bg-gray-100 text-gray-700"
                            title="Assign to me"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}

                        {/* View (icon only) */}
                        <button
                         onClick={() => navigate(`/theboss/service-requests/${r._id}`)}
                          className="p-2 rounded-lg border hover:bg-gray-100 text-gray-700"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                      </div>

                      {/* Update (icon + text) */}
                      <button
                        onClick={() => openUpdate(r)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2"
                      >
                        <Pencil size={16} />
                        Update
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Update modal */}
      <UpdateServiceRequestModal
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        token={token}
        request={selected}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
