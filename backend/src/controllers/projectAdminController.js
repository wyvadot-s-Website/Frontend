import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

/**
 * CREATE PROJECT (MAX 4)
 */
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required",
      });
    }

    const count = await Project.countDocuments();
    if (count >= 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 4 projects allowed",
      });
    }

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "projects" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(req.file.buffer);
    });

    const project = await Project.create({
      title,
      description,
      image: {
        url: upload.secure_url,
        publicId: upload.public_id,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET PROJECTS (ADMIN)
 */
export const getProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE PROJECT
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(project.image.publicId);

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "projects" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      project.image = {
        url: upload.secure_url,
        publicId: upload.public_id,
      };
    }

    project.title = title ?? project.title;
    project.description = description ?? project.description;

    await project.save();

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE PROJECT
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await cloudinary.uploader.destroy(project.image.publicId);
    await project.deleteOne();

    res.json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
