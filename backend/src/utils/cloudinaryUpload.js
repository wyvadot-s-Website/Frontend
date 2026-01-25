import sharp from "sharp";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/**
 * Compress image buffer and upload to Cloudinary.
 * Returns: { url, public_id, width, height, format, bytes }
 */
export const uploadImageToCloudinary = async ({
  buffer,
  folder = "wyvadot/products",
  publicId,
}) => {
  // Resize + compress
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true }) // good for web
    .jpeg({ quality: 75 }) // compression (SEO + load speed)
    .toBuffer();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        format: "jpg",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    streamifier.createReadStream(optimizedBuffer).pipe(uploadStream);
  });
};

export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
