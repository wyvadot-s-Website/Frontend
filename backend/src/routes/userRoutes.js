import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  googleAuth,
  forgotPassword,
  verifyResetCode,
  resetPassword,
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


// protected route
router.get("/me", userAuthMiddleware, (req, res) => {
  res.status(200).json({
    message: "User authenticated successfully",
    user: req.user,
  });
});

export default router;

