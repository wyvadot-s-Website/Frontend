import mongoose from "mongoose";

// orderUpdateSchema
const orderUpdateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending_payment", "processing", "shipped", "delivered"],
      required: true,
    },
    note: { type: String, default: "" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);


const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },

    // snapshot fields (important: product might change later)
    name: { type: String, required: true },
    category: { type: String, default: "Uncategorized" }, 
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    
  },
  { _id: false }
);

const orderDownloadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true }, // ORD-0001

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for guest

    customer: {
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      fullName: { type: String, required: true, trim: true },
    },

    shippingAddress: {
      street: { type: String, required: true },
      country: { type: String, default: "Nigeria" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, default: "" },
    },

    items: { type: [orderItemSchema], default: [] },

    totals: {
      subtotal: { type: Number, required: true, min: 0 },
      shipping: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 }, // NGN
    },

   payment: {
  provider: { type: String, default: "paystack" },
  method: { type: String, enum: ["card", "bank_transfer"], default: "card" },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  reference: { type: String, default: "" },
},



status: {
  type: String,
  enum: ["pending_payment", "processing", "shipped", "delivered"],
  default: "pending_payment",
},

// ✅ prevents double-decrement if verify + webhook both run
inventoryUpdated: { type: Boolean, default: false },
inventoryUpdatedAt: { type: Date, default: null },

    updates: { type: [orderUpdateSchema], default: [] },// timeline/history
    downloads: { type: [orderDownloadSchema], default: [] },

},
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
