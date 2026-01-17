import express from "express";
import { createAppointment,getMyAppointments,getDoctorTodayQueue } from "../controllers/appointmentController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// ✅ PROTECTED ROUTE
router.post("/", protect, createAppointment);
router.get("/my", protect, getMyAppointments);
router.get("/doctor/today", protect, getDoctorTodayQueue);


export default router;
