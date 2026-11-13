import { getOrCreateServicesContent } from "../utils/getOrCreateServicesContent.js";

const SERVICE_REQUEST_NAMES = {
  project_management_resourcing: "Project Management & Resourcing",
  core_engineering_construction: "Core Engineering & Construction",
  facilities_management_maintenance: "Facilities Management & Maintenance",
  energy_process_services: "Energy & Process Services",
  technology_ecommerce: "Technology & E-commerce",
  general_contracts: "General Contracts",
};

export const getServicesContentPublic = async (req, res) => {
  try {
    const content = await getOrCreateServicesContent();
    const data = content.toObject();
    data.services = (data.services || [])
      .filter((service) => service.isVisible)
      .sort((a, b) => a.order - b.order)
      .map((service) => ({
        ...service,
        requestName: SERVICE_REQUEST_NAMES[service.serviceKey] || service.title,
      }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load Services page" });
  }
};
