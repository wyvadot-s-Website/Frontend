// controllers/product.controller.js
import Product from "../models/Product.js";

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

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      sort = "newest", // newest | price_asc | price_desc
      page = 1,
      limit = 12,
    } = req.query;

    const q = {
      status: { $in: ["active", "out_of_stock"] }, // show both
    };

    if (inStock === "true") {
      q.status = "active";
      q.stockQuantity = { $gt: 0 };
    }

    if (category && category !== "All") q.category = category;
    if (search) q.name = { $regex: search, $options: "i" };
    if (inStock === "true") q.stockQuantity = { $gt: 0 };

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 }, // base sort, frontend displays effectivePrice
      price_desc: { price: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);

    // We fetch first (same as before), then apply effective-price filtering in memory
    // because effectivePrice depends on time + oldPrice/saleEndsAt.
    const [rawItems, total] = await Promise.all([
      Product.find(q)
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(q),
    ]);

    // Attach pricing fields
    let items = rawItems.map((p) => {
      const pricing = buildPricing(p);
      return { ...p.toObject(), ...pricing };
    });

    // ✅ Apply min/max filtering against effectivePrice (not p.price)
    const hasMin =
      minPrice !== undefined && minPrice !== null && minPrice !== "";
    const hasMax =
      maxPrice !== undefined && maxPrice !== null && maxPrice !== "";
    if (hasMin || hasMax) {
      const min = hasMin ? Number(minPrice) : null;
      const max = hasMax ? Number(maxPrice) : null;

      items = items.filter((p) => {
        const ep = Number(p.effectivePrice || 0);
        if (min !== null && ep < min) return false;
        if (max !== null && ep > max) return false;
        return true;
      });
    }

    res.json({
      success: true,
      items,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: { $ne: "archived" },
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // hide draft products from public
    if (product.status === "draft") {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const pricing = buildPricing(product);

    res.json({
      success: true,
      item: { ...product.toObject(), ...pricing },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
