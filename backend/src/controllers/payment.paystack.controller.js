import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendPaidOrderNotificationToShopAdmins } from "../config/email.js";
import { notifyAdminsByRoles, notifyUser } from "../utils/notify.js";
<<<<<<< HEAD

const PAYSTACK_BASE_URL =
  process.env.PAYSTACK_BASE_URL || "https://api.paystack.co";
const SECRET = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET || SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
=======
import { getPaystackConfig } from "../config/paystack.js";

const { BASE_URL: PAYSTACK_BASE_URL, SECRET, WEBHOOK_SECRET, FRONTEND_URL } =
  getPaystackConfig();
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e

const SHOP_ALLOWED_ROLES = [
  "super_admin",
  "shop_admin",
  "content_shop_admin",
  "shop_project_admin",
];

// helper
const normalizeMethod = (m) => {
  if (m === "bank" || m === "bank_transfer") return "bank_transfer";
  return "card";
};

async function applyInventoryDeduction(order) {
  // already done
  if (order.inventoryUpdated) return { ok: true, skipped: true };

<<<<<<< HEAD
  // no items -> nothing to do
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
  const items = Array.isArray(order.items) ? order.items : [];
  if (!items.length) {
    order.inventoryUpdated = true;
    order.inventoryUpdatedAt = new Date();
    await order.save();
    return { ok: true, skipped: true };
  }

<<<<<<< HEAD
  // Validate + decrement per quantity (atomic per product)
  for (const it of items) {
    if (!it?.productId) continue; // productId can be null in your schema
=======
  for (const it of items) {
    if (!it?.productId) continue;
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e

    const qty = Number(it.quantity || 0);
    if (qty < 1) continue;

<<<<<<< HEAD
    // Atomic check: only decrement if enough stock exists
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    const result = await Product.updateOne(
      { _id: it.productId, stockQuantity: { $gte: qty } },
      { $inc: { stockQuantity: -qty, soldCount: qty } },
    );

    if (result.modifiedCount !== 1) {
<<<<<<< HEAD
      // Not enough stock OR missing product
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
      return {
        ok: false,
        reason: `Insufficient stock for ${it.name}`,
        productId: String(it.productId),
      };
    }

<<<<<<< HEAD
    // Because updateOne bypasses productSchema.pre("save"),
    // we must ensure status reflects stock after decrement.
    const p = await Product.findById(it.productId).select(
      "stockQuantity status",
    );
=======
    // ensure status reflects stock after decrement.
    const p = await Product.findById(it.productId).select("stockQuantity status");
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    if (p) {
      if ((p.stockQuantity ?? 0) <= 0 && p.status === "active") {
        p.status = "out_of_stock";
        await p.save();
      }
      if ((p.stockQuantity ?? 0) > 0 && p.status === "out_of_stock") {
        p.status = "active";
        await p.save();
      }
    }
  }

<<<<<<< HEAD
  // Mark as done so webhook/verify won't double-decrement
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
  order.inventoryUpdated = true;
  order.inventoryUpdatedAt = new Date();
  await order.save();

  return { ok: true };
}

// 1) INIT (guest + user)
export const initPaystackPayment = async (req, res) => {
  try {
<<<<<<< HEAD
    const { orderId, paymentMethod, email } = req.body; // email required for guest
=======
    const { orderId, paymentMethod, email } = req.body;
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    const method = normalizeMethod(paymentMethod);

<<<<<<< HEAD
    // ✅ If user is logged in, req.user exists
    // ✅ If guest, req.user is undefined, so email is required
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    let order = null;

    if (req.user?._id) {
      order = await Order.findOne({ orderId, userId: req.user._id });
    } else {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "email is required for guest payment",
        });
      }
      order = await Order.findOne({
        orderId,
        "customer.email": String(email).toLowerCase().trim(),
      });
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const amountKobo = Math.round(Number(order?.totals?.total || 0) * 100);
    if (!amountKobo) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order total" });
    }

<<<<<<< HEAD
    const reference = `${order.orderId}_${Date.now()}`;

