// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import DoctorProfile from "../models/DoctorProfile.js";
import mongoose from "mongoose";

/**
 * Helper: resolve patient by either PATxxxxx or Mongo _id
 */
async function resolvePatient(input) {
  if (!input) return null;
  // If looks like Mongo ObjectId
  if (mongoose.Types.ObjectId.isValid(input)) {
    const p = await Patient.findById(input);
    if (p) return p;
  }
  // else try patientId (PATxxxxx)
  return await Patient.findOne({ patientId: input });
}

/**
 * Helper: resolve doctor by either DOCxxxxx or Mongo _id
 */
async function resolveDoctor(input) {
  if (!input) return null;
  if (mongoose.Types.ObjectId.isValid(input)) {
    const d = await DoctorProfile.findById(input);
    if (d) return d;
  }
  // else try doctorId (DOCxxxxx)
  return await DoctorProfile.findOne({ doctorId: input });
}

export async function createAppointment(req, res) {
  try {
    // console.log("➡️ POST /api/appointments body:", req.body);

    const { doctorId, preferredDate, preferredTime, notes } = req.body;

    const cleanedDoctorId = doctorId.trim();



    if (!cleanedDoctorId || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: "doctorId, preferredDate and preferredTime are required." });
    }

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found." });
    }

    const doctor = await resolveDoctor(cleanedDoctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Enter correct doctor ID." });
    }

    // ✅ STEP 3: Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      preferredDate,
      preferredTime,
      notes: notes || "",
    });

    await appointment.populate([
      { path: "patient", select: "patientId name" },
      { path: "doctor", select: "doctorId name speciality" },
    ]);

    console.log("✅ Appointment created:", appointment.appointmentId);

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });

  } catch (err) {
    console.error("axios error full:", err);

    const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.msg ||
      "Enter correct doctor ID.";

    toast.error(errorMsg);

  }
}


// GET /api/appointments/my
export async function getMyAppointments(req, res) {
  try {
    // 1️⃣ Find patient using logged-in user
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found." });
    }

    // 2️⃣ Find appointments
    const appointments = await Appointment.find({ patient: patient._id })
      .populate({
        path: "doctor",
        select: "name speciality doctorId",
      })
      .sort({ createdAt: -1 });

    res.json({ appointments });
  } catch (err) {
    console.error("❌ getMyAppointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


// GET /api/appointments/doctor/today
export async function getDoctorTodayQueue(req, res) {
  try {
    // 1️⃣ Find doctor profile
    const doctor = await DoctorProfile.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    // 2️⃣ Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // 3️⃣ Fetch today's appointments
    const appointments = await Appointment.find({
      doctor: doctor._id,
    })
      .populate({
        path: "patient",
        select: "name age patientId",
      })
      .sort({ preferredTime: 1 });

    res.json({ appointments });
  } catch (err) {
    console.error("❌ getDoctorTodayQueue error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


