import express from "express";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import { getProductReviews, upsertReview, deleteMyReview } from "../controllers/review.controller.js";

const router = express.Router();

router.get("/products/:productId/reviews", getProductReviews);
router.post("/products/:productId/reviews", userAuthMiddleware, upsertReview);
router.delete("/products/:productId/reviews/mine", userAuthMiddleware, deleteMyReview);

export default router;