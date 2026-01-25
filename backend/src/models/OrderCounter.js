import mongoose from "mongoose";

const orderCounterSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true }, // "order"
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("OrderCounter", orderCounterSchema);