=======
    // Reference must be unique
    const reference = `${order.orderId}_${Date.now()}`;
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    const channels = method === "bank_transfer" ? ["bank_transfer"] : ["card"];

    const payload = {
      email: order.customer.email,
      amount: amountKobo,
      reference,
      channels,
<<<<<<< HEAD
      callback_url: `${FRONTEND_URL}/payment/callback?orderId=${order.orderId}`,
      metadata: {
        orderId: order.orderId,
=======
      callback_url: `${FRONTEND_URL}/payment/callback?orderId=${encodeURIComponent(
        order.orderId,
      )}`,
      metadata: {
        orderId: order.orderId, // ✅ critical for verify safety
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        userId: String(order.userId || ""),
        guestEmail: order.customer.email,
      },
    };

    const psRes = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await psRes.json();
    if (!psRes.ok || data.status === false) {
      return res.status(400).json({
        success: false,
        message: data.message || "Paystack init failed",
        paystack: data,
      });
    }

    order.payment.reference = reference;
<<<<<<< HEAD
    order.payment.method = channels[0]; // "card" or "bank_transfer"
=======
    order.payment.method = channels[0];
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    order.payment.status = "pending";
    await order.save();

    return res.json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

<<<<<<< HEAD
// 2) VERIFY (PUBLIC)
=======
// 2) VERIFY (PUBLIC) — HARDENED
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
export const verifyPaystackPayment = async (req, res) => {
  try {
    const { reference, orderId } = req.query;

    if (!reference) {
      return res
        .status(400)
        .json({ success: false, message: "reference is required" });
    }

    const psRes = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${SECRET}` },
      },
    );

    const data = await psRes.json();
    if (!psRes.ok || data.status === false) {
      return res.status(400).json({
        success: false,
        message: data.message || "Verification failed",
      });
    }

    const tx = data.data;
    const paid = tx.status === "success";

<<<<<<< HEAD
    const order = await Order.findOne({
      $or: [{ "payment.reference": reference }, { orderId }],
    });
=======
    // ✅ CRITICAL FIX 1: find by reference only (prevents paying wrong order)
    const order = await Order.findOne({ "payment.reference": reference });
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found for reference" });
    }

<<<<<<< HEAD
    if (paid) {
      // only do paid actions once (idempotent)
=======
    // ✅ Optional consistency check: orderId passed in callback must match
    if (orderId && String(orderId) !== String(order.orderId)) {
      return res.status(400).json({
        success: false,
        message: "Order mismatch for this reference",
      });
    }

    // ✅ CRITICAL FIX 2: verify amount & metadata
    const expectedAmount = Math.round(Number(order?.totals?.total || 0) * 100);
    if (Number(tx.amount) !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: "Amount mismatch. Verification rejected.",
      });
    }

    const metaOrderId = tx?.metadata?.orderId;
    if (metaOrderId && String(metaOrderId) !== String(order.orderId)) {
      return res.status(400).json({
        success: false,
        message: "Metadata order mismatch. Verification rejected.",
      });
    }

    if (paid) {
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
      if (order.payment.status !== "paid") {
        order.payment.status = "paid";
        order.payment.reference = reference;
        order.status = "processing";
        order.updates.unshift({
          status: "processing",
          note: "Payment verified (Paystack)",
          updatedBy: null,
        });
        await order.save();

<<<<<<< HEAD
        // email to shop-enabled admins (once)
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        const itemsCount = Array.isArray(order.items)
          ? order.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0)
          : 0;

        await sendPaidOrderNotificationToShopAdmins({
          orderId: order.orderId,
          total: order?.totals?.total,
          customerName: order?.customer?.fullName,
          customerEmail: order?.customer?.email,
          itemsCount,
          paymentMethod: order?.payment?.method,
          createdAt: order?.createdAt,
        });

<<<<<<< HEAD
        // DB notification to shop admins (once)
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        await notifyAdminsByRoles({
          roles: SHOP_ALLOWED_ROLES,
          scope: "shop",
          title: "New paid order",
          message: `Order ${order.orderId} has been paid. Open Shop Management to process it.`,
          link: `/theboss/services?tab=orders&orderId=${order.orderId}`,
          meta: { orderId: order.orderId },
        });

<<<<<<< HEAD
        // DB notification to user (only if logged-in user)
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        if (order.userId) {
          await notifyUser({
            userId: order.userId,
            scope: "shop",
            title: "Payment confirmed",
            message: `Your payment for order ${order.orderId} was confirmed. We’ll start processing it.`,
            link: `/home`,
            meta: { orderId: order.orderId },
          });
        }

<<<<<<< HEAD
        // inventory deduction
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        const inv = await applyInventoryDeduction(order);
        if (!inv.ok) {
          order.updates.unshift({
            status: "processing",
<<<<<<< HEAD
            note: `Payment paid but inventory deduction failed: ${inv.reason || "unknown"}`,
=======
            note: `Payment paid but inventory deduction failed: ${
              inv.reason || "unknown"
            }`,
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
            updatedBy: null,
          });
          await order.save();
        }
      }
    } else {
<<<<<<< HEAD
      // only mark failed when paystack says it's not successful
      order.payment.status = "failed";
      await order.save();
=======
      // only mark failed if not success
      if (order.payment.status !== "paid") {
        order.payment.status = "failed";
        await order.save();
      }
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    }

    return res.json({ success: true, paid, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

<<<<<<< HEAD
// 3) WEBHOOK (keep, but make sure rawBody exists)
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
// 3) WEBHOOK (PUBLIC)
export const paystackWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];

    const hash = crypto
      .createHmac("sha512", WEBHOOK_SECRET)
      .update(req.rawBody || Buffer.from(JSON.stringify(req.body)))
      .digest("hex");

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

<<<<<<< HEAD
    // ✅ Only handle successful charges
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    if (event?.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const reference = event?.data?.reference;
    if (!reference) return res.sendStatus(200);

<<<<<<< HEAD
    // ✅ Find the order for this payment reference
    const order = await Order.findOne({ "payment.reference": reference });
    if (!order) return res.sendStatus(200);

    // ✅ Mark paid (idempotent)
=======
    const order = await Order.findOne({ "payment.reference": reference });
    if (!order) return res.sendStatus(200);

    // ✅ extra safety: validate amount from webhook too
    const expectedAmount = Math.round(Number(order?.totals?.total || 0) * 100);
    const webhookAmount = Number(event?.data?.amount || 0);
    if (webhookAmount !== expectedAmount) {
      order.updates.unshift({
        status: order.status || "processing",
        note: `Webhook amount mismatch: expected ${expectedAmount}, got ${webhookAmount}`,
        updatedBy: null,
      });
      await order.save();
      return res.sendStatus(200);
    }

>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    if (order.payment.status !== "paid") {
      order.payment.status = "paid";
      order.status = "processing";
      order.updates.unshift({
        status: "processing",
        note: "Payment confirmed via webhook",
        updatedBy: null,
      });
      await order.save();

<<<<<<< HEAD
      // ✅ Send email to shop-enabled admins (only once)
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
      const itemsCount = Array.isArray(order.items)
        ? order.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0)
        : 0;

      await sendPaidOrderNotificationToShopAdmins({
        orderId: order.orderId,
        total: order?.totals?.total,
        customerName: order?.customer?.fullName,
        customerEmail: order?.customer?.email,
        itemsCount,
        paymentMethod: order?.payment?.method,
        createdAt: order?.createdAt,
      });
    }

<<<<<<< HEAD
    // ✅ Deduct inventory once (idempotent)
=======
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
    const inv = await applyInventoryDeduction(order);
    if (!inv.ok) {
      order.updates.unshift({
        status: "processing",
<<<<<<< HEAD
        note: `Webhook paid but inventory deduction failed: ${inv.reason || "unknown"}`,
=======
        note: `Webhook paid but inventory deduction failed: ${
          inv.reason || "unknown"
        }`,
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
        updatedBy: null,
      });
      await order.save();
    }

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
<<<<<<< HEAD
};
=======
<<<<<<< HEAD
};
=======
};
>>>>>>> 6efa17bfc8de01febad764d06598d1a8e2c3442e
>>>>>>> aedcdb623a7852626e88ab5fa528adbe00bff313
