// backend/routes/userManagement.admin.routes.js

import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import requireSuperAdmin from "../middleware/requireSuperAdmin.js";

import {
  getUsersAdmin,
  getAdminsSuper,
  deleteAdminSuper,
} from "../controllers/userManagement.admin.controller.js";

const router = express.Router();

// All admins can see users
router.get("/users", protectAdmin, getUsersAdmin);

// Only super admin can see admins + delete admins
router.get("/admins", protectAdmin, requireSuperAdmin, getAdminsSuper);
router.delete("/admins/:id", protectAdmin, requireSuperAdmin, deleteAdminSuper);

export default router;
