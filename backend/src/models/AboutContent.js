import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
});

const aboutContentSchema = new mongoose.Schema(
  {
    heroImage: imageSchema,

    aboutText: {
      type: String,
      default: "",
    },

    promiseText: {
      type: String,
      default: "",
    },

    promiseImages: {
      type: [imageSchema],
      validate: [arr => arr.length <= 4, "Max 4 promise images"],
      default: [],
    },

    mission: {
      type: String,
      default: "",
    },

    vision: {
      type: String,
      default: "",
    },

    history: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AboutContent", aboutContentSchema);
