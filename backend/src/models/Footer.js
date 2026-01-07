import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    address: String,
    phone: String,
    email: String,

    socialLinks: {
      whatsapp: String,
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Footer", footerSchema);
