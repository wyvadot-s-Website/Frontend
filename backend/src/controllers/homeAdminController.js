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
 * UPDATE HERO SECTION
 */
export const updateHero = async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const file = req.file;

    const home = await getOrCreateHomeContent();

    if (file) {
      if (home.hero.backgroundImage?.publicId) {
        await cloudinary.uploader.destroy(home.hero.backgroundImage.publicId);
      }

      const uploadToCloudinary = () =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "home" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

      const upload = await uploadToCloudinary();

      home.hero.backgroundImage = {
        url: upload.secure_url,
        publicId: upload.public_id,
      };
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
