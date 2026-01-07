import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const whyChooseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const homeContentSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      backgroundImage: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
      }
    },

    stats: {
      type: [statSchema],
      validate: {
        validator: (v) => v.length === 4,
        message: "Stats must contain exactly 4 items"
      }
    },

    whyChooseUs: {
      type: [whyChooseSchema],
      validate: {
        validator: (v) => v.length <= 5,
        message: "Why Choose Us cannot exceed 5 items"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("HomeContent", homeContentSchema);
