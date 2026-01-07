import express from "express";
import AboutContent from "../models/AboutContent.js";

const router = express.Router();

router.get("/about", async (req, res) => {
  try {
    const about = await AboutContent.findOne();
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load About page",
    });
  }
});

export default router;
