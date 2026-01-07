import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import protectAdmin from "../middleware/authMiddleware.js";
import { sendAdminVerificationEmail } from "../config/email.js";

dotenv.config();

const router = express.Router();

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==============================
// ADMIN SIGNUP
// ==============================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔐 Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await Admin.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: hashedOTP,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // 📩 Send OTP to CONTROL EMAIL (EMAIL_USER)
    await sendAdminVerificationEmail(otp, process.env.ADMIN_CONTROL_EMAIL);

    res.status(201).json({
      message: "Verification code sent for admin approval"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// VERIFY ADMIN OTP
// ==============================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.isVerified) {
      return res.status(400).json({ message: "Admin already verified" });
    }

    if (
      !admin.verificationTokenExpires ||
      admin.verificationTokenExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    const isValidCode = await bcrypt.compare(
      code,
      admin.verificationToken
    );

    if (!isValidCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // ✅ Verify admin
    admin.isVerified = true;
    admin.verificationToken = undefined;
    admin.verificationTokenExpires = undefined;
    await admin.save();

    res.json({
      message: "Admin verified successfully. Please log in."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// ADMIN LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.isVerified) {
      return res.status(403).json({
        message: "Admin not verified yet"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// TEST PROTECTED ROUTE
// ==============================
router.get("/profile", protectAdmin, (req, res) => {
  res.json({
    message: "Admin profile accessed",
    admin: req.admin
  });
});

export default router;
