import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import { getAdminOrders, updateOrderAdmin, getAdminOrderById } from "../controllers/order.admin.controller.js";

const router = express.Router();

router.get("/orders", protectAdmin, getAdminOrders);
router.get("/orders/:id", protectAdmin, getAdminOrderById);
router.patch("/orders/:id", protectAdmin, updateOrderAdmin);

export default router;
