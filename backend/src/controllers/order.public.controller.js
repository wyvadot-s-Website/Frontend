// backend/controllers/order.public.controller.js
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { generateOrderId } from "../utils/generateOrderId.js";

// Helper: safe money rounding (NGN)
const round2 = (n) => Math.round(Number(n || 0) * 100) / 100;

/**
 * ✅ Same sale pricing logic as product.controller.js
 * Returns effectivePrice (what customer should pay) and originalPrice (strike-through) when sale active.
 */
function buildPricing(p) {
  const now = Date.now();

  const price = Number(p.price || 0);
  const oldPrice =
    p.oldPrice === null || p.oldPrice === undefined ? null : Number(p.oldPrice);

  const saleEndsAt = p.saleEndsAt ? new Date(p.saleEndsAt).getTime() : null;

  const isSaleActive =
    !!oldPrice &&
    oldPrice > 0 &&
    saleEndsAt &&
    !Number.isNaN(saleEndsAt) &&
    saleEndsAt > now &&
    price > 0 &&
    price < oldPrice;

  // If sale is active => use price (discounted) and show originalPrice
  // If sale ended => revert to oldPrice as the effective price
  const effectivePrice = isSaleActive ? price : oldPrice || price;
  const originalPrice = isSaleActive ? oldPrice : null;

  return { isOnSale: isSaleActive, effectivePrice, originalPrice };
}

// Create order (guest/user) — server computes totals (subtotal, shipping, vat, total)
// VAT is per-product using Product.vatRate (%)
export const createOrder = async (req, res) => {
  try {
    const { customer, shippingAddress, items, paymentMethod } = req.body;

    // -----------------------------
    // Validate basics
    // -----------------------------
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

    // -----------------------------
    // Build server-trusted items + totals
    // -----------------------------
    let subtotal = 0;
    let shipping = 0; // ✅ NEW RULE: sum(shippingFee * qty)
    let vat = 0; // per-product VAT sum

    const normalizedItems = await Promise.all(
      items.map(async (it) => {
        const rawProductId = it?.productId;

        const canLookup =
          rawProductId && mongoose.Types.ObjectId.isValid(String(rawProductId));
        if (!canLookup) {
          throw new Error("BAD_REQUEST: Invalid productId in items");
        }

        const qty = Number(it?.quantity || 1);
        if (qty < 1) {
          throw new Error("BAD_REQUEST: Invalid quantity in items");
        }

        const p = await Product.findById(rawProductId).select(
          "name category price oldPrice saleEndsAt status stockQuantity shippingFee vatRate",
        );

        if (!p) {
          throw new Error(`BAD_REQUEST: Product not found: ${rawProductId}`);
        }

        const stockQty = Number(p.stockQuantity ?? 0);

        const blocked =
          p.status === "archived" ||
          p.status === "draft" ||
          p.status === "out_of_stock" ||
          stockQty <= 0;

        if (blocked) {
          throw new Error(`BAD_REQUEST: ${p.name} is out of stock`);
        }

        if (stockQty && qty > stockQty) {
          throw new Error(`BAD_REQUEST: Only ${stockQty} left for ${p.name}`);
        }

        const pricing = buildPricing(p);
        const unitPrice = Number(pricing.effectivePrice || 0);

        const shippingFee = Number(p.shippingFee || 0);

        // ✅ NEW: per-line shipping
        const itemShipping = shippingFee * qty;

        // Per-product VAT rate (percentage)
        const vatRate = Number(p.vatRate || 0);
        const itemNet = unitPrice * qty;
        const itemVat = itemNet * (vatRate / 100);

        // Totals accumulation
        subtotal += itemNet;

        // ✅ NEW RULE
        shipping += itemShipping;

        vat += itemVat;

        return {
          productId: p._id,

          name: it?.name || p.name,
          category: p.category || "Uncategorized",
          image: it?.image || "",

          price: unitPrice,
          quantity: qty,

          // snapshot
          shippingFee,
          itemShipping: round2(itemShipping), // ✅ optional but helpful
          vatRate,
          vat: round2(itemVat),

          isOnSale: pricing.isOnSale,
          originalPrice: pricing.originalPrice,
        };
      }),
    );

    subtotal = round2(subtotal);
    shipping = round2(shipping);
    vat = round2(vat);

    const total = round2(subtotal + shipping + vat);

    const totals = {
      subtotal,
      shipping,
      vat,
      total,
      currency: "NGN",
    };

    // -----------------------------
    // Create order
    // -----------------------------
    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,

      // if route is protected for users, req.user will exist
      userId: req.user?._id || null,

      customer: {
        email: String(customer.email).toLowerCase().trim(),
        phone: String(customer.phone).trim(),
        fullName: String(customer.fullName).trim(),
      },

      shippingAddress: {
        street: shippingAddress.street,
        country: shippingAddress.country || "Nigeria",
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip || "",
      },

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

    return res.status(201).json({ success: true, data: order });
  } catch (err) {
    // ✅ CHG #2: turn stock/validation errors into 400 instead of 500
    const msg = String(err?.message || "Something went wrong");

    if (msg.startsWith("BAD_REQUEST:")) {
      return res.status(400).json({
        success: false,
        message: msg.replace("BAD_REQUEST:", "").trim(),
      });
    }

    return res.status(500).json({ success: false, message: msg });
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
      orderId: String(orderId).trim(),
      "customer.email": String(email).toLowerCase().trim(),
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
