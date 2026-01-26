import express from "express";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import { getMyOrders, getMyOrderById, claimMyGuestOrders } from "../controllers/order.user.controller.js";
import { createOrder } from "../controllers/order.public.controller.js";

const router = express.Router();

/**
 * Logged-in:
 * - create order (same createOrder controller, but with middleware so req.user exists)
 * - list my orders
 */
router.post("/orders", userAuthMiddleware, createOrder);
router.get("/orders", userAuthMiddleware, getMyOrders);
router.get("/orders/:id", userAuthMiddleware, getMyOrderById);
router.post("/orders/claim", userAuthMiddleware, claimMyGuestOrders);

export default router;
