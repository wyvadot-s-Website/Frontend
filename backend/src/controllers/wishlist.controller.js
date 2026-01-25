import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";

// GET /api/user/wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("wishlist");
    const ids = user?.wishlist || [];

    // Return full product objects for UI
    const products = await Product.find({
      _id: { $in: ids },
      status: { $ne: "archived" },
    }).sort({ createdAt: -1 });

    res.json({ success: true, items: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/user/wishlist/toggle  { productId }
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(String(productId))) {
      return res.status(400).json({ success: false, message: "Valid productId is required" });
    }

    const user = await User.findById(userId).select("wishlist");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const pid = String(productId);
    const exists = (user.wishlist || []).some((id) => String(id) === pid);

    if (exists) {
      user.wishlist = user.wishlist.filter((id) => String(id) !== pid);
      await user.save();
      return res.json({ success: true, wished: false });
    } else {
      user.wishlist.push(productId);
      await user.save();
      return res.json({ success: true, wished: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/user/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(String(productId))) {
      return res.status(400).json({ success: false, message: "Valid productId is required" });
    }

    await User.updateOne(
      { _id: userId },
      { $pull: { wishlist: productId } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
