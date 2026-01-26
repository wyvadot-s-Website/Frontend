// utils/serviceRegistry.js
const SERVICES = {
  project_management_resourcing: {
    serviceName: "Project Management & Resourcing",
    abbr: "PMR",
  },

  core_engineering_construction: {
    serviceName: "Core Engineering & Construction",
    abbr: "CEC",
  },

  facilities_management_maintenance: {
    serviceName: "Facilities Management & Maintenance",
    abbr: "FMM",
  },

  energy_process_services: {
    serviceName: "Energy & Process Services",
    abbr: "EPS",
  },

  technology_ecommerce: {
    serviceName: "Technology & E-commerce",
    abbr: "TEC",
  },

  general_contracts: {
    serviceName: "General Contracts",
    abbr: "GCO",
  },
};

export const getServiceTypeFromUIName = (uiName) => {
  const entry = Object.entries(SERVICES).find(
    ([, meta]) => meta.serviceName === uiName
  );
  return entry ? entry[0] : null;
};

export const getServiceMeta = (serviceType) => {
  return SERVICES[serviceType] || null;
};
