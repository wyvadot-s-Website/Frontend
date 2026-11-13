import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema({
  serviceKey: {
    type: String,
    required: true,
    enum: [
      "project_management_resourcing",
      "core_engineering_construction",
      "facilities_management_maintenance",
      "energy_process_services",
      "technology_ecommerce",
      "general_contracts",
    ],
  },
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
  highlights: { type: [String], default: [] },
  image: imageSchema,
  order: { type: Number, required: true, min: 0 },
  isVisible: { type: Boolean, default: true },
});

const servicesContentSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "Our Services" },
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
    intro: {
      heading: {
        type: String,
        default: "What we Build, We Build With Purpose",
      },
      description: {
        type: String,
        default:
          "Our multidisciplinary team delivers engineering construction, and maintenance solutions with precision and purpose",
      },
    },
    cta: {
      heading: { type: String, default: "Ready to start your project?" },
      description: {
        type: String,
        default:
          "Tell us about your needs and our team will help you find the right solution.",
      },
      buttonText: { type: String, default: "Contact Us" },
      buttonLink: { type: String, default: "/contact" },
    },
    services: {
      type: [serviceSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServicesContent", servicesContentSchema);
