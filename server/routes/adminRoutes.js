import express from "express";
import { getAdminProfile,updateAdminProfile } from "../controllers/adminController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile", protect, getAdminProfile);
router.post("/profile", protect, updateAdminProfile);


export default router;
