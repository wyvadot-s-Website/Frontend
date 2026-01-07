import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
});

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      required: true,
    },

    image: {
      type: imageSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);

