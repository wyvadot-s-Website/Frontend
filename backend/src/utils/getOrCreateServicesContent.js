import ServicesContent from "../models/ServicesContent.js";

const DEFAULT_SERVICES = [
  {
    serviceKey: "project_management_resourcing",
    title: "Project Management & Resourcing",
    shortDescription:
      "Plan, coordinate, and control projects from concept through delivery.",
    description:
      "Our project management team aligns scope, schedule, resources, and stakeholders to deliver projects with clarity and accountability.",
    highlights: ["Project planning", "Resource coordination", "Delivery control"],
    order: 0,
  },
  {
    serviceKey: "core_engineering_construction",
    title: "Core Engineering & Construction",
    shortDescription:
      "Engineering and construction solutions built for reliable performance.",
    description:
      "We deliver core engineering and construction services with practical expertise, quality materials, and disciplined execution.",
    highlights: ["Engineering", "Construction", "Quality assurance"],
    order: 1,
  },
  {
    serviceKey: "facilities_management_maintenance",
    title: "Facilities Management & Maintenance",
    shortDescription:
      "Keep facilities safe, efficient, and well maintained.",
    description:
      "Our facilities management services help organizations protect assets, reduce downtime, and maintain dependable operations.",
    highlights: ["Maintenance", "Facilities care", "Preventive support"],
    order: 2,
  },
  {
    serviceKey: "energy_process_services",
    title: "Energy & Process Services",
    shortDescription:
      "Specialist support for energy and process-driven operations.",
    description:
      "We support energy and process environments with practical technical services designed around safety, efficiency, and performance.",
    highlights: ["Energy systems", "Process support", "Technical expertise"],
    order: 3,
  },
  {
    serviceKey: "technology_ecommerce",
    title: "Technology & E-commerce",
    shortDescription:
      "Modern technology and digital commerce solutions for growing businesses.",
    description:
      "We help organizations adopt practical technology, software, and e-commerce capabilities that support growth and customer experience.",
    highlights: ["Software solutions", "E-commerce", "Digital transformation"],
    order: 4,
  },
  {
    serviceKey: "general_contracts",
    title: "General Contracts",
    shortDescription:
      "Flexible contracting support for project and operational needs.",
    description:
      "Our general contracting services connect clients with coordinated delivery across people, materials, and project requirements.",
    highlights: ["Contracting", "Coordination", "Project delivery"],
    order: 5,
  },
];

export const getOrCreateServicesContent = async () => {
  let content = await ServicesContent.findOne();

  if (!content) {
    content = await ServicesContent.create({ services: DEFAULT_SERVICES });
  }

  return content;
};
