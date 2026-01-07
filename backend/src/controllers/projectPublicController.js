import Project from "../models/Project.js";

/**
 * GET PROJECTS (PUBLIC)
 * newest first
 */
export const getProjectsPublic = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(4);

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
