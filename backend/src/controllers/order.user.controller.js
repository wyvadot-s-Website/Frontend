import Order from "../models/Order.js";

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    const q = { userId };

    const [items, total] = await Promise.all([
      Order.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(q),
    ]);

    res.json({
      success: true,
      items,
      page,
      limit,
      total,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const order = await Order.findOne({ _id: req.params.id, userId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const claimMyGuestOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    const userEmail = String(req.user?.email || "").toLowerCase().trim();
    if (!userId || !userEmail) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await Order.updateMany(
      { userId: null, "customer.email": userEmail },
      { $set: { userId } }
    );

    res.json({ success: true, matched: result.matchedCount ?? 0, modified: result.modifiedCount ?? 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
