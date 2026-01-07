import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";

import {
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialsAdmin,
} from "../controllers/testimonialAdminController.js";

const router = express.Router();

router.get("/testimonial", protectAdmin, getTestimonialsAdmin);
router.post("/testimonial", protectAdmin, addTestimonial);
router.put("/testimonial/:id", protectAdmin, updateTestimonial);
router.delete("/testimonial/:id", protectAdmin, deleteTestimonial);

export default router;
