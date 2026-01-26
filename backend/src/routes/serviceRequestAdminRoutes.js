// routes/serviceRequestAdminRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getAllServiceRequestsAdmin,
  getServiceRequestByIdAdmin,
  updateServiceRequestAdmin,
  acceptServiceRequestAdmin,
  rejectServiceRequestAdmin,
} from "../controllers/serviceRequestAdminController.js";

const router = express.Router();


router.get("/", authMiddleware, getAllServiceRequestsAdmin);
router.get("/:id", authMiddleware, getServiceRequestByIdAdmin);

router.patch("/:id", authMiddleware, updateServiceRequestAdmin);
router.patch("/:id/accept", authMiddleware, acceptServiceRequestAdmin);
router.patch("/:id/reject", authMiddleware, rejectServiceRequestAdmin);

export default router;

