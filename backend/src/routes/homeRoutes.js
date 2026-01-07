import express from "express";
import HomeContent from "../models/HomeContent.js";
import { getOrCreateHomeContent } from "../utils/getOrCreateHome.js";

const router = express.Router();

router.get("/home", async (req, res) => {
  const home = await getOrCreateHomeContent();
  res.json(home);
});

export default router;
