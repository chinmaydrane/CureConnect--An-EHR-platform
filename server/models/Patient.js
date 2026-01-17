import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: String, unique: true }, // auto-generated
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  allergies: { type: [String], default: [] },
  emergencyContact: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

// 🔹 Auto-generate patientId before saving
patientSchema.pre("save", function (next) {
  if (!this.patientId) {
    this.patientId = "PAT" + Date.now().toString().slice(-6);
  }
  next(); 
});

export default mongoose.model("Patient", patientSchema);
