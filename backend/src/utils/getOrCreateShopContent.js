import ShopContent from "../models/ShopContent.js";

export async function getOrCreateShopContent() {
  let content = await ShopContent.findOne();

  if (!content) {
    content = await ShopContent.create({
      hero: {
        title: "Shop",
        subtitle: "",
        backgroundImages: [],
      },
    });
  }

  return content;
}
