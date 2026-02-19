import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  updateServiceRequestAdmin,
} from "@/services/serviceRequestService";

const STAGES = [
  "Pending",
  "Site Visit",
  "Documentation",
  "Execution",
  "Review",
  "Completed",
  "Rejected",
];

const PROJECT_STAGES = ["Project", "Service"];

export default function UpdateServiceRequestModal({
  open,
  onClose,
  token,
  request,
  onUpdated,
}) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Pending");
  const [projectStage, setProjectStage] = useState("Service");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (!request) return;
    setProgress(request.progress ?? 0);
    setStage(request.stage || "Pending");
    setProjectStage(request.projectStage || "Service");
    setAdminNotes(request.adminNotes || "");
  }, [request]);

  const handleSave = async () => {
    if (!token) return toast.error("Admin token missing. Please login again.");
    if (!request?._id) return toast.error("Missing request id.");

    const p = Number(progress);
    if (Number.isNaN(p) || p < 0 || p > 100) {
      return toast.error("Progress must be between 0 and 100.");
    }

    if (!STAGES.includes(stage)) {
      return toast.error("Invalid stage selected.");
    }

    if (!PROJECT_STAGES.includes(projectStage)) {
      return toast.error("Invalid project stage selected.");
    }

    const toastId = toast.loading("Saving update...");

    try {
      const result = await updateServiceRequestAdmin(
        request._id,
        {
          progress: p,
          stage,
          projectStage,
          adminNotes,
        },
        token
      );

      toast.success("Update saved", { id: toastId });

      onUpdated?.(result?.data || result);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to save update", { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* ✅ Fixed: Added max height and flex layout */}
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Update Project Progress</DialogTitle>
          <p className="text-xs text-gray-600 mt-1">
            {request?.projectId} — {request?.title}
          </p>
        </DialogHeader>

        {/* ✅ Scrollable content area */}
        <div className="overflow-y-auto flex-1 pr-2">
          <div className="space-y-4 py-4">
            {/* Progress */}
            <div className="space-y-2">
              <Label>Progress (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-black rounded"
                  style={{ width: `${Math.max(0, Math.min(100, Number(progress) || 0))}%` }}
                />
              </div>
            </div>

            {/* Current Stage */}
            <div className="space-y-2">
              <Label>Current Stage</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Stage */}
            <div className="space-y-2">
              <Label>Project Stage</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={projectStage}
                onChange={(e) => setProjectStage(e.target.value)}
              >
                {PROJECT_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Update Note */}
            <div className="space-y-2">
              <Label>Update Note</Label>
              <Textarea
                placeholder="Describe what has been done"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* ✅ Fixed footer - stays at bottom */}
        <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-[#FF8D28] hover:bg-orange-600 text-white"
          >
            Save Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}