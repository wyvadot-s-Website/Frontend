import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const upload = await cloudinary.uploader.upload(image, {
      folder: "wyvadotpr/projects",
      quality: "auto",
      fetch_format: "auto",
    });

    const project = await Project.create({
      title,
      description,
      image: upload.secure_url,
      createdBy: req.admin._id,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Project creation failed" });
  }
};

// GET ALL PROJECTS (ADMIN)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
