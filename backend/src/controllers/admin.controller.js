// controllers/admin.controller.js
import Admin from "../models/Admin.js";
import cloudinary from "../config/cloudinary.js";

export const getAdminMe = async (req, res) => {
  try {
    return res.json({ success: true, admin: req.admin });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAdminAvatar = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image uploaded" });

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.avatar?.publicId) {
      await cloudinary.uploader.destroy(admin.avatar.publicId);
    }

    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "avatars/admins", width: 300, height: 300, crop: "fill" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(file.buffer);
    });

    admin.avatar = { url: uploaded.secure_url, publicId: uploaded.public_id };
    await admin.save();

    res.json({ message: "Avatar updated", avatar: admin.avatar });
  } catch (e) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

export const deleteAdminAvatar = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.avatar?.publicId) {
      await cloudinary.uploader.destroy(admin.avatar.publicId);
    }

    admin.avatar = { url: "", publicId: "" };
    await admin.save();

    res.json({ message: "Avatar removed" });
  } catch (e) {
    res.status(500).json({ message: "Failed to remove avatar" });
  }
};