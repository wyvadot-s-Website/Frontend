import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

import {
  getHomeContentAdmin,
  updateHero,
  updateStats,
  addWhyChoose,
  deleteWhyChoose
} from "../controllers/homeAdminController.js";

const router = express.Router();

router.get("/home", protectAdmin, getHomeContentAdmin);
router.put("/home/hero", protectAdmin, upload.single("backgroundImage"), updateHero);
router.put("/home/stats", protectAdmin, updateStats);
router.post("/home/why-choose-us", protectAdmin, addWhyChoose);
router.delete("/home/why-choose-us/:id", protectAdmin, deleteWhyChoose);

export default router;
