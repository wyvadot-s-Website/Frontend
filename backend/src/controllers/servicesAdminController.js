import cloudinary from "../config/cloudinary.js";
import ServicesContent from "../models/ServicesContent.js";
import { getOrCreateServicesContent } from "../utils/getOrCreateServicesContent.js";

const SERVICE_KEYS = [
  "project_management_resourcing",
  "core_engineering_construction",
  "facilities_management_maintenance",
  "energy_process_services",
  "technology_ecommerce",
  "general_contracts",
];

const uploadImage = (file, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(file.buffer);
  });

const destroyImage = async (publicId) => {
  if (publicId) await cloudinary.uploader.destroy(publicId);
};

const normalizeService = (service, index) => ({
  serviceKey: service.serviceKey,
  title: String(service.title || "").trim(),
  shortDescription: String(service.shortDescription || "").trim(),
  description: String(service.description || "").trim(),
  highlights: Array.isArray(service.highlights)
    ? service.highlights.map((item) => String(item).trim()).filter(Boolean)
    : [],
  image: service.image || { url: "", publicId: "" },
  order: Number.isFinite(Number(service.order)) ? Number(service.order) : index,
  isVisible: service.isVisible !== false,
});

export const getServicesContentAdmin = async (req, res) => {
  try {
    const content = await getOrCreateServicesContent();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load Services content" });
  }
};

export const updateServicesPage = async (req, res) => {
  try {
    const content = await getOrCreateServicesContent();
    const { hero, intro, cta } = req.body;

    if (hero) {
      if (hero.title !== undefined) content.hero.title = String(hero.title).trim();
      if (hero.subtitle !== undefined) content.hero.subtitle = String(hero.subtitle).trim();
    }
    if (intro) {
      if (intro.heading !== undefined) content.intro.heading = String(intro.heading).trim();
      if (intro.description !== undefined) content.intro.description = String(intro.description).trim();
    }
    if (cta) {
      if (cta.heading !== undefined) content.cta.heading = String(cta.heading).trim();
      if (cta.description !== undefined) content.cta.description = String(cta.description).trim();
      if (cta.buttonText !== undefined) content.cta.buttonText = String(cta.buttonText).trim();
      if (cta.buttonLink !== undefined) content.cta.buttonLink = String(cta.buttonLink).trim() || "/contact";
    }

    await content.save();
    res.json({ success: true, message: "Services page updated", data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update Services page" });
  }
};

export const updateServicesHeroImages = async (req, res) => {
  try {
    const files = req.files || [];
    const content = await getOrCreateServicesContent();

    if (!files.length) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const uploads = await Promise.all(
      files.slice(0, 4).map((file) => uploadImage(file, "services/hero"))
    );
    const removed = content.hero.backgroundImages.slice(0, uploads.length);
    await Promise.all(removed.map((image) => destroyImage(image.publicId)));

    content.hero.backgroundImages = [
      ...content.hero.backgroundImages.slice(uploads.length),
      ...uploads.map((upload) => ({ url: upload.secure_url, publicId: upload.public_id })),
    ].slice(0, 4);

    await content.save();
    res.json({ success: true, message: "Services hero images updated", data: content.hero });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to upload Services hero images" });
  }
};

export const updateServices = async (req, res) => {
  try {
    const { services } = req.body;
    if (!Array.isArray(services)) {
      return res.status(400).json({ success: false, message: "Services must be an array" });
    }

    const content = await getOrCreateServicesContent();
    const normalized = services
      .filter((service) => SERVICE_KEYS.includes(service.serviceKey))
      .map(normalizeService);

    if (normalized.some((service) => !service.title)) {
      return res.status(400).json({ success: false, message: "Every service requires a title" });
    }

    content.services = normalized;
    await content.save();
    res.json({ success: true, message: "Services updated", data: content.services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update services" });
  }
};

export const updateServiceImage = async (req, res) => {
  try {
    const { serviceKey } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "No image uploaded" });

    const content = await getOrCreateServicesContent();
    const service = content.services.find((item) => item.serviceKey === serviceKey);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const upload = await uploadImage(file, `services/${serviceKey}`);
    await destroyImage(service.image?.publicId);
    service.image = { url: upload.secure_url, publicId: upload.public_id };
    await content.save();

    res.json({ success: true, message: "Service image updated", data: service.image });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to upload service image" });
  }
};

export const deleteServiceImage = async (req, res) => {
  try {
    const { serviceKey } = req.params;
    const content = await getOrCreateServicesContent();
    const service = content.services.find((item) => item.serviceKey === serviceKey);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    await destroyImage(service.image?.publicId);
    service.image = { url: "", publicId: "" };
    await content.save();

    res.json({ success: true, message: "Service image removed", data: service.image });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove service image" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceKey } = req.params;
    const content = await ServicesContent.findOne();
    if (!content) return res.status(404).json({ success: false, message: "Services content not found" });

    const service = content.services.find((item) => item.serviceKey === serviceKey);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    await destroyImage(service.image?.publicId);
    content.services = content.services.filter((item) => item.serviceKey !== serviceKey);
    await content.save();

    res.json({ success: true, message: "Service deleted", data: content.services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete service" });
  }
};
