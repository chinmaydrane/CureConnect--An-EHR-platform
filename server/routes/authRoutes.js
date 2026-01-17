import express from "express"
import { signup, login } from "../controllers/authController.js"

const router = express.Router()

// Register new user
router.post("/register", signup)   // frontend signup page hits this

// Login existing user
router.post("/login", login)

export default router
