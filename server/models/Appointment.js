import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },

    preferredDate: {
      type: String,
      required: true,
    },

    preferredTime: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    appointmentId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// 🔹 Auto-generate appointmentId before saving
appointmentSchema.pre("save", function (next) {
  if (!this.appointmentId) {
    this.appointmentId = "APT" + Date.now().toString().slice(-6);
  }
  next();
});

export default mongoose.model("Appointment", appointmentSchema);
