import express from "express";
import { getFooterPublic } from "../controllers/footerPublicController.js";

const router = express.Router();

router.get("/footer", getFooterPublic);

export default router;
