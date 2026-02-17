import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  googleAuth,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  resendVerificationCode,  // ✅ ADD THIS
} from "../controllers/userController.js";
import {
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

// public routes
router.post("/signup", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.put("/profile", userAuthMiddleware, updateProfile);
router.put("/change-password", userAuthMiddleware, changePassword);
// userRoutes.js - ADD
router.post("/resend-verification", resendVerificationCode);

// protected route
router.get("/me", userAuthMiddleware, (req, res) => {
  res.status(200).json({
    message: "User authenticated successfully",
    user: req.user,
  });
});

export default router;
