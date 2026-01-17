import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Patient from "../models/Patient.js";
// Utility function to generate an 8-char alphanumeric ID
const generatePatientId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let id = ""
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// @desc    Register user
// @route   POST /api/auth/register
export const signup = async (req, res) => {
  const { email, password, role } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ msg: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)

    let patientId = null
    if (role === "patient") {
      let unique = false
      while (!unique) {
        patientId = generatePatientId()
        const existing = await User.findOne({ patientId })
        if (!existing) unique = true
      }
    }

    user = await User.create({
      email,
      password: hashedPassword,
      role,
      patientId
    })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...(role === "patient" && { patientId: user.patientId })
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server error" })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

    let patientId = null;

    // 🔹 if role is patient, fetch linked patient record
    if (user.role === "patient") {
      const patient = await Patient.findOne({ user: user._id });
      if (patient) patientId = patient.patientId;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        patientId,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server error" })
  }
}
