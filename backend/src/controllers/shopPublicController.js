import ShopContent from "../models/ShopContent.js";
import { getOrCreateShopContent } from "../utils/getOrCreateShopContent.js";

export const getShopContentPublic = async (req, res) => {
  try {
    const content = await getOrCreateShopContent();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
