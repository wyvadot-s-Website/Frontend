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
<<<<<<< HEAD
router.put("/home/hero", protectAdmin, upload.single("backgroundImage"), updateHero);
=======
router.put("/home/hero", protectAdmin, upload.array("backgroundImages", 4), updateHero);
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
router.put("/home/stats", protectAdmin, updateStats);
router.post("/home/why-choose-us", protectAdmin, addWhyChoose);
router.delete("/home/why-choose-us/:id", protectAdmin, deleteWhyChoose);

export default router;
