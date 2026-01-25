import express from "express";
import { createOrder, trackOrder } from "../controllers/order.public.controller.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders/track", trackOrder);

export default router;
