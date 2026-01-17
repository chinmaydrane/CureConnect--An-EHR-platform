import express from "express";
import multer from "multer";
import {
  getAIResponse,
  getDietFromText,
  getDietFromReport,
  summarizeReport,
} from "../controllers/aiController.js";
import axios from "axios";
import dotenv from "dotenv";
// Load env vars
dotenv.config();
import cors from "cors";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🩺 Text-based health assistant
router.post("/health", getAIResponse);

// 🍎 Diet routes
router.post("/diet-text", getDietFromText);
router.post("/diet-report", upload.single("file"), getDietFromReport);

// 🧾 Summarize report
router.post("/summarize", summarizeReport); 


// for diet model trained using flask
router.get("/diet-with-model", async (req, res) => {
  try {
    console.log("DIET_MODEL_API_URL:", process.env.DIET_MODEL_API_URL);

    const base = process.env.DIET_MODEL_API_URL;
    const flaskUrl = `${base}/diet-with-model`;
    console.log("Flask URL being called:", flaskUrl);

    const response = await axios.get(flaskUrl);
    return res.json(response.data);
  } catch (error) {
    console.error("Error calling Flask diet model:", error);
    return res.status(500).json({ error: "Failed to fetch model report" });
  }
});



export default router;
