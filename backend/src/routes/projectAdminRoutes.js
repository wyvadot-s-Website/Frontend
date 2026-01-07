import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

import {
  createProject,
  getProjectsAdmin,
  updateProject,
  deleteProject,
} from "../controllers/projectAdminController.js";

const router = express.Router();

// ================= ADMIN ONLY =================
router.use(protectAdmin);

// CREATE PROJECT (max 4 handled in controller)
router.post(
  "/projects",
  upload.single("image"),
  createProject
);

// GET ALL PROJECTS (ADMIN)
router.get(
  "/projects",
  getProjectsAdmin
);

// UPDATE PROJECT
router.put(
  "/projects/:id",
  upload.single("image"),
  updateProject
);

// DELETE PROJECT
router.delete(
  "/projects/:id",
  deleteProject
);

export default router;
