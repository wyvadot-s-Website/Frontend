// backend/controllers/product.admin.controller.js

import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import {
  uploadImageToCloudinary,
  deleteCloudinaryImage,
} from "../utils/cloudinaryUpload.js";

// ✅ Admin: list all products (includes draft/out_of_stock, excludes archived by default)
export const getAdminProducts = async (req, res) => {
  const {
    status, // active | draft | out_of_stock | archived
    category,
    search,
    page = 1,
    limit = 20,
    sort = "newest", // newest | oldest | price_asc | price_desc | stock_asc | stock_desc
  } = req.query;

  const q = {};
  if (status) q.status = status;
  else q.status = { $ne: "archived" };

  if (category && category !== "All") q.category = category;
  if (search) q.name = { $regex: search, $options: "i" };

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    stock_asc: { stockQuantity: 1 },
    stock_desc: { stockQuantity: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Product.find(q)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(q),
  ]);

  res.json({
    items,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
};

// ✅ Admin: get single product
export const getAdminProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// ✅ Admin: create product (with images)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      saleEndsAt,
      category,
      stockQuantity,
      status,
      shippingFee,
      vatRate, // ✅ ADD
    } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Name and price are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required" });
    }

    const uploads = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "wyvadot/products" },
                (error, result) => {
                  if (error) return reject(error);
                  resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                  });
                },
              )
              .end(file.buffer);
          }),
      ),
    );

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      saleEndsAt: saleEndsAt ? new Date(saleEndsAt) : null,
      category: category || "Uncategorized",
      stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
      status: status || "active",
      // ✅ ADD
      shippingFee: shippingFee ? Number(shippingFee) : 0,
      vatRate: vatRate ? Number(vatRate) : 0,
      images: uploads,
      createdBy: req.admin?._id || null,
    });

    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Admin: update product fields (not images)
export const updateProduct = async (req, res) => {
  const allowed = [
    "name",
    "description",
    "price",
    "oldPrice",
    "saleEndsAt",
    "category",
    "stockQuantity",
    "status",
    "shippingFee",
    "vatRate", // ✅ ADD
  ];

  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }

  if (update.price !== undefined) update.price = Number(update.price);
  if (update.shippingFee !== undefined)
    update.shippingFee = Number(update.shippingFee);
  if (update.vatRate !== undefined) update.vatRate = Number(update.vatRate); // ✅ ADD
  if (update.oldPrice !== undefined)
    update.oldPrice = update.oldPrice ? Number(update.oldPrice) : null;
  if (update.stockQuantity !== undefined)
    update.stockQuantity = Number(update.stockQuantity);
  if (update.saleEndsAt !== undefined)
    update.saleEndsAt = update.saleEndsAt ? new Date(update.saleEndsAt) : null;

  const existing = await Product.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Product not found" });

  if (update.stockQuantity !== undefined) {
    const nextQty = Number(update.stockQuantity || 0);

    if (nextQty <= 0) {
      const statusToRespect = update.status ?? existing.status;
      if (statusToRespect !== "archived" && statusToRespect !== "draft") {
        update.status = "out_of_stock";
      }
    }

    if (nextQty > 0) {
      const statusToRespect = update.status ?? existing.status;
      const wasOut = existing.status === "out_of_stock";
      const keepArchivedOrDraft =
        statusToRespect === "archived" || statusToRespect === "draft";

      if (wasOut && !keepArchivedOrDraft) {
        update.status = "active";
      }
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });

  res.json(product);
};

// ✅ Admin: update only status
export const updateProductStatus = async (req, res) => {
  const { status } = req.body;
  if (!["active", "draft", "out_of_stock", "archived"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.status = status;
  await product.save();

  res.json(product);
};

// ✅ Admin: archive (soft delete)
export const archiveProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.status = "archived";
  await product.save();

  res.json({ message: "Archived", product });
};

// ✅ Admin: add images (append)
export const addProductImages = async (req, res) => {
  const files = req.files || [];
  if (!files.length)
    return res.status(400).json({ message: "No images uploaded" });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const uploadedImages = [];
  for (const file of files) {
    const uploaded = await uploadImageToCloudinary({
      buffer: file.buffer,
      folder: "wyvadot/products",
    });
    uploadedImages.push({ url: uploaded.url, public_id: uploaded.public_id });
  }

  product.images.push(...uploadedImages);
  await product.save();

  res.json(product);
};

// ✅ Admin: remove a single image by public_id
export const removeProductImage = async (req, res) => {
  const { publicId } = req.params;

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const before = product.images.length;
  product.images = product.images.filter((img) => img.public_id !== publicId);

  if (product.images.length === before) {
    return res.status(404).json({ message: "Image not found on product" });
  }

  await deleteCloudinaryImage(publicId);

  if (product.images.length === 0) {
    return res
      .status(400)
      .json({ message: "Product must have at least one image" });
  }

  await product.save();
  res.json(product);
};
