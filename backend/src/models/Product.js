// backend/models/Product.js
import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../utils/productCategories.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null, min: 0 },
    saleEndsAt: { type: Date, default: null },

    // ✅ ADD THIS (per-product shipping fee)
    shippingFee: { type: Number, default: 0, min: 0 },
    // ✅ per-product VAT rate (%)
    vatRate: { type: Number, default: 0, min: 0, max: 100 },

    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      default: "Uncategorized",
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    stockQuantity: { type: Number, default: 0, min: 0 },
    soldCount: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ["active", "draft", "out_of_stock", "archived"],
      default: "active",
    },

    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true },
);

productSchema.pre("save", function () {
  // If stock is 0, never allow "active"
  if ((this.stockQuantity ?? 0) <= 0 && this.status === "active") {
    this.status = "out_of_stock";
  }

  // If stock is restored, auto move out_of_stock -> active
  if ((this.stockQuantity ?? 0) > 0 && this.status === "out_of_stock") {
    this.status = "active";
  }
});

export default mongoose.model("Product", productSchema);
