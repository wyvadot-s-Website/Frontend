import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendPaidOrderNotificationToShopAdmins } from "../config/email.js";
import { notifyAdminsByRoles, notifyUser } from "../utils/notify.js";

const PAYSTACK_BASE_URL =
  process.env.PAYSTACK_BASE_URL || "https://api.paystack.co";
const SECRET = process.env.PAYSTACK_SECRET_KEY;
const WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET || SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

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

  // no items -> nothing to do
  const items = Array.isArray(order.items) ? order.items : [];
  if (!items.length) {
    order.inventoryUpdated = true;
    order.inventoryUpdatedAt = new Date();
    await order.save();
    return { ok: true, skipped: true };
  }

  // Validate + decrement per quantity (atomic per product)
  for (const it of items) {
    if (!it?.productId) continue; // productId can be null in your schema

    const qty = Number(it.quantity || 0);
    if (qty < 1) continue;

    // Atomic check: only decrement if enough stock exists
    const result = await Product.updateOne(
      { _id: it.productId, stockQuantity: { $gte: qty } },
      { $inc: { stockQuantity: -qty, soldCount: qty } },
    );

    if (result.modifiedCount !== 1) {
      // Not enough stock OR missing product
      return {
        ok: false,
        reason: `Insufficient stock for ${it.name}`,
        productId: String(it.productId),
      };
    }

    // Because updateOne bypasses productSchema.pre("save"),
    // we must ensure status reflects stock after decrement.
    const p = await Product.findById(it.productId).select(
      "stockQuantity status",
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

  // Mark as done so webhook/verify won't double-decrement
  order.inventoryUpdated = true;
  order.inventoryUpdatedAt = new Date();
  await order.save();

  return { ok: true };
}

// 1) INIT (guest + user)
export const initPaystackPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, email } = req.body; // email required for guest

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    const method = normalizeMethod(paymentMethod);

    // ✅ If user is logged in, req.user exists
    // ✅ If guest, req.user is undefined, so email is required
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

    const reference = `${order.orderId}_${Date.now()}`;

    const channels = method === "bank_transfer" ? ["bank_transfer"] : ["card"];

    const payload = {
      email: order.customer.email,
      amount: amountKobo,
      reference,
      channels,
      callback_url: `${FRONTEND_URL}/payment/callback?orderId=${order.orderId}`,
      metadata: {
        orderId: order.orderId,
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
    order.payment.method = channels[0]; // "card" or "bank_transfer"
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

// 2) VERIFY (PUBLIC)
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

    const order = await Order.findOne({
      $or: [{ "payment.reference": reference }, { orderId }],
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found for reference" });
    }

    if (paid) {
      // only do paid actions once (idempotent)
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

        // email to shop-enabled admins (once)
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

        // DB notification to shop admins (once)
        await notifyAdminsByRoles({
          roles: SHOP_ALLOWED_ROLES,
          scope: "shop",
          title: "New paid order",
          message: `Order ${order.orderId} has been paid. Open Shop Management to process it.`,
          link: `/theboss/services?tab=orders&orderId=${order.orderId}`,
          meta: { orderId: order.orderId },
        });

        // DB notification to user (only if logged-in user)
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

        // inventory deduction
        const inv = await applyInventoryDeduction(order);
        if (!inv.ok) {
          order.updates.unshift({
            status: "processing",
            note: `Payment paid but inventory deduction failed: ${inv.reason || "unknown"}`,
            updatedBy: null,
          });
          await order.save();
        }
      }
    } else {
      // only mark failed when paystack says it's not successful
      order.payment.status = "failed";
      await order.save();
    }

    return res.json({ success: true, paid, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3) WEBHOOK (keep, but make sure rawBody exists)
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

    // ✅ Only handle successful charges
    if (event?.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const reference = event?.data?.reference;
    if (!reference) return res.sendStatus(200);

    // ✅ Find the order for this payment reference
    const order = await Order.findOne({ "payment.reference": reference });
    if (!order) return res.sendStatus(200);

    // ✅ Mark paid (idempotent)
    if (order.payment.status !== "paid") {
      order.payment.status = "paid";
      order.status = "processing";
      order.updates.unshift({
        status: "processing",
        note: "Payment confirmed via webhook",
        updatedBy: null,
      });
      await order.save();

      // ✅ Send email to shop-enabled admins (only once)
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

    // ✅ Deduct inventory once (idempotent)
    const inv = await applyInventoryDeduction(order);
    if (!inv.ok) {
      order.updates.unshift({
        status: "processing",
        note: `Webhook paid but inventory deduction failed: ${inv.reason || "unknown"}`,
        updatedBy: null,
      });
      await order.save();
    }

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
