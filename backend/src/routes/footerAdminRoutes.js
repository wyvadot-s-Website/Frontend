import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import {
  saveFooter,
  getFooterAdmin,
} from "../controllers/footerAdminController.js";

const router = express.Router();

router.get("/footer", protectAdmin, getFooterAdmin);
router.post("/footer", protectAdmin, saveFooter);

export default router;
