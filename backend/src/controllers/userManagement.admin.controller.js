// backend/controllers/userManagement.admin.controller.js

import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

const safeInt = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// ✅ GET USERS (all admins can access)
export const getUsersAdmin = async (req, res) => {
  try {
    const page = Math.max(1, safeInt(req.query.page, 1));
    const limit = Math.min(100, Math.max(1, safeInt(req.query.limit, 20)));
    const search = String(req.query.search || "").trim();

    const q = {};
    if (search) {
      q.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      User.find(q)
        .select(
          "firstName middleName lastName email phoneNumber country countryCode authProvider isVerified createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(q),
    ]);

    return res.json({
      success: true,
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET ADMINS (super_admin only)
export const getAdminsSuper = async (req, res) => {
  try {
    const page = Math.max(1, safeInt(req.query.page, 1));
    const limit = Math.min(100, Math.max(1, safeInt(req.query.limit, 20)));
    const search = String(req.query.search || "").trim();

    const q = {};
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Admin.find(q)
        .select("name email role isVerified createdAt") // never send password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Admin.countDocuments(q),
    ]);

    return res.json({
      success: true,
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ DELETE ADMIN (super_admin only) with protections
export const deleteAdminSuper = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(String(targetId))) {
      return res.status(400).json({ success: false, message: "Invalid admin id" });
    }

    // Block deleting yourself
    if (String(req.admin?._id) === String(targetId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const target = await Admin.findById(targetId);
    if (!target) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Block deleting the last super_admin
    if (target.role === "super_admin") {
      const superCount = await Admin.countDocuments({ role: "super_admin" });
      if (superCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the last super_admin",
        });
      }
    }

    await Admin.findByIdAndDelete(targetId);

    return res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
