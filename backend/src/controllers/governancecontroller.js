// controllers/governanceController.js
import { IssuedCertificate } from "../models/certificate.js";
import multer from "multer";
import path from "path";

// For MoUs we just keep file uploads in "uploads/mou"
const mouStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/mou/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const mouUpload = multer({ storage: mouStorage });

// In-memory MoUs (for simplicity; can be moved to DB if needed)
let MoUs = [];

// ✅ Upload a MoU (Memorandum of Understanding)
export const uploadMou = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "MoU file required" });

    const record = {
      id: MoUs.length + 1,
      filePath: req.file.path,
      validated: false,
      uploadedAt: new Date(),
    };
    MoUs.push(record);

    res.json({ message: "MoU uploaded", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Validate a MoU
export const validateMou = async (req, res) => {
  try {
    const { id } = req.params;
    const mou = MoUs.find((m) => m.id == id);
    if (!mou) return res.status(404).json({ message: "MoU not found" });

    mou.validated = true;
    res.json({ message: "MoU validated", mou });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ List all MoUs
export const listMous = async (_req, res) => {
  res.json(MoUs);
};

// ✅ Validate Certificate
export const validateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await IssuedCertificate.findOne({ certificateId });
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    cert.isValid = true;
    await cert.save();
    res.json({ message: "Certificate validated", cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Invalidate Certificate
export const invalidateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await IssuedCertificate.findOne({ certificateId });
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    cert.isValid = false;
    await cert.save();
    res.json({ message: "Certificate invalidated", cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
