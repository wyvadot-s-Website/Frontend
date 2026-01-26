// models/ServiceCounter.js
import mongoose from "mongoose";

const serviceCounterSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "service_requests_global"
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ServiceCounter = mongoose.model("ServiceCounter", serviceCounterSchema);

export default ServiceCounter;
