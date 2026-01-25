// routes/serviceRequestUserRoutes.js
import express from "express";
import { createServiceRequest } from "../controllers/serviceRequestUserController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();


 router.post("/", userAuthMiddleware, createServiceRequest);

export default router;

