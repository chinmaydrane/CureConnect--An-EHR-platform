import mongoose from "mongoose";

const accessRequestSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String, required: true },
   patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("AccessRequest", accessRequestSchema);
