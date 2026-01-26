import express from "express";
import {
  initPaystackPayment,
  verifyPaystackPayment,
  paystackWebhook,
} from "../controllers/payment.paystack.controller.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

/**
 * ✅ INIT
 * - Logged-in user: /initialize (requires token)
 * - Guest user: /initialize/guest (requires email)
 */
router.post("/paystack/initialize", userAuthMiddleware, initPaystackPayment);
router.post("/paystack/initialize/guest", initPaystackPayment);

/**
 * ✅ VERIFY
 * Must be PUBLIC (Paystack redirect won’t include your token reliably)
 */
router.get("/paystack/verify", verifyPaystackPayment);

/**
 * ✅ WEBHOOK (PUBLIC)
 */
router.post("/paystack/webhook", paystackWebhook);

export default router;

