import express from "express";
import multer from "multer";
import {
  getShopContent,
  updateShopPage,
  uploadShopHeroImages,
  deleteShopHeroImage,
} from "../controllers/shopAdminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", protectAdmin, getShopContent);
router.put("/page", protectAdmin, updateShopPage);
router.post("/hero/images", protectAdmin, upload.array("backgroundImages", 4), uploadShopHeroImages);
router.delete("/hero/images/:publicId", protectAdmin, deleteShopHeroImage);

export default router;
