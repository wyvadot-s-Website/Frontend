import express from "express";
import { getServicesContentPublic } from "../controllers/servicesPublicController.js";

const router = express.Router();

router.get("/services", getServicesContentPublic);

export default router;
