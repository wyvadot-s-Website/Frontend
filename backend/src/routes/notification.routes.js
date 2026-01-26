import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import {
  getAdminNotifications,
  markAdminNotificationsRead,
  getUserNotifications,
  markUserNotificationsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// admin
router.get("/admin", protectAdmin, getAdminNotifications);
router.patch("/admin/read", protectAdmin, markAdminNotificationsRead);

// user
router.get("/user", userAuthMiddleware, getUserNotifications);
router.patch("/user/read", userAuthMiddleware, markUserNotificationsRead);

export default router;