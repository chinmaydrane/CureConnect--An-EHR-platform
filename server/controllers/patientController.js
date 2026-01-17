import Patient from "../models/Patient.js"

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id })
    if (!patient) return res.status(404).json({ message: "Profile not found" })
    res.json(patient)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updatePatientProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ user: req.user.id })
    if (!patient) {
      patient = new Patient({ user: req.user.id, ...req.body })
    } else {
      Object.assign(patient, req.body)
    }
    await patient.save()
    res.json(patient)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
