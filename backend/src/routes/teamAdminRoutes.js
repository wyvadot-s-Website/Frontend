import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

import {
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembersAdmin,
} from "../controllers/teamAdminController.js";

const router = express.Router();

router.get("/team", protectAdmin, getTeamMembersAdmin);
router.post("/team", protectAdmin, upload.single("image"), addTeamMember);
router.put("/team/:id", protectAdmin, upload.single("image"), updateTeamMember);
router.delete("/team/:id", protectAdmin, deleteTeamMember);

export default router;
