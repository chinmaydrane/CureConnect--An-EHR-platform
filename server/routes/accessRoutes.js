import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  sendAccessRequest,
  respondAccessRequest,
  verifyDoctorAccess,
  checkDoctorAccess,
} from "../controllers/accessController.js";

const router = express.Router();

// Doctor sends access request
router.post("/request", protect, sendAccessRequest);

// Patient responds
router.post("/respond", protect, respondAccessRequest);

// Doctor checks if they have valid access
router.get("/check/:patientId", protect, checkDoctorAccess);

// Middleware (example usage for protected patient data route)
router.get("/lookup/:patientId", protect, verifyDoctorAccess, async (req, res) => {
  // Example patient data fetch — replace with your logic
  res.json({ message: `Access granted to patient ${req.params.patientId}` });
});

export default router;
