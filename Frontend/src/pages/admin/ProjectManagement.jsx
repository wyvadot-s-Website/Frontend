import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

    try {
      const res = await acceptServiceRequestAdmin(token, reqItem._id);
      const updated = res?.data;

      if (updated?._id) {
        setRequests((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r)),
        );
        toast.success("Assigned to you");
      } else {
        // fallback refresh
        await loadRequests();
        toast.success("Assigned to you");
      }
    } catch (err) {
      toast.error(err.message || "Failed to assign");
    }
  };

  const openUpdate = (req) => {
    setSelected(req);
    setUpdateOpen(true);
  };

  const handleUpdated = (updated) => {
    // updated may come as {message, data}
    const next = updated?.data ? updated.data : updated;
    if (!next?._id) return;

    setRequests((prev) => prev.map((r) => (r._id === next._id ? next : r)));
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

      {/* Table heading row */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          All Service Requests ({filtered.length})
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadRequests} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
          <div className="col-span-2">Project ID</div>
          <div className="col-span-2">Title</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-1">Progress</div>
          <div className="col-span-1">Stage</div>
          <div className="col-span-2">Manager</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1">Email</div>
        </div>

        {/* Body */}
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">
            {loading ? "Loading..." : "No service requests found."}
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r._id}
              className="grid grid-cols-12 px-3 py-3 text-sm border-t items-center gap-2"
            >
              {/* Project ID */}
              <div className="col-span-2 font-medium">{r.projectId}</div>

              {/* Title */}
              <div className="col-span-2">{r.title}</div>

              {/* Client */}
              <div className="col-span-2">
                <div className="font-medium">{r.contact?.name || "—"}</div>
                <div className="text-xs text-gray-600">
                  Category: {r.serviceAbbr || "—"}
                </div>
              </div>

              {/* Progress */}
              <div className="col-span-1">
                <div className="text-xs font-medium">{r.progress ?? 0}%</div>
                <div className="h-1.5 bg-gray-200 rounded mt-1">
                  <div
                    className="h-1.5 bg-black rounded"
                    style={{
                      width: `${Math.max(0, Math.min(100, r.progress ?? 0))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Stage */}
              <div className="col-span-1">
                <StagePill stage={r.stage} />
              </div>

              {/* Manager */}
              <div className="col-span-2">
                {r.assignedAdmin?.name || "Unassigned"}
              </div>

              {/* Date */}
              <div className="col-span-1">{formatDate(r.createdAt)}</div>

              {/* Email */}
              <div className="col-span-1 truncate">
                {r.contact?.email || "—"}
              </div>

              {/* Actions (overlay style like screenshot) */}
              <div className="col-span-12 flex justify-end gap-2 mt-2">
                {!r.assignedAdmin ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignToMe(r)}
                  >
                    Assign to me
                  </Button>
                ) : null}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/theboss/service-requests/${r._id}`)}
                >
                  View
                </Button>

                <Button
                  size="sm"
                  className="bg-[#FF8D28] hover:bg-orange-600 text-white"
                  onClick={() => openUpdate(r)}
                >
                  Update
                </Button>
              </div>
            </div>
          ))
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
