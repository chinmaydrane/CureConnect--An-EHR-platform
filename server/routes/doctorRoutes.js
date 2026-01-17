import express from "express";
import { getDoctorProfile, upsertDoctorProfile ,lookupPatient} from "../controllers/doctorController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// get profile
router.get("/profile", protect, getDoctorProfile);
router.get("/lookup/:patientId", lookupPatient);

// create/update profile
router.post("/profile", protect, upsertDoctorProfile);



export default router;
