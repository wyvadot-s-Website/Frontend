// controllers/serviceRequestAdminController.js
import ServiceRequest, { STAGE, PROJECT_STAGE } from "../models/ServiceRequest.js";
import { notifyUser } from "../utils/notify.js";

const userPopulate = { path: "user", select: "firstName lastName email" };
const adminPopulate = { path: "assignedAdmin", select: "name email role" };

export const getAllServiceRequestsAdmin = async (req, res) => {
  try {
    const docs = await ServiceRequest.find()
      .sort({ createdAt: -1 })
      .populate(userPopulate)
      .populate(adminPopulate);

    return res.json({ data: docs });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to load service requests", error: err.message });
  }
};

export const getServiceRequestByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await ServiceRequest.findById(id)
      .populate(userPopulate)
      .populate(adminPopulate);

    if (!doc) {
      return res.status(404).json({ message: "Service request not found" });
    }

    return res.json({ data: doc });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to load service request", error: err.message });
  }
};

/**
 * PATCH /api/admin/service-requests/:id
 * updates:
 * - progress (0-100)
 * - stage (must be in STAGE)
 * - projectStage ("Project" | "Service")
 * - assignedAdmin (Admin id)
 * - adminNotes (string)
 */
export const updateServiceRequestAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, stage, projectStage, assignedAdmin, adminNotes } = req.body;

    const updates = {};

    if (progress !== undefined) {
      const p = Number(progress);
      if (Number.isNaN(p) || p < 0 || p > 100) {
        return res
          .status(400)
          .json({ message: "progress must be a number between 0 and 100" });
      }
      updates.progress = p;
    }

    if (stage !== undefined) {
      if (!STAGE.includes(stage)) {
        return res.status(400).json({
          message: `Invalid stage. Allowed: ${STAGE.join(", ")}`,
        });
      }
      updates.stage = stage;
    }

    if (projectStage !== undefined) {
      if (!PROJECT_STAGE.includes(projectStage)) {
        return res.status(400).json({
          message: `Invalid projectStage. Allowed: ${PROJECT_STAGE.join(", ")}`,
        });
      }
      updates.projectStage = projectStage;
    }

    if (assignedAdmin !== undefined) {
      updates.assignedAdmin = assignedAdmin || null;
    }

    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes;
    }

    const doc = await ServiceRequest.findByIdAndUpdate(id, updates, { new: true })
      .populate(userPopulate)
      .populate(adminPopulate);

    // ✅ FIX 1: check doc exists BEFORE notify
    if (!doc) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // ✅ notify user after successful update
    if (doc?.user) {
      await notifyUser({
        userId: doc.user?._id || doc.user,
        scope: "service",
        title: "Service Updated",
        message: `${doc.projectId} has been updated. Stage: ${doc.stage} • Progress: ${doc.progress}%`,
        link: `/home`, // replace with your tracking page if you have one
        meta: { projectId: doc.projectId, serviceRequestId: String(doc._id) },
      });
    }

    return res.json({ message: "Service request updated", data: doc });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update service request",
      error: err.message,
    });
  }
};

/**
 * PATCH /api/admin/service-requests/:id/accept
 * convenience: assign current admin + stage -> "Site Visit" (validated)
 */
export const acceptServiceRequestAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin?.id || req.admin?._id;

    const doc = await ServiceRequest.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Service request not found" });
    }

    if (adminId) doc.assignedAdmin = adminId;

    // ✅ FIX 2: ensure stage is valid
    const nextStage = "Site Visit";
    if (!STAGE.includes(nextStage)) {
      return res.status(400).json({
        message: `Invalid stage "${nextStage}". Allowed: ${STAGE.join(", ")}`,
      });
    }

    doc.stage = nextStage;
    await doc.save();

    const updated = await ServiceRequest.findById(id)
      .populate(userPopulate)
      .populate(adminPopulate);

    if (doc?.user) {
      await notifyUser({
        userId: doc.user?._id || doc.user,
        scope: "service",
        title: "Service Accepted",
        message: `${doc.projectId} has been updated. Stage: ${doc.stage} • Progress: ${doc.progress}%`,
        link: `/home`, // replace with your tracking page if you have one
        meta: { projectId: doc.projectId, serviceRequestId: String(doc._id) },
      });
    }

    return res.json({ message: "Service request accepted", data: updated });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to accept service request",
      error: err.message,
    });
  }
};

/**
 * PATCH /api/admin/service-requests/:id/reject
 * sets stage -> "Rejected" and requires adminNotes
 */
export const rejectServiceRequestAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    if (!adminNotes || String(adminNotes).trim().length < 3) {
      return res
        .status(400)
        .json({ message: "adminNotes is required to reject a request" });
    }

    const doc = await ServiceRequest.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // (optional) validate "Rejected" is part of STAGE if your model enforces it
    if (STAGE.includes("Rejected")) {
      doc.stage = "Rejected";
    } else {
      // fallback: keep stage unchanged if "Rejected" isn't allowed in your STAGE
      // but still record adminNotes + reset progress
      // If you want it enforced, replace this fallback with a 400 response.
    }

    doc.progress = 0;
    doc.adminNotes = adminNotes;

    await doc.save();

    const updated = await ServiceRequest.findById(id)
      .populate(userPopulate)
      .populate(adminPopulate);

    return res.json({ message: "Service request rejected", data: updated });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to reject service request",
      error: err.message,
    });
  }
};