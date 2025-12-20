import cloudinary from "../config/cloudinary.js";

(async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connected:", result);
  } catch (err) {
    console.error("❌ Cloudinary connection failed:", err.message);
  }
})();

