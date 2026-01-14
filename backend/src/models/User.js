import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
    },

    countryCode: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },

    googleId: String,

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // EMAIL VERIFICATION
    emailVerificationCode: String,
    emailVerificationExpires: Date,

    // 🔴 PASSWORD RESET (NEW)
    resetPasswordCode: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
