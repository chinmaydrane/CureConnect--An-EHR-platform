import express from "express";
import multer from "multer";
import { protect } from "../middlewares/auth.js"; // make sure this path matches your project
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";
import Report from "../models/Report.js";
import Patient from "../models/Patient.js";
import { addBlock } from "../services/blockchain.js"; // <-- import

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/report/upload
// router.post("/upload", protect, upload.single("file"), async (req, res) => {
//   try {
//     const { patientId, type } = req.body;

//     if (!req.file || !patientId || !type) {
//       return res.status(400).json({ message: "Patient ID, type, and file are required." });
//     }

//     // ✅ Step 1: Check if patient exists
//     const patient = await Patient.findOne({patientId }) // or { patientId } depending on your schema
//     if (!patient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     // Debug log
//     console.log("Report upload request:", {
//       filename: req.file.originalname,
//       mimetype: req.file.mimetype,
//       size: req.file.size,
//       patientId,
//       type,
//       uploader: req.user ? (req.user._id || req.user.id) : null,
//     });

//     // ✅ Step 2: Upload to Cloudinary
//     const uploaded = await uploadBufferToCloudinary(
//       req.file.buffer,
//       req.file.originalname,
//       req.file.mimetype
//     );

//     // ✅ Step 3: Save report
//     const report = new Report({
//       patientId,
//       type,
//       url: uploaded.secure_url,
//       filename: req.file.originalname,
//       uploadedBy: req.user?._id || req.user?.id,
//     });

//     await report.save();

//     res.status(200).json({ message: "Report uploaded successfully", report });
//   } catch (err) {
//     console.error("Report upload error:", err);
//     res.status(500).json({ message: "Something went wrong while uploading the report." });
//   }
// });

// new router for uploading report with blockchain
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    const { patientId, type } = req.body;

    if (!req.file || !patientId || !type) {
      return res.status(400).json({ message: "Patient ID, type, and file are required." });
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    console.log("Report upload request:", {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      patientId,
      type,
      uploader: req.user ? (req.user._id || req.user.id) : null,
    });

    // Upload to Cloudinary (ensure uploadBufferToCloudinary returns secure_url and public_id)
    const uploaded = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Create report object (without blockHash yet)
    const report = new Report({
      patientId,
      type,
      url: uploaded.secure_url,
      filename: req.file.originalname,
      uploadedBy: req.user?._id || req.user?.id,
      cloudinaryPublicId: uploaded.public_id, // store public_id if returned
    });

    await report.save();

    // Build blockchain data (keep only necessary fields)
    const blockData = {
      reportId: report._id.toString(),
      patientId,
      uploaderId: req.user?._id?.toString() || req.user?.id,
      cloudinaryUrl: uploaded.secure_url,
      public_id: uploaded.public_id || null,
      uploadedAt: report.createdAt || new Date().toISOString(),
    };

    // Add block to chain
    const block = await addBlock(blockData);

    // Save block hash into report for quick reference
    report.blockHash = block.hash;
    await report.save();

    res.status(200).json({ message: "Report uploaded successfully", report, block });
  } catch (err) {
    console.error("Report upload error:", err);
    res.status(500).json({ message: "Something went wrong while uploading the report." });
  }
});


router.get("/patient/:patientId", protect, async (req, res) => {
  try {
    const { patientId } = req.params
    const reports = await Report.find({ patientId }).sort({ createdAt: -1 })
    if (!reports.length) return res.status(404).json({ message: "No reports found" })
    res.status(200).json(reports)
  } catch (err) {
    console.error("Fetch reports error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// router.delete("/:reportId", protect, async (req, res) => {
//   try {
//     const { reportId } = req.params
//     const report = await Report.findById(reportId)
//     if (!report) return res.status(404).json({ message: "Report not found" })
//     await report.deleteOne()
//     res.status(200).json({ message: "Report deleted successfully" })
//   } catch (err) {
//     console.error("Delete report error:", err)
//     res.status(500).json({ message: "Failed to delete report" })
//   }
// })

// export default router;



router.delete("/:reportId", protect, async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // keep a copy of needed fields BEFORE deleting
    const reportSnapshot = {
      reportId: report._id.toString(),
      patientId: report.patientId,
      type: report.type,
      url: report.url,
      cloudinaryPublicId: report.cloudinaryPublicId || null,
      uploadedBy: report.uploadedBy ? report.uploadedBy.toString() : null,
      uploadedAt: report.createdAt ? report.createdAt.toISOString() : null,
    };

    // delete the report from normal collection
    await report.deleteOne();

    // append a new block that records this deletion
    await addBlock({
      action: "REPORT_DELETED",
      ...reportSnapshot,
      deletedAt: new Date().toISOString(),
      deletedBy: req.user?._id?.toString() || req.user?.id || null,
    });

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ message: "Failed to delete report" });
  }
});

export default router;