import Admin from "../models/Admin.js";
import Notification from "../models/Notification.js";

export const notifyAdminsByRoles = async ({
  roles = [],
  scope = "system",
  title,
  message,
  link = "",
  meta = {},
}) => {
  const admins = await Admin.find({
    isVerified: true,
    role: { $in: roles },
  }).select("_id");

  if (!admins.length) return;

  const docs = admins.map((a) => ({
    recipientType: "admin",
    recipientAdmin: a._id,
    scope,
    title,
    message,
    link,
    meta,
  }));

  await Notification.insertMany(docs);
};

export const notifyUser = async ({
  userId,
  scope = "system",
  title,
  message,
  link = "",
  meta = {},
}) => {
  if (!userId) return;

  await Notification.create({
    recipientType: "user",
    recipientUser: userId,
    scope,
    title,
    message,
    link,
    meta,
  });
};