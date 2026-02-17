import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchServiceRequestByIdAdmin } from "@/services/serviceRequestService";
import UpdateServiceRequestModal from "@/components/admin/UpdateServiceRequestModal";

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

/** Optional nicer labels (add more anytime) */
const LABELS = {
  project_management_resourcing: {
    pm_service: "Project management service needed",
    pm_budget: "Estimated budget range",
    pm_resourcing: "Key roles needed",
    pm_financing: "Financing/permits secured?",
  },
  core_engineering_construction: {
    ce_description: "Project description",
    ce_design: "Design details / plan",
    ce_cost: "Estimated cost/budget",
    ce_materials: "Materials preference / availability",
  },
};

function humanizeKey(key, serviceType) {
  const map = LABELS[serviceType];
  if (map?.[key]) return map[key];

  const parts = String(key || "").split("_");
  const text = parts.length > 1 ? parts.slice(1).join(" ") : parts.join(" ");
  return text
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function renderValue(v) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;

  if (Array.isArray(v)) {
    if (v.length === 0) return "—";
    const primitives = v.every(
      (x) => ["string", "number", "boolean"].includes(typeof x) || x == null
    );
    if (primitives) return v.map((x) => renderValue(x)).join(", ");
    return JSON.stringify(v, null, 2);
  }

  if (isPlainObject(v)) return JSON.stringify(v, null, 2);

  return String(v);
}

export default function ServiceRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  const [reqData, setReqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const load = async () => {
    if (!token) return toast.error("Admin token missing. Please login again.");
    if (!id) return toast.error("Missing request id.");

    setLoading(true);
    try {
      const result = await fetchServiceRequestByIdAdmin(id, token);
      const doc = result?.data || result?.serviceRequest || result;
      setReqData(doc || null);
    } catch (err) {
      toast.error(err?.message || "Failed to load service request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !reqData) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-sm text-gray-600">
          {loading ? "Loading..." : "No data found."}
        </div>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  const contact = reqData.contact || {};
  const serviceType = reqData.serviceType || "unknown";

  const detailsRaw = reqData.details;
  const details =
    typeof detailsRaw === "string"
      ? (() => {
          try {
            return JSON.parse(detailsRaw);
          } catch {
            return {};
          }
        })()
      : detailsRaw || {};

  const detailEntries =
    details && typeof details === "object"
      ? Object.entries(details).filter(([k]) => k !== "__v")
      : [];

  const progressPercent = Math.max(0, Math.min(100, Number(reqData.progress ?? 0)));

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">Service Request</p>
          <h1 className="text-xl sm:text-2xl font-semibold break-words">
            {reqData.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-gray-700 break-all">
              {reqData.projectId}
            </span>
            <StagePill stage={reqData.stage} />
          </div>

          <p className="text-sm text-gray-600 mt-2 break-words">
            {reqData.serviceName}
          </p>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            className="flex-1 sm:flex-none bg-[#FF8D28] hover:bg-orange-600 text-white"
            onClick={() => setUpdateOpen(true)}
          >
            Update
          </Button>
        </div>
      </div>

      {/* Progress block */}
      <div className="border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Progress</p>
          <p className="text-sm">{progressPercent}%</p>
        </div>

        <div className="h-2 bg-gray-200 rounded mt-2">
          <div
            className="h-2 bg-black rounded"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
          <div className="break-words">
            <span className="text-gray-500">Project Stage:</span>{" "}
            {reqData.projectStage || "—"}
          </div>
          <div className="break-words">
            <span className="text-gray-500">Manager:</span>{" "}
            {reqData?.assignedAdmin?.name || "Unassigned"}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="border rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-3">Contact Details</h2>

        {/* Mobile-first: single column. Sm+: 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="break-words">
            <span className="text-gray-500">Name:</span> {contact.name || "—"}
          </div>
          <div className="break-words">
            <span className="text-gray-500">Email:</span> {contact.email || "—"}
          </div>
          <div className="break-words">
            <span className="text-gray-500">Tel:</span> {contact.tel || "—"}
          </div>
          <div className="break-words">
            <span className="text-gray-500">Company:</span>{" "}
            {contact.companyName || "—"}
          </div>
          <div className="break-words">
            <span className="text-gray-500">Location:</span>{" "}
            {reqData.location || "—"}
          </div>
          <div className="break-words">
            <span className="text-gray-500">Address:</span>{" "}
            {reqData.locationAddress || "—"}
          </div>

          {/* Let Timeline span full width on small screens for cleaner layout */}
          <div className="sm:col-span-2 break-words">
            <span className="text-gray-500">Timeline:</span>{" "}
            {reqData.timeline || "—"}
          </div>
        </div>
      </div>

      {/* Project Scope */}
      <div className="border rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-3">Project Scope</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
          {reqData.projectScope || "—"}
        </p>
      </div>

      {/* Service Answers */}
      <div className="border rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h2 className="font-semibold">Service Answers</h2>
          <span className="text-xs text-gray-500 break-all">{serviceType}</span>
        </div>

        {detailEntries.length === 0 ? (
          <p className="text-sm text-gray-600">No service-specific answers.</p>
        ) : (
          <div className="space-y-4 text-sm text-gray-800">
            {detailEntries.map(([key, value]) => {
              const label = humanizeKey(key, serviceType);
              const isJson =
                isPlainObject(value) ||
                (Array.isArray(value) &&
                  value.some((x) => typeof x === "object" && x !== null));

              return (
                <div
                  key={key}
                  className="rounded-lg border bg-white p-3"
                >
                  <p className="text-gray-500 text-xs sm:text-sm">{label}</p>

                  {isJson ? (
                    <pre className="mt-2 whitespace-pre-wrap break-words bg-gray-50 border rounded p-2 text-xs text-gray-800 overflow-x-auto">
                      {renderValue(value)}
                    </pre>
                  ) : (
                    <p className="mt-2 break-words">{renderValue(value)}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Notes */}
      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Update Note</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
          {reqData.adminNotes || "—"}
        </p>
      </div>

      {/* Update modal */}
      <UpdateServiceRequestModal
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        token={token}
        request={reqData}
        onUpdated={(updated) => {
          const doc = updated?.data || updated?.serviceRequest || updated;
          setReqData(doc);
        }}
      />
    </div>
  );
}
