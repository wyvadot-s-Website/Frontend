import AboutContent from "../models/AboutContent.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Get or create About content
 */
const getOrCreateAbout = async () => {
  let about = await AboutContent.findOne();
  if (!about) about = await AboutContent.create({});
  return about;
};

/**
 * GET ABOUT (ADMIN)
 */
export const getAboutAdmin = async (req, res) => {
  try {
    const about = await getOrCreateAbout();
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load About content",
    });
  }
};

/**
 * UPDATE TEXT CONTENT
 */
export const updateAboutText = async (req, res) => {
  try {
    const {
      aboutText,
      promiseText,
      mission,
      vision,
      history,
    } = req.body;

    const about = await getOrCreateAbout();

    if (aboutText !== undefined) about.aboutText = aboutText;
    if (promiseText !== undefined) about.promiseText = promiseText;
    if (mission !== undefined) about.mission = mission;
    if (vision !== undefined) about.vision = vision;
    if (history !== undefined) about.history = history;

    await about.save();

    res.json({
      success: true,
      message: "About texts updated successfully",
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update texts",
    });
  }
};

/**
 * UPLOAD HERO IMAGE
 */
export const updateAboutHeroImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const about = await getOrCreateAbout();

    if (about.heroImage?.publicId) {
      await cloudinary.uploader.destroy(about.heroImage.publicId);
    }

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "about" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(file.buffer);
    });

    about.heroImage = {
      url: upload.secure_url,
      publicId: upload.public_id,
    };

    await about.save();

    res.json({
      success: true,
      message: "Hero image updated successfully",
      data: about.heroImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload hero image",
    });
  }
};

/**
 * ADD PROMISE IMAGE (MAX 4)
 */
export const addPromiseImage = async (req, res) => {
  try {
    const file = req.file;
    const about = await getOrCreateAbout();

    if (about.promiseImages.length >= 4) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 4 promise images allowed",
      });
    }

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "about/promises" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(file.buffer);
    });

    about.promiseImages.push({
      url: upload.secure_url,
      publicId: upload.public_id,
    });

    await about.save();

    res.json({
      success: true,
      message: "Promise image added",
      data: about.promiseImages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload promise image",
    });
  }
};

/**
 * DELETE PROMISE IMAGE
 */
export const deletePromiseImage = async (req, res) => {
  try {
    const { id } = req.params;
    const about = await getOrCreateAbout();

    const image = about.promiseImages.find(i => i._id.toString() === id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    await cloudinary.uploader.destroy(image.publicId);
    about.promiseImages = about.promiseImages.filter(i => i._id.toString() !== id);

    await about.save();

    res.json({
      success: true,
      message: "Promise image deleted",
      data: about.promiseImages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
    });
  }
};

// controllers/adminController.js - add these exports
export const updateAdminAvatar = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image uploaded" });

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.avatar?.publicId) {
      await cloudinary.uploader.destroy(admin.avatar.publicId);
    }

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "avatars/admins", width: 300, height: 300, crop: "fill" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(file.buffer);
    });

    admin.avatar = { url: upload.secure_url, publicId: upload.public_id };
    await admin.save();

    res.json({ message: "Avatar updated", avatar: admin.avatar });
  } catch (e) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
};