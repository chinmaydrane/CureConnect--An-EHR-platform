// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String },
    message: { type: String, required: true },
    type: { type: String, enum: ["access", "system"], default: "system" },
    read: { type: Boolean, default: false },

    // ⭐ NEW FIELD
    relatedRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccessRequest",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
