import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  doctorId: { type: String, unique: true }, // auto-generated
  name: { type: String, required: true },
  phoneNo: { type: String, required: true },
  speciality: { type: String, required: true },
  certifications: { type: String },
  email: { type: String, required: true },
  licenceNo: { type: String, required: true },
  experience: { type: Number, required: true } // in years
}, { timestamps: true });

doctorProfileSchema.pre("save", function (next) {
  if (!this.doctorId) {
    this.doctorId = "DOC" + Date.now().toString().slice(-6);
  }
  next(); 
});

export default mongoose.model("DoctorProfile", doctorProfileSchema);
