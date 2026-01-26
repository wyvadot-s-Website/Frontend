import Notification from "../models/Notification.js";

// ADMIN
export const getAdminNotifications = async (req, res) => {
  const adminId = req.admin?._id || req.admin?.id;
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const q = { recipientType: "admin", recipientAdmin: adminId };

  const [items, total, unread] = await Promise.all([
    Notification.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(q),
    Notification.countDocuments({ ...q, isRead: false }),
  ]);

  res.json({ success: true, items, total, unread, page, limit });
};

export const markAdminNotificationsRead = async (req, res) => {
  const adminId = req.admin?._id || req.admin?.id;
  const { ids, all } = req.body || {};

  const q = { recipientType: "admin", recipientAdmin: adminId, isRead: false };

  if (all === true) {
    await Notification.updateMany(q, { $set: { isRead: true, readAt: new Date() } });
    return res.json({ success: true, message: "All marked as read" });
  }

  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ success: false, message: "ids[] or all=true is required" });
  }

  await Notification.updateMany(
    { ...q, _id: { $in: ids } },
    { $set: { isRead: true, readAt: new Date() } }
  );

  res.json({ success: true, message: "Marked as read" });
};

// USER
export const getUserNotifications = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const q = { recipientType: "user", recipientUser: userId };

  const [items, total, unread] = await Promise.all([
    Notification.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(q),
    Notification.countDocuments({ ...q, isRead: false }),
  ]);

  res.json({ success: true, items, total, unread, page, limit });
};

export const markUserNotificationsRead = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { ids, all } = req.body || {};

  const q = { recipientType: "user", recipientUser: userId, isRead: false };

  if (all === true) {
    await Notification.updateMany(q, { $set: { isRead: true, readAt: new Date() } });
    return res.json({ success: true, message: "All marked as read" });
  }

  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ success: false, message: "ids[] or all=true is required" });
  }

  await Notification.updateMany(
    { ...q, _id: { $in: ids } },
    { $set: { isRead: true, readAt: new Date() } }
  );

  res.json({ success: true, message: "Marked as read" });
};