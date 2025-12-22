import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// GET all projects (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Fetch projects error:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

export default router;
