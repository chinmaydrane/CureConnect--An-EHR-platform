import Admin from "../models/Admin.js";

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ user: req.user.id }); // link user id
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateAdminProfile = async (req, res) => {
  try {
    let admin = await Admin.findOne({ user: req.user.id })
    if (!admin) {
      admin = new Admin({ user: req.user.id, ...req.body })
    } else {
      Object.assign(admin, req.body)
    }
    await admin.save()
    res.json(admin)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}