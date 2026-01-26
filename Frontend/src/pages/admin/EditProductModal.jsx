import React, { useEffect, useState } from "react";
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

const EditProductModal = ({ open, onClose, onSubmit, loading, product }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    saleEndsAt: "",
    category: "Uncategorized",
    stockQuantity: "",
    status: "active",
    deliveryFee: "", // UI only (kept to match Add modal)
  });

  useEffect(() => {
    if (!open || !product) return;

    setForm({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? "",
      oldPrice: product?.oldPrice ?? "",
      saleEndsAt: product?.saleEndsAt ? String(product.saleEndsAt) : "",
      category: product?.category || "Uncategorized",
      stockQuantity: product?.stockQuantity ?? "",
      status: product?.status || "active",
      deliveryFee: "", // not in backend schema currently
    });
  }, [open, product]);

  const handleClose = () => {
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit?.({
      id: product?._id,
      updates: form,
      close: handleClose,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg max-h-[90vh] overflow-hidden">
        <h2 className="text-3xl font-bold text-center">Edit Product</h2>

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
              placeholder="2026-02-01T00:00:00.000Z"
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
            <label className="text-xs font-semibold">STATUS</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="out_of_stock">out_of_stock</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold">
              DELIVERY FEE (UI only for now)
            </label>
            <Input
              value={form.deliveryFee}
              onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
              placeholder="Enter Amount"
              type="number"
            />
          </div>

          {/* NOTE: No image upload here because backend update endpoint is "fields only" */}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-[#FF8D28] hover:bg-[#e67d1f]"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
