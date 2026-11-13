import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const shopContentSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "Shop" },
      subtitle: { type: String, default: "" },
      backgroundImages: {
        type: [imageSchema],
        default: [],
        validate: {
          validator: (images) => images.length <= 4,
          message: "Hero background images cannot exceed 4 items",
        },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShopContent", shopContentSchema);
