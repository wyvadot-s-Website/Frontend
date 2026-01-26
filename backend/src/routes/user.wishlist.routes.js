import express from "express";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/wishlist", userAuthMiddleware, getWishlist);
router.post("/wishlist/toggle", userAuthMiddleware, toggleWishlist);
router.delete("/wishlist/:productId", userAuthMiddleware, removeFromWishlist);

export default router;
