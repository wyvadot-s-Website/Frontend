import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProject,
  getAllProjects,
  deleteProject,
} from "../controllers/projectController.js";


const router = express.Router();

// Admin only
router.use(authMiddleware);

// Create project
router.post("/", createProject);

// Get all projects
router.get("/", getAllProjects);

// Delete project
router.delete("/:id", deleteProject);

export default router;
