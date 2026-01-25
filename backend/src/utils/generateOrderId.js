import OrderCounter from "../models/OrderCounter.js";

export async function generateOrderId() {
  const counter = await OrderCounter.findOneAndUpdate(
    { key: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const num = counter.seq;
  const padded = String(num).padStart(4, "0");
  return `ORD-${padded}`;
}
