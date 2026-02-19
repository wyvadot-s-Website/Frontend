// admin AddProductModal.jsx
// ✅ Changes: rename deliveryFee -> shippingFee so it matches backend + cart
// ✅ Added: client-side image validation with descriptive sonner toast errors

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "Building Materials",
  "Equipment and Components",
  "Building Plans",
  "Solar system",
  "Installations",
  "Software",
  "Furniture & Decor",
  "Rentals",
  "Wyvadot Merch",
  "Uncategorized",
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_IMAGE_COUNT = 6;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const AddProductModal = ({ open, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    saleEndsAt: "",
    category: "Uncategorized",
    stockQuantity: "",
    status: "active",
    shippingFee: "",
    vatRate: "",
  });

  const [images, setImages] = useState([]);

  const reset = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      saleEndsAt: "",
      category: "Uncategorized",
      stockQuantity: "",
      status: "active",
      shippingFee: "",
      vatRate: "",
    });
    setImages([]);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  // ── Image validation ──────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files || []);

    if (selected.length === 0) return;

    // 1. Too many files
    if (selected.length > MAX_IMAGE_COUNT) {
      toast.error(`Too many images selected`, {
        description: `You can upload a maximum of ${MAX_IMAGE_COUNT} images, but you selected ${selected.length}. Please reduce your selection.`,
      });
      e.target.value = "";
      return;
    }

    const oversized = [];
    const invalidType = [];

    for (const file of selected) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        invalidType.push(file.name);
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        oversized.push(`${file.name} (${sizeMB} MB)`);
      }
    }

    if (invalidType.length > 0) {
      toast.error(`Unsupported file type${invalidType.length > 1 ? "s" : ""}`, {
        description: `${invalidType.join(", ")} — Please upload JPG, PNG, WEBP, or GIF images only.`,
      });
      e.target.value = "";
      return;
    }

    if (oversized.length > 0) {
      toast.error(
        `${oversized.length > 1 ? "Files exceed" : "File exceeds"} the ${MAX_FILE_SIZE_MB} MB limit`,
        {
          description: `${oversized.join(", ")} — Please compress or resize before uploading.`,
        }
      );
      e.target.value = "";
      return;
    }

    // ✅ All good
    setImages(selected);
    toast.success(`${selected.length} image${selected.length > 1 ? "s" : ""} ready to upload`);
  };

  // ── Submit validation ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      toast.error("Invalid price", {
        description: "Please enter a valid price greater than ₦0.",
      });
      return;
    }

    if (images.length === 0) {
      toast.error("No images selected", {
        description: "Please upload at least one product image before submitting.",
      });
      return;
    }

    await onSubmit?.({ form, images, reset, close: handleClose });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg max-h-[90vh] overflow-hidden">
        <h2 className="text-3xl font-bold text-center">Add New Product</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 overflow-y-auto max-h-[85vh]"
        >
          <div>
            <p className="font-semibold mb-3">Product Details</p>
          </div>

          <div>
            <label className="text-xs font-semibold">PRODUCT NAME *</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="product name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">PRODUCT DESCRIPTION</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product Description"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">PRICE (₦) *</label>
            <Input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="₦20,000.00"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">OLD PRICE (optional)</label>
            <Input
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              placeholder="₦25,000.00"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">SALE ENDS AT (optional)</label>
            <Input
              value={form.saleEndsAt}
              onChange={(e) => setForm({ ...form, saleEndsAt: e.target.value })}
              type="datetime-local"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">PRODUCT CATEGORY</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold">STOCK</label>
            <Input
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              placeholder="Enter quantity"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">SHIPPING FEE</label>
            <Input
              value={form.shippingFee}
              onChange={(e) => setForm({ ...form, shippingFee: e.target.value })}
              placeholder="Enter Amount"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">VAT RATE (%)</label>
            <Input
              value={form.vatRate}
              onChange={(e) => setForm({ ...form, vatRate: e.target.value })}
              placeholder="e.g. 7.5"
              type="number"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set to 0 for no VAT on this product.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold">UPLOAD PRODUCT IMAGES *</label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload 1–{MAX_IMAGE_COUNT} images. Max {MAX_FILE_SIZE_MB} MB each. JPG, PNG, WEBP, or GIF.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-[#FF8D28] hover:bg-[#e67d1f]"
              disabled={loading}
            >
              {loading ? "Creating..." : "Add New Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;