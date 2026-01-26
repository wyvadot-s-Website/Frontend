import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // who receives it
    recipientType: { type: String, enum: ["admin", "user"], required: true },
    recipientAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // category decides routing/permission logic on frontend (optional)
    scope: { type: String, enum: ["shop", "project", "system"], default: "system" },

    title: { type: String, required: true },
    message: { type: String, default: "" },

    // link target (frontend can route user)
    link: { type: String, default: "" },

    // read status
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },

    // metadata (optional but useful)
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);