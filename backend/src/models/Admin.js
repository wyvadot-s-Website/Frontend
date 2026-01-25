import mongoose from "mongoose";

export const ADMIN_ROLES = [
  "super_admin",
  "content_admin",
  "shop_admin",
  "project_admin",
  "content_shop_admin",
  "content_project_admin",
  "shop_project_admin",
];

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ADMIN_ROLES,
      default: "content_admin", // pick any default you want
    },

    isVerified: { type: Boolean, default: false },

    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
