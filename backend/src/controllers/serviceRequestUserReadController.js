// controllers/serviceRequestUserReadController.js
import ServiceRequest from "../models/ServiceRequest.js";

const adminPopulate = { path: "assignedAdmin", select: "name email role" };

export const getMyServiceRequests = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const docs = await ServiceRequest.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate(adminPopulate);

    return res.json({ data: docs });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to load your service requests", error: err.message });
  }
};

export const getMyServiceRequestById = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const doc = await ServiceRequest.findOne({ _id: id, user: userId }).populate(
      adminPopulate
    );

    if (!doc) return res.status(404).json({ message: "Service request not found" });

    return res.json({ data: doc });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to load service request", error: err.message });
  }
};
