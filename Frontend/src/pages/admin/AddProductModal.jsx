import React, { useState } from "react";
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
    deliveryFee: "",
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
      deliveryFee: "",
    });
    setImages([]);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pass raw values up — parent decides toast + api + reload
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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
            <label className="text-xs font-semibold">
              OLD PRICE (optional)
            </label>
            <Input
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              placeholder="₦25,000.00"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">
              SALE ENDS AT (optional)
            </label>
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
              onChange={(e) =>
                setForm({ ...form, stockQuantity: e.target.value })
              }
              placeholder="Enter quantity"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">
              DELIVERY FEE (UI only for now)
            </label>
            <Input
              value={form.deliveryFee}
              onChange={(e) =>
                setForm({ ...form, deliveryFee: e.target.value })
              }
              placeholder="Enter Amount"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">
              UPLOAD PRODUCT IMAGES *
            </label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
            />
            <p className="text-xs text-gray-500 mt-2">Upload 1–6 images.</p>
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
