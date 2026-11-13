import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
import {
  deleteService,
  deleteServiceImage,
  getServicesContentAdmin,
  updateServiceImage,
  updateServices,
  updateServicesHeroImages,
  updateServicesPage,
} from "../controllers/servicesAdminController.js";

const router = express.Router();

router.get("/services", protectAdmin, getServicesContentAdmin);
router.put("/services/page", protectAdmin, updateServicesPage);
router.put(
  "/services/hero-images",
  protectAdmin,
  upload.array("backgroundImages", 4),
  updateServicesHeroImages
);
router.put("/services", protectAdmin, updateServices);
router.put(
  "/services/:serviceKey/image",
  protectAdmin,
  upload.single("image"),
  updateServiceImage
);
router.delete("/services/:serviceKey/image", protectAdmin, deleteServiceImage);
router.delete("/services/:serviceKey", protectAdmin, deleteService);

export default router;
