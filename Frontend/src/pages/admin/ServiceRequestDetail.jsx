import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  fetchServiceRequestByIdAdmin,
} from "@/services/serviceRequestService";

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
      setReqData(result?.data || null);
    } catch (err) {
      toast.error(err.message || "Failed to load service request");
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
      <div className="p-6">
        <div className="text-sm text-gray-600">
          {loading ? "Loading..." : "No data found."}
        </div>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  const details = reqData.details || {};
  const contact = reqData.contact || {};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500">Service Request</p>
          <h1 className="text-2xl font-semibold">{reqData.title}</h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-700">{reqData.projectId}</span>
            <StagePill stage={reqData.stage} />
          </div>

          <p className="text-sm text-gray-600 mt-2">{reqData.serviceName}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            className="bg-[#FF8D28] hover:bg-orange-600 text-white"
            onClick={() => setUpdateOpen(true)}
          >
            Update
          </Button>
        </div>
      </div>

      {/* Progress block */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Progress</p>
          <p className="text-sm">{reqData.progress || 0}%</p>
        </div>
        <div className="h-2 bg-gray-200 rounded mt-2">
          <div
            className="h-2 bg-black rounded"
            style={{ width: `${reqData.progress || 0}%` }}
          />
        </div>

        <div className="flex items-center gap-3 mt-3 text-sm text-gray-700">
          <div>
            <span className="text-gray-500">Project Stage:</span>{" "}
            {reqData.projectStage}
          </div>
          <div>
            <span className="text-gray-500">Manager:</span>{" "}
            {reqData?.assignedAdmin?.name || "Unassigned"}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Contact Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">Name:</span> {contact.name}</div>
          <div><span className="text-gray-500">Email:</span> {contact.email}</div>
          <div><span className="text-gray-500">Tel:</span> {contact.tel}</div>
          <div>
            <span className="text-gray-500">Company:</span>{" "}
            {contact.companyName || "—"}
          </div>
          <div><span className="text-gray-500">Location:</span> {reqData.location}</div>
          <div>
            <span className="text-gray-500">Address:</span>{" "}
            {reqData.locationAddress || "—"}
          </div>
          <div><span className="text-gray-500">Timeline:</span> {reqData.timeline}</div>
        </div>
      </div>

      {/* Project Scope */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">Project Scope</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {reqData.projectScope}
        </p>
      </div>

      {/* Service-Specific Answers (PMR for now) */}
      {reqData.serviceType === "project_management_resourcing" && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-3">Project Management & Resourcing</h2>

          <div className="space-y-3 text-sm text-gray-800">
            <div>
              <p className="text-gray-500">
                What specific project management services are you currently seeking?
              </p>
              <p className="mt-1">{details.pm_service || "—"}</p>
            </div>

            <div>
              <p className="text-gray-500">Estimated budget range?</p>
              <p className="mt-1">{details.pm_budget || "—"}</p>
            </div>

            <div>
              <p className="text-gray-500">
                If seeking Human Resource/Resourcing/Consultation, what key roles?
              </p>
              <p className="mt-1">{details.pm_resourcing || "—"}</p>
            </div>

            <div>
              <p className="text-gray-500">
                Have you secured financing or necessary permits?
              </p>
              <p className="mt-1">{details.pm_financing || "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Update Note</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
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
          // updated may come wrapped; normalize:
          const next = updated?.data ? updated.data : updated;
          setReqData(next);
        }}
      />
    </div>
  );
}
