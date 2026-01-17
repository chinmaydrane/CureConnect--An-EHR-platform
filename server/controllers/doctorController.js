import DoctorProfile from "../models/DoctorProfile.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js"

// Get doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Create or update doctor profile
export const upsertDoctorProfile = async (req, res) => {
  try {
    const { name, phoneNo, speciality, certifications, email, licenceNo, experience } = req.body;

    let profile = await DoctorProfile.findOne({ user: req.user.id });
    if (profile) {
      // update
      profile.name = name;
      profile.phoneNo = phoneNo;
      profile.speciality = speciality;
      profile.certifications = certifications;
      profile.email = email;
      profile.licenceNo = licenceNo;
      profile.experience = experience;
      await profile.save();
    } else {
      // create
      profile = await DoctorProfile.create({
        user: req.user.id,
        name,
        phoneNo,
        speciality,
        certifications,
        email,
        licenceNo,
        experience
      });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const lookupPatient = async (req, res) => {
  try {
    const { patientId } = req.params
    console.log("🔍 Lookup request received for:", patientId)

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" })
    }

    // Clean and normalize input
    const cleanedId = patientId.replace(/[-\s]/g, "").toUpperCase()
    console.log("🧹 Cleaned ID:", cleanedId)

    // Find patient by *exact* ID after cleaning
    const patient = await Patient.findOne({
      patientId: cleanedId,
    })

    console.log("🧾 Found patient:", patient)

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json({
      name: patient.name,
      age: patient.age,
      weight: patient.weight,
      height: patient.height,
      bloodGroup: patient.bloodGroup,
      phone: patient.phone,
      email: patient.email,
      emergencyContact: patient.emergencyContact,
    })
  } catch (err) {
    console.error("❌ Lookup error:", err)
    res.status(500).json({ message: "Server error while fetching patient" })
  }
}
