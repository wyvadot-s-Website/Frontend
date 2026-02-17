import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../config/email.js";
import { OAuth2Client } from "google-auth-library";
import cloudinary from "../config/cloudinary.js";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER USER
// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      country,
      countryCode,
      phoneNumber,
      password,
    } = req.body;

    // ✅ ADD VALIDATION HERE - BEFORE creating user
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (!countryCode || !phoneNumber) {
      return res.status(400).json({ message: "Phone number and country code are required" });
    }

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Create user
    const user = await User.create({
      firstName,
      middleName: middleName || "",  // ✅ Handle optional fields
      lastName,
      email,
      country: country || "",  // ✅ Handle optional fields
      countryCode,
      phoneNumber,
      password: hashedPassword,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: Date.now() + 10 * 60 * 1000, // 10 mins
    });
    
    // 5. Send email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "Signup successful. Verification code sent.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Signup failed" });  // ✅ Show actual error
  }
};

// GOOGLE AUTHENTICATION
export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No Google token provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      given_name: firstName,
      family_name: lastName,
      picture,
    } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        googleId,
        isVerified: true,
        authProvider: "google",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Google authentication successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (
      user.emailVerificationCode !== code ||
      user.emailVerificationExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};


// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// REQUEST PASSWORD RESET
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // reuse email system
    await sendVerificationEmail(email, resetCode);

    res.json({ message: "Password reset code sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

// VERIFY RESET CODE
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordCode !== code ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    res.json({ message: "Reset code verified" });
  } catch (error) {
    console.error("Verify reset code error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordCode !== code ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Reset password failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstName) user.firstName = String(firstName).trim();
    if (lastName) user.lastName = String(lastName).trim();

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");
    res.json({ message: "Profile updated", user: safeUser });
  } catch (e) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Google accounts cannot change password here. Use 'Forgot Password' or set a password feature.",
      });
    }

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (e) {
    res.status(500).json({ message: "Password change failed" });
  }
};

// userController.js - ADD this
export const resendVerificationCode = async (req, res) => {
  try {``
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationCode = code;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    console.log(`📤 Resending verification code to: ${email}`); // ✅ debug log
    await sendVerificationEmail(email, code);
    
    res.json({ message: "Verification code resent" });
  } catch (error) {
    console.error("❌ Resend verification error:", error); // ✅ now you'll see the actual error
    res.status(500).json({ message: error.message || "Failed to resend code" });
  }
};
// controllers/userController.js - add this export
export const updateUserAvatar = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image uploaded" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old avatar from Cloudinary
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "avatars/users", width: 300, height: 300, crop: "fill" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(file.buffer);
    });

    user.avatar = { url: upload.secure_url, publicId: upload.public_id };
    await user.save();

    res.json({ message: "Avatar updated", avatar: user.avatar });
  } catch (e) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

export const deleteUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    user.avatar = { url: "", publicId: "" };
    await user.save();

    res.json({ message: "Avatar removed" });
  } catch (e) {
    res.status(500).json({ message: "Failed to remove avatar" });
  }
};
