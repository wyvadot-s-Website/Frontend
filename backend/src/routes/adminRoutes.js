import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import protectAdmin from "../middleware/authMiddleware.js";
import { sendAdminVerificationEmail } from "../config/email.js";
import { ADMIN_ROLES } from "../models/Admin.js";

dotenv.config();

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ==============================
// ADMIN SIGNUP (role-based)
// ==============================
router.post("/signup", async (req, res) => {
  try {
    console.log("📨 Signup request received:", req.body);
    
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!ADMIN_ROLES.includes(role)) {
      console.log("❌ Invalid role:", role);
      return res.status(400).json({ message: "Invalid admin role" });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log("❌ Admin already exists");
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    console.log("✅ Creating admin...");
    await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationToken: hashedOTP,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000,
    });

    console.log("📧 Sending email with OTP:", otp);
    await sendAdminVerificationEmail({
      code: otp,
      requestedName: name,
      requestedEmail: email,
      requestedRole: role,
    });

    console.log("✅ Signup successful");
    return res.status(201).json({ message: "Verification code sent for admin approval" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ==============================
// VERIFY ADMIN OTP (POST)
// ==============================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.isVerified) return res.status(400).json({ message: "Admin already verified" });

    if (!admin.verificationTokenExpires || admin.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    const isValidCode = await bcrypt.compare(code, admin.verificationToken);
    if (!isValidCode) return res.status(400).json({ message: "Invalid verification code" });

    admin.isVerified = true;
    admin.verificationToken = undefined;
    admin.verificationTokenExpires = undefined;
    await admin.save();

    res.json({ message: "Admin verified successfully. Please log in." });
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

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    if (!admin.isVerified) return res.status(403).json({ message: "Admin not verified yet" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==============================
// PROFILE
// ==============================
router.get("/profile", protectAdmin, (req, res) => {
  res.json({ message: "Admin profile accessed", admin: req.admin });
});

export default router;
