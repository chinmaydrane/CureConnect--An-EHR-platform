import express from "express"
import { getPatientProfile, updatePatientProfile } from "../controllers/patientController.js"
import { protect } from "../middlewares/auth.js"

const router = express.Router()

router.get("/profile", protect, getPatientProfile)
router.post("/profile", protect, updatePatientProfile)

export default router
