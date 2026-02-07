import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendPaidOrderNotificationToShopAdmins } from "../config/email.js";
import { notifyAdminsByRoles, notifyUser } from "../utils/notify.js";
import { getPaystackConfig } from "../config/paystack.js";

const { BASE_URL: PAYSTACK_BASE_URL, SECRET, WEBHOOK_SECRET, FRONTEND_URL } =
  getPaystackConfig();

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

  const items = Array.isArray(order.items) ? order.items : [];
  if (!items.length) {
    order.inventoryUpdated = true;
    order.inventoryUpdatedAt = new Date();
    await order.save();
    return { ok: true, skipped: true };
  }

  for (const it of items) {
    if (!it?.productId) continue;

    const qty = Number(it.quantity || 0);
    if (qty < 1) continue;

    const result = await Product.updateOne(
      { _id: it.productId, stockQuantity: { $gte: qty } },
      { $inc: { stockQuantity: -qty, soldCount: qty } }
    );

    if (result.modifiedCount !== 1) {
      return {
        ok: false,
        reason: `Insufficient stock for ${it.name}`,
        productId: String(it.productId),
      };
    }

    // ensure status reflects stock after decrement.
    const p = await Product.findById(it.productId).select(
      "stockQuantity status"
    );
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

  order.inventoryUpdated = true;
  order.inventoryUpdatedAt = new Date();
  await order.save();

  return { ok: true };
}

// 1) INIT (guest + user)
export const initPaystackPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, email } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    // keep the user's preference (optional) but DO NOT restrict Paystack channels
    const preferredMethod = normalizeMethod(paymentMethod);

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

    // Reference must be unique
    const reference = `${order.orderId}_${Date.now()}`;

    // ✅ SHOW BOTH options on Paystack checkout
    const channels = ["card", "bank_transfer"];



    const payload = {
      email: order.customer.email,
      amount: amountKobo,
      reference,
      channels,
      callback_url: `${FRONTEND_URL}/payment/callback?orderId=${encodeURIComponent(
        order.orderId
      )}`,
      metadata: {
        orderId: order.orderId, // ✅ critical for verify safety
        userId: String(order.userId || ""),
        guestEmail: order.customer.email,
        preferredMethod, // optional (not source of truth)
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

    // ✅ store preference for now; we will overwrite with REAL channel on verify/webhook
    order.payment.method = preferredMethod; // "card" | "bank_transfer"

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

// 2) VERIFY (PUBLIC) — HARDENED
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
      }
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

    // ✅ CRITICAL FIX 1: find by reference only (prevents paying wrong order)
    const order = await Order.findOne({ "payment.reference": reference });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found for reference" });
    }

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
      if (order.payment.status !== "paid") {
        order.payment.status = "paid";
        order.payment.reference = reference;

        // ✅ REAL method used on Paystack
        order.payment.method = normalizeMethod(tx?.channel);

        order.status = "processing";
        order.updates.unshift({
          status: "processing",
          note: "Payment verified (Paystack)",
          updatedBy: null,
        });
        await order.save();

        const itemsCount = Array.isArray(order.items)
          ? order.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0)
          : 0;

        // You can keep these awaited or move to background later if you want faster verify response
        await sendPaidOrderNotificationToShopAdmins({
          orderId: order.orderId,
          total: order?.totals?.total,
          customerName: order?.customer?.fullName,
          customerEmail: order?.customer?.email,
          itemsCount,
          paymentMethod: order?.payment?.method,
          createdAt: order?.createdAt,
        });

        await notifyAdminsByRoles({
          roles: SHOP_ALLOWED_ROLES,
          scope: "shop",
          title: "New paid order",
          message: `Order ${order.orderId} has been paid. Open Shop Management to process it.`,
          link: `/theboss/services?tab=orders&orderId=${order.orderId}`,
          meta: { orderId: order.orderId },
        });

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

        const inv = await applyInventoryDeduction(order);
        if (!inv.ok) {
          order.updates.unshift({
            status: "processing",
            note: `Payment paid but inventory deduction failed: ${
              inv.reason || "unknown"
            }`,
            updatedBy: null,
          });
          await order.save();
        }
      }
    } else {
      // only mark failed if not success
      if (order.payment.status !== "paid") {
        order.payment.status = "failed";
        await order.save();
      }
    }

    return res.json({ success: true, paid, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

    // We always ACK quickly (Paystack retries if not 200)
    if (event?.event !== "charge.success") {
      return res.sendStatus(200);
    }

    // ✅ Respond immediately to avoid webhook timeout, then process async
    res.sendStatus(200);

    (async () => {
      try {
        const reference = event?.data?.reference;
        if (!reference) return;

        const order = await Order.findOne({ "payment.reference": reference });
        if (!order) return;

        // ✅ validate amount from webhook too
        const expectedAmount = Math.round(Number(order?.totals?.total || 0) * 100);
        const webhookAmount = Number(event?.data?.amount || 0);
        if (webhookAmount !== expectedAmount) {
          order.updates.unshift({
            status: order.status || "processing",
            note: `Webhook amount mismatch: expected ${expectedAmount}, got ${webhookAmount}`,
            updatedBy: null,
          });
          await order.save();
          return;
        }

        if (order.payment.status !== "paid") {
          order.payment.status = "paid";

          // ✅ REAL method used (card or bank_transfer)
          order.payment.method = normalizeMethod(event?.data?.channel);

          order.status = "processing";
          order.updates.unshift({
            status: "processing",
            note: "Payment confirmed via webhook",
            updatedBy: null,
          });
          await order.save();

          const itemsCount = Array.isArray(order.items)
            ? order.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0)
            : 0;

          // (optional) you can also make these fire-and-forget later
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

        const inv = await applyInventoryDeduction(order);
        if (!inv.ok) {
          order.updates.unshift({
            status: "processing",
            note: `Webhook paid but inventory deduction failed: ${
              inv.reason || "unknown"
            }`,
            updatedBy: null,
          });
          await order.save();
        }
      } catch (e) {
        console.error("paystackWebhook async error:", e?.message || e);
      }
    })();
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
