import HomeContent from "../models/HomeContent.js";
import { getOrCreateHomeContent } from "../utils/getOrCreateHome.js";
import cloudinary from "../config/cloudinary.js";

/**
 * GET HOME CONTENT (ADMIN)
 */
export const getHomeContentAdmin = async (req, res) => {
  const home = await getOrCreateHomeContent();
  res.json(home);
};

/**
 * UPDATE HERO SECTION (title/subtitle + slider background images)
 * - Upload 1..4 images
 * - If upload 1 => replace 1 oldest
 * - If upload 2 => replace 2 oldest
 * - If upload 4 => replace all
 * - Always keep max 4
 */
export const updateHero = async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const files = req.files || []; // ✅ multiple

    const home = await getOrCreateHomeContent();

    // Ensure array exists
    if (!Array.isArray(home.hero.backgroundImages)) {
      home.hero.backgroundImages = [];
    }

    // ✅ Upload images if provided
    if (files.length > 0) {
      // Safety: cap to 4
      const incoming = files.slice(0, 4);
      const k = incoming.length;

      // Helper upload
      const uploadOne = (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "home" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

      // Upload all
      const uploads = await Promise.all(incoming.map(uploadOne));

      const newImages = uploads.map((u) => ({
        url: u.secure_url,
        publicId: u.public_id,
        createdAt: new Date(),
      }));

      // Existing (oldest -> newest)
      const existing = home.hero.backgroundImages;

      // ✅ Overwrite rule
      // If they upload 4 => clear all old
      // else replace k oldest (but also respect max 4 even if existing < 4)
      let toRemove = 0;

      if (k >= 4) {
        toRemove = existing.length;
      } else {
        // Replace k oldest, BUT if adding would exceed 4, remove the extra oldest too.
        const wouldBe = existing.length + k;
        const overflow = Math.max(0, wouldBe - 4);

        // Must remove at least k oldest when already full, but also handle overflow
        toRemove = Math.max(k, overflow);
        toRemove = Math.min(toRemove, existing.length); // can't remove more than exists
      }

      // Delete removed images from Cloudinary
      const removed = existing.slice(0, toRemove);
      await Promise.all(
        removed
          .filter((img) => img?.publicId)
          .map((img) => cloudinary.uploader.destroy(img.publicId))
      );

      // Keep remaining + append new
      const remaining = existing.slice(toRemove);
      home.hero.backgroundImages = [...remaining, ...newImages].slice(0, 4);
    }

    if (title !== undefined) home.hero.title = title;
    if (subtitle !== undefined) home.hero.subtitle = subtitle;

    await home.save();

    res.json({
      success: true,
      message: "Hero section updated successfully",
      data: home.hero,
    });
  } catch (error) {
    console.error("HERO UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update hero section",
      error: error.message,
    });
  }
};

/**
 * UPDATE STATS (ALL 4 AT ONCE)
 */
export const updateStats = async (req, res) => {
  const { stats } = req.body;

  if (!Array.isArray(stats) || stats.length !== 4) {
    return res
      .status(400)
      .json({ message: "Stats must contain exactly 4 items" });
  }

  const home = await getOrCreateHomeContent();
  home.stats = stats;
  await home.save();

  res.json({ message: "Stats updated successfully", stats: home.stats });
};

/**
 * ADD WHY CHOOSE US
 */
export const addWhyChoose = async (req, res) => {
  const { title, description } = req.body;

  const home = await getOrCreateHomeContent();

  if (home.whyChooseUs.length >= 5) {
    return res.status(400).json({ message: "Maximum of 5 items allowed" });
  }

  home.whyChooseUs.push({ title, description });
  await home.save();

  res.json({
    message: "Why Choose Us item added",
    whyChooseUs: home.whyChooseUs,
  });
};

/**
 * DELETE WHY CHOOSE US
 */
export const deleteWhyChoose = async (req, res) => {
  const { id } = req.params;

  const home = await getOrCreateHomeContent();
  home.whyChooseUs = home.whyChooseUs.filter(
    (item) => item._id.toString() !== id
  );

  await home.save();

  res.json({
    message: "Item removed",
    whyChooseUs: home.whyChooseUs,
  });
};
 
