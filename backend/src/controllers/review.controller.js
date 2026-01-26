import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

async function recalcProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;

  await Product.updateOne(
    { _id: productId },
    { $set: { ratingAverage: Number(avg.toFixed(2)), ratingCount: count } }
  );

  return { ratingAverage: Number(avg.toFixed(2)), ratingCount: count };
}

// GET /api/products/:productId/reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(String(productId))) {
      return res.status(400).json({ success: false, message: "Valid productId is required" });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({ success: true, items: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/products/:productId/reviews  (login-only) upsert
export const upsertReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(String(productId))) {
      return res.status(400).json({ success: false, message: "Valid productId is required" });
    }

    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    await Review.findOneAndUpdate(
      { product: productId, user: userId },
      { $set: { rating: r, comment: String(comment || "").trim() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const stats = await recalcProductRating(productId);
    res.json({ success: true, ...stats });
  } catch (err) {
    // handle unique index race
    if (err?.code === 11000) {
      const stats = await recalcProductRating(req.params.productId);
      return res.json({ success: true, ...stats });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:productId/reviews/mine  (login-only)
export const deleteMyReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(String(productId))) {
      return res.status(400).json({ success: false, message: "Valid productId is required" });
    }

    await Review.deleteOne({ product: productId, user: userId });

    const stats = await recalcProductRating(productId);
    res.json({ success: true, ...stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};