import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { fetchMyServiceRequestById } from "@/services/userServiceRequestService";

function StagePill({ stage }) {
  const stageMap = {
    Documentation: "bg-orange-100 text-orange-600",
    Execution: "bg-blue-100 text-blue-600",
    Completed: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
    Pending: "bg-gray-100 text-gray-600",
    "Site Visit": "bg-purple-100 text-purple-600",
    Review: "bg-yellow-100 text-yellow-700",
  };

  const cls = stageMap[stage] || "bg-gray-100 text-gray-600";

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${cls}`}>
      {stage || "Pending"}
    </span>
  );
}

export default function ServiceRequestDetailModal({ open, onClose, token, requestId }) {
  const [loading, setLoading] = useState(false);
  const [reqData, setReqData] = useState(null);

  const load = async () => {
    if (!token || !requestId) return;

    setLoading(true);
    try {
      const result = await fetchMyServiceRequestById(requestId, token);
      setReqData(result?.data || null);
    } catch (err) {
      toast.error(err.message || "Failed to load service request");
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, requestId]);

  const progress = Math.max(0, Math.min(100, Number(reqData?.progress ?? 0)));
  const details = reqData?.details || {};
  const contact = reqData?.contact || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Service/Project Details
          </DialogTitle>
          <p className="text-xs text-gray-600 mt-1">
            {reqData?.projectId || "—"}
          </p>
        </DialogHeader>

        {loading || !reqData ? (
          <div className="py-8 text-sm text-gray-600">
            {loading ? "Loading..." : "No data found."}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top summary */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{reqData.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{reqData.serviceName}</p>
                </div>
                <StagePill stage={reqData.stage} />
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded mt-2">
                  <div
                    className="h-2 bg-gray-800 rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Manager:</span>{" "}
                    {reqData.assignedAdmin?.name || "Unassigned"}
                  </div>
                  <div>
                    <span className="text-gray-500">Project Stage:</span>{" "}
                    {reqData.projectStage || "Service"}
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>{" "}
                    {reqData.createdAt ? new Date(reqData.createdAt).toLocaleDateString() : "—"}
                  </div>
                  <div>
                    <span className="text-gray-500">Timeline:</span>{" "}
                    {reqData.timeline || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-3">Contact Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Name:</span> {contact.name || "—"}</div>
                <div><span className="text-gray-500">Email:</span> {contact.email || "—"}</div>
                <div><span className="text-gray-500">Tel:</span> {contact.tel || "—"}</div>
                <div><span className="text-gray-500">Company:</span> {contact.companyName || "—"}</div>
                <div><span className="text-gray-500">Location:</span> {reqData.location || "—"}</div>
                <div><span className="text-gray-500">Address:</span> {reqData.locationAddress || "—"}</div>
              </div>
            </div>

            {/* Project scope */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-3">Project Scope</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {reqData.projectScope || "—"}
              </p>
            </div>

            {/* Service-specific answers (PMR for now) */}
            {reqData.serviceType === "project_management_resourcing" && (
              <div className="border rounded-lg p-4">
                <p className="font-semibold mb-3">Project Management & Resourcing</p>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Service requested</p>
                    <p className="mt-1">{details.pm_service || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Budget</p>
                    <p className="mt-1">{details.pm_budget || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Resourcing / Roles</p>
                    <p className="mt-1">{details.pm_resourcing || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Financing / Permits</p>
                    <p className="mt-1">{details.pm_financing || "—"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin notes (updates) */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-3">Update Note</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {reqData.adminNotes || "—"}
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
