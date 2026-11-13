import cloudinary from "../config/cloudinary.js";
import ShopContent from "../models/ShopContent.js";
import { getOrCreateShopContent } from "../utils/getOrCreateShopContent.js";

const uploadImage = (file, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(file.buffer);
  });

const destroyImage = async (publicId) => {
  if (publicId) await cloudinary.uploader.destroy(publicId);
};

export const getShopContent = async (req, res) => {
  try {
    const content = await getOrCreateShopContent();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateShopPage = async (req, res) => {
  try {
    const content = await getOrCreateShopContent();
    const { hero } = req.body;

    if (hero) {
      if (hero.title !== undefined) content.hero.title = String(hero.title).trim();
      if (hero.subtitle !== undefined) content.hero.subtitle = String(hero.subtitle).trim();
    }

    await content.save();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadShopHeroImages = async (req, res) => {
  try {
    const content = await getOrCreateShopContent();
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    if (files.length > 4) {
      return res.status(400).json({ success: false, message: "Maximum 4 images allowed" });
    }

    const uploadedImages = [];

    for (const file of files) {
      const upload = await uploadImage(file, "shop/hero");
      uploadedImages.push({
        url: upload.secure_url,
        publicId: upload.public_id,
      });
    }

    content.hero.backgroundImages = uploadedImages;
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteShopHeroImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    await destroyImage(publicId);

    const content = await getOrCreateShopContent();
    content.hero.backgroundImages = content.hero.backgroundImages.filter(
      (img) => img.publicId !== publicId
    );
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
