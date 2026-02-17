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
  required: function () {
    return this.authProvider === "local";
  },
},

countryCode: {
  type: String,
  required: function () {
    return this.authProvider === "local";
  },
},

phoneNumber: {
  type: String,
  required: function () {
    return this.authProvider === "local";
  },
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

    // models/User.js - add to userSchema
avatar: {
  url: { type: String, default: "" },
  publicId: { type: String, default: "" },
},
    // EMAIL VERIFICATION
    emailVerificationCode: String,
    emailVerificationExpires: Date,

    // 🔴 PASSWORD RESET (NEW)
    resetPasswordCode: String,
    resetPasswordExpires: Date,

    // ✅ WISHLIST (login-only)
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  },
  
);

export default mongoose.model("User", userSchema);
