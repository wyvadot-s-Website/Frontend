// routes/admin.profile.routes.js
import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import { getAdminMe } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/me", protectAdmin, getAdminMe);

export default router;
