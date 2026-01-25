// utils/generateProjectId.js
import ServiceCounter from "../models/ServiceCounter.js";

export default async function generateProjectId(serviceAbbr) {
  if (!serviceAbbr) throw new Error("serviceAbbr is required for projectId generation");

  const year = new Date().getFullYear();

  const counter = await ServiceCounter.findOneAndUpdate(
    { key: "service_requests_global" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.seq).padStart(3, "0");
  return `PROJ-${serviceAbbr}-${year}-${seq}`;
}

