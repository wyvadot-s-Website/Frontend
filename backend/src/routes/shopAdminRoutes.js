// src/routes/shopAdminRoutes.js
import express from "express";
import protectAdmin from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  archiveProduct,
  addProductImages,
  removeProductImage,
} from "../controllers/adminProduct.controller.js";

const router = express.Router();

// list + read
router.get("/products", protectAdmin, getAdminProducts);
router.get("/products/:id", protectAdmin, getAdminProductById);

// create
router.post("/products", protectAdmin, upload.array("images", 6), createProduct);

// update
router.patch("/products/:id", protectAdmin, updateProduct);
router.patch("/products/:id/status", protectAdmin, updateProductStatus);

// archive
router.delete("/products/:id", protectAdmin, archiveProduct);

// images
router.post("/products/:id/images", protectAdmin, upload.array("images", 6), addProductImages);
router.delete("/products/:id/images/:publicId", protectAdmin, removeProductImage);

export default router;
