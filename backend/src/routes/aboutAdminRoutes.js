import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

import {
  getAboutAdmin,
  updateAboutText,
  updateAboutHeroImage,
  addPromiseImage,
  deletePromiseImage,
} from "../controllers/aboutAdminController.js";


const router = express.Router();

router.get("/about", protectAdmin, getAboutAdmin);
router.put("/about/text", protectAdmin, updateAboutText);
router.put("/about/hero-image", protectAdmin, upload.single("image"), updateAboutHeroImage);
router.post("/about/promise-image", protectAdmin, upload.single("image"), addPromiseImage);
router.delete("/about/promise-image/:id", protectAdmin, deletePromiseImage);

export default router;
