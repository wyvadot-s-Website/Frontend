import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { generateOrderId } from "../utils/generateOrderId.js";

const VAT_RATE = 0.075;

// Helper: safe money rounding (NGN)
const round2 = (n) => Math.round(Number(n || 0) * 100) / 100;

// Create order (guest/user)
export const createOrder = async (req, res) => {
  try {
    const { customer, shippingAddress, items, paymentMethod } = req.body;

    if (!customer?.email || !customer?.phone || !customer?.fullName) {
      return res
        .status(400)
        .json({ success: false, message: "Customer info missing" });
    }

    if (
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address missing" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order items missing" });
    }

    // ✅ Build server-trusted items (category, price, shippingFee come from Product)
    // Also compute totals on server (do NOT trust frontend totals)
    let subtotal = 0;
    let shipping = 0;

    const normalizedItems = await Promise.all(
      items.map(async (it) => {
        const rawProductId = it.productId;

        const canLookup =
          rawProductId && mongoose.Types.ObjectId.isValid(String(rawProductId));

        if (!canLookup) {
          // If productId isn't valid, reject (safer)
          throw new Error("Invalid productId in items");
        }

        const qty = Number(it.quantity || 1);
        if (qty < 1) throw new Error("Invalid quantity in items");

        // Pull trusted fields from DB
        const p = await Product.findById(rawProductId).select(
          "name category price status stockQuantity shippingFee"
        );

        if (!p) throw new Error(`Product not found: ${rawProductId}`);

        // Prevent ordering archived/draft/out_of_stock or insufficient stock
        const stockQty = Number(p.stockQuantity ?? 0);
        const isOut =
          p.status === "archived" ||
          p.status === "draft" ||
          p.status === "out_of_stock" ||
          stockQty <= 0;

        if (isOut) throw new Error(`${p.name} is out of stock`);
        if (stockQty && qty > stockQty)
          throw new Error(`Only ${stockQty} left for ${p.name}`);

        const price = Number(p.price || 0);
        const shippingFee = Number(p.shippingFee || 0);

        // totals
        subtotal += price * qty;

        // ✅ shipping rule (order-level): use max shipping fee among items
        shipping = Math.max(shipping, shippingFee);

        return {
          productId: p._id,
          name: it.name || p.name, // keep snapshot but fallback to db
          category: p.category || "Uncategorized",
          image: it.image || "",
          price,
          quantity: qty,

          // ✅ optional snapshot (useful later)
          shippingFee,
        };
      })
    );

    subtotal = round2(subtotal);
    shipping = round2(shipping);

    // ✅ VAT on subtotal (standard simple rule)
    const vat = round2(subtotal * VAT_RATE);

    // ✅ final total
    const total = round2(subtotal + shipping + vat);

    const totals = {
      subtotal,
      shipping,
      vatRate: VAT_RATE,
      vat,
      total,
    };

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,

      userId: req.user?._id || null,

      customer: {
        email: String(customer.email).toLowerCase().trim(),
        phone: customer.phone,
        fullName: customer.fullName,
      },

      shippingAddress,

      items: normalizedItems,
      totals,

      payment: {
        provider: "paystack",
        method: paymentMethod || "card",
        status: "pending",
      },

      status: "pending_payment",

      updates: [
        {
          status: "pending_payment",
          note: "Order created (awaiting payment)",
          updatedBy: req.user?._id || null,
        },
      ],
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Track order (guest): orderId + email
export const trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.query;

    if (!orderId || !email) {
      return res.status(400).json({
        success: false,
        message: "orderId and email are required",
      });
    }

    const order = await Order.findOne({
      orderId,
      "customer.email": String(email).toLowerCase().trim(),
    });

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

