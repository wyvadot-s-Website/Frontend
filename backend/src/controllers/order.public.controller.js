import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; // ✅ ADD
import { generateOrderId } from "../utils/generateOrderId.js";

// Create order (guest/user)
export const createOrder = async (req, res) => {
  try {
    const { customer, shippingAddress, items, totals, paymentMethod } =
      req.body;

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

    if (totals?.total === undefined || totals?.total === null) {
      return res
        .status(400)
        .json({ success: false, message: "Totals missing" });
    }

    // ✅ Build server-trusted items (category comes from Product)
    const normalizedItems = await Promise.all(
      items.map(async (it) => {
        const rawProductId = it.productId;

        const canLookup =
          rawProductId && mongoose.Types.ObjectId.isValid(String(rawProductId));

        let category = "Uncategorized";

        if (canLookup) {
          const p = await Product.findById(rawProductId).select("category");
          if (p?.category) category = p.category;
        }

        return {
          productId: canLookup ? rawProductId : null,
          name: it.name,
          category, // ✅ correct category from DB
          image: it.image || "",
          price: Number(it.price || 0),
          quantity: Number(it.quantity || 1),
        };
      }),
    );

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,

      // ✅ If route is protected with userAuthMiddleware, req.user will exist
      userId: req.user?._id || null,

      customer: {
        email: String(customer.email).toLowerCase().trim(),
        phone: customer.phone,
        fullName: customer.fullName,
      },

      shippingAddress,

      items: normalizedItems, // ✅ USE normalized items
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
