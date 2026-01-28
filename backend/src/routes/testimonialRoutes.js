import express from "express";
import { getTestimonialsPublic } from "../controllers/testimonialcontroller.js";

const router = express.Router();

router.get("/testimonials", getTestimonialsPublic);

export default router;
