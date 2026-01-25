// models/ServiceRequest.js
import mongoose from "mongoose";

// Stage values (admin + user visible)
export const STAGE = [
  "Pending",
  "Site Visit",
  "Documentation",
  "Execution",
  "Review",
  "Completed",
  "Rejected", // added as requested
];

// Project Stage (admin dropdown)
export const PROJECT_STAGE = ["Project", "Service"];

const serviceRequestSchema = new mongoose.Schema(
  {
    // Service identity
    serviceName: { type: String, required: true }, // UI label
    serviceType: { type: String, required: true }, // backend key
    serviceAbbr: { type: String, required: true }, // e.g. PMR

    // Tracking
    projectId: { type: String, required: true, unique: true, index: true },

    // Title shown in admin table (PMR = pm_service)
    title: { type: String, required: true },

    // Contact details
    contact: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },

      countryCode: { type: String, default: "+234", trim: true }, // ✅ add

      tel: { type: String, required: true, trim: true },
      companyName: { type: String, default: "", trim: true },
    },

    // Shared form fields
    projectScope: { type: String, required: true },
    timeline: { type: String, default: "Immediately (Emergency)" },
    location: { type: String, default: "Nigeria" },
    locationAddress: { type: String, default: "" },
    newsletterOptIn: { type: Boolean, default: false },

    // Who submitted (optional if public)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Assigned admin (manager column)
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    // Admin dashboard fields
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    projectStage: {
      type: String,
      enum: PROJECT_STAGE,
      default: "Service",
    },

    // Single source of truth for workflow
    stage: {
      type: String,
      enum: STAGE,
      default: "Pending",
    },

    // Admin update / rejection note
    adminNotes: {
      type: String,
      default: "",
    },

    // Service-specific answers (PMR, etc.)
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
