// routes/serviceRequestUserReadRoutes.js
import express from "express";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

import {
  getMyServiceRequests,
  getMyServiceRequestById,
} from "../controllers/serviceRequestUserReadController.js";

const router = express.Router();

// user-only
router.get("/mine", userAuthMiddleware, getMyServiceRequests);
router.get("/:id", userAuthMiddleware, getMyServiceRequestById);

export default router;
