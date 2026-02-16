import ServiceRequest from "../models/ServiceRequest.js";
import generateProjectId from "../utils/generateProjectId.js";
import {
  getServiceMeta,
  getServiceTypeFromUIName,
} from "../utils/serviceRegistry.js";
import { sendServiceRequestNotificationToAdmins } from "../config/email.js";
import { notifyAdminsByRoles } from "../utils/notify.js";


const PROJECT_ALLOWED_ROLES = [
"super_admin",
"project_admin",
"content_project_admin",
"shop_project_admin",
];

export const createServiceRequest = async (req, res) => {
  try {
     // ✅ ADD THIS LOGGING
    console.log("=== SERVICE REQUEST RECEIVED ===");
    console.log("Body:", req.body);
    console.log("User:", req.user);
    console.log("================================");
    const {
      serviceName,

      // contact
      name,
      email,
      countryCode,
      tel,
      companyName,
      projectScope,

      // shared
      timeline,
      location,
      locationAddress,
      agreed,

      // PMR
      pm_service,
      pm_budget,
      pm_resourcing,
      pm_financing,

      // CEC
      ce_description,
      ce_design,
      ce_cost,
      ce_materials,

      // FMM
      fm_services,
      fm_coverage,
      fm_maintenance,
      fm_availability,

      // EPS
      ep_inquiry,
      ep_facility,
      ep_cmms,
      ep_process,

      // TEC
      tech_software,
      tech_platform,
      tech_cmms,
      tech_ecommerce,

      // GC
      gc_region,
      gc_location,
    } = req.body;

    // 🔐 enforce authenticated user
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!serviceName) {
      return res.status(400).json({ message: "serviceName is required" });
    }

    const serviceType = getServiceTypeFromUIName(serviceName);
    if (!serviceType) {
      return res.status(400).json({ message: "Invalid serviceName" });
    }

    const meta = getServiceMeta(serviceType);
    if (!meta) {
      return res.status(400).json({ message: "Service not registered" });
    }

    // base required fields
    if (!name || !email || !tel || !projectScope) {
      return res.status(400).json({
        message: "name, email, tel, and projectScope are required",
      });
    }

    let title = "";
    let details = {};

    /* ===================== PMR ===================== */
    if (serviceType === "project_management_resourcing") {
      if (!pm_service || !pm_budget || !pm_financing) {
        return res.status(400).json({
          message: "pm_service, pm_budget, pm_financing are required",
        });
      }

      title = pm_service;
      details = {
        pm_service,
        pm_budget,
        pm_resourcing: pm_resourcing || "",
        pm_financing,
      };
    }

    /* ===================== CEC ===================== */
    if (serviceType === "core_engineering_construction") {
      if (!ce_description || !ce_design || !ce_cost) {
        return res.status(400).json({
          message: "ce_description, ce_design, ce_cost are required",
        });
      }

      title = ce_description;
      details = {
        ce_description,
        ce_design,
        ce_cost,
        ce_materials: ce_materials || "",
      };
    }

    /* ===================== FMM ===================== */
    if (serviceType === "facilities_management_maintenance") {
      if (!fm_services || !fm_coverage || !fm_maintenance) {
        return res.status(400).json({
          message: "fm_services, fm_coverage, fm_maintenance are required",
        });
      }

      title = fm_services;
      details = {
        fm_services,
        fm_coverage,
        fm_maintenance,
        fm_availability: fm_availability || "",
      };
    }

    /* ===================== EPS ===================== */
    if (serviceType === "energy_process_services") {
      if (!ep_inquiry || !ep_facility) {
        return res.status(400).json({
          message: "ep_inquiry and ep_facility are required",
        });
      }

      title = ep_inquiry;
      details = {
        ep_inquiry,
        ep_facility,
        ep_cmms: ep_cmms || "",
        ep_process: ep_process || "",
      };
    }

    /* ===================== TEC ===================== */
    if (serviceType === "technology_ecommerce") {
      if (!tech_software || !tech_platform) {
        return res.status(400).json({
          message: "tech_software and tech_platform are required",
        });
      }

      title = tech_software;
      details = {
        tech_software,
        tech_platform,
        tech_cmms: tech_cmms || "",
        tech_ecommerce: tech_ecommerce || "",
      };
    }

    /* ===================== GC ===================== */
    if (serviceType === "general_contracts") {
      if (!gc_region) {
        return res.status(400).json({
          message: "gc_region is required",
        });
      }

      title = gc_region;
      details = {
        gc_region,
        gc_location: gc_location || "",
      };
    }

    const projectId = await generateProjectId(meta.abbr);
    if (!title) title = meta.serviceName;

    const doc = await ServiceRequest.create({
      serviceName: meta.serviceName,
      serviceType,
      serviceAbbr: meta.abbr,
      projectId,

      title,

      contact: {
        name,
        email,
        countryCode: countryCode || "+234",
        tel,
        companyName: companyName || "",
      },

      projectScope,
      timeline: timeline || "Immediately (Emergency)",
      location: location || "Nigeria",
      locationAddress: locationAddress || "",
      newsletterOptIn: Boolean(agreed),

      user: userId,

      progress: 0,
      projectStage: "Service",
      stage: "Pending",
      adminNotes: "",

      details,
    });

    await sendServiceRequestNotificationToAdmins({
  projectId: doc.projectId,
  serviceName: doc.serviceName,
  contactName: doc.contact.name,
  contactEmail: doc.contact.email,
  contactTel: `${doc.contact.countryCode}${doc.contact.tel}`,
  projectScope: doc.projectScope,
  details: doc.details, // ✅ ADD THIS
  timeline: doc.timeline, // ✅ ADD THIS
  location: doc.location, // ✅ ADD THIS
  locationAddress: doc.locationAddress, // ✅ ADD THIS
});

    // after sendServiceRequestNotificationToAdmins(...)
    await notifyAdminsByRoles({
      roles: PROJECT_ALLOWED_ROLES,
      scope: "project",
      title: "New Service Request",
      message: `${doc.projectId} • ${doc.serviceName} submitted by ${doc.contact.name}`,
      link: `/theboss/projects`,
      meta: { projectId: doc.projectId, serviceRequestId: String(doc._id) },
    });

    // ✅ ADD THIS LOGGING
    console.log("=== SERVICE REQUEST CREATED ===");
    console.log("Project ID:", doc.projectId);
    console.log("================================");

    return res.status(201).json({
      message: "Service request submitted",
      data: {
        projectId: doc.projectId,
        stage: doc.stage,
        progress: doc.progress,
        projectStage: doc.projectStage,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to submit service request",
      error: err.message,
    });
  }
};
