import Order from "../models/Order.js";
import { notifyUser } from "../utils/notify.js";

// Admin list
export const getAdminOrders = async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;

  const q = {};
  if (status) q.status = status;

  if (search) {
    const s = String(search).trim();
    q.$or = [
      { orderId: { $regex: s, $options: "i" } },
      { "customer.email": { $regex: s, $options: "i" } },
      { "customer.phone": { $regex: s, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Order.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(q),
  ]);

  res.json({
    success: true,
    items,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
};

export const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateOrderAdmin = async (req, res) => {
  try {
    const { status, note, downloads } = req.body;

    if (status && !["processing", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // ✅ status + update note
    if (status) {
      order.status = status;
      order.updates.unshift({
        status,
        note: note || "",
        updatedBy: req.admin?._id || null,
      });
    } else if (note) {
      // allow “note-only” update (optional)
      order.updates.unshift({
        status: order.status || "processing",
        note,
        updatedBy: req.admin?._id || null,
      });
    }

    // ✅ downloads append (array)
    if (Array.isArray(downloads) && downloads.length) {
      const valid = downloads
        .filter((d) => d?.name && d?.url)
        .map((d) => ({
          name: String(d.name).trim(),
          url: String(d.url).trim(),
          addedBy: req.admin?._id || null,
        }));

      if (valid.length) {
        // add newest first
        order.downloads.unshift(...valid);
      }
    }

    await order.save();

    // ✅ notify user (if linked user)
    if (order.userId) {
      await notifyUser({
        userId: order.userId,
        scope: "shop",
        title: "Order Updated",
        message: `Your order ${order.orderId} has been updated.`,
        link: `/home`,
        meta: { orderId: order.orderId, dbId: String(order._id) },
      });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};