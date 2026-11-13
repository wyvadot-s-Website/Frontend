import express from "express";
import { getShopContentPublic } from "../controllers/shopPublicController.js";

const router = express.Router();

router.get("/", getShopContentPublic);

export default router;
