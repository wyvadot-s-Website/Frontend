import express from "express";
import { getProjectsPublic } from "../controllers/projectPublicController.js";

const router = express.Router();

// PUBLIC PROJECTS
router.get("/projects", getProjectsPublic);

export default router;

