 // src/controllers/certificateController.js
import { CertificateTemplate, IssuedCertificate } from "../models/certificate.js";
import Course from "../models/course.js";
import User from "../models/user.js";
import crypto from "crypto";
import path from "path";

/**
 * ==========================
 * TEMPLATE MANAGEMENT (SuperAdmin Only)
 * ==========================
 */
 export const createTemplate = async (req, res) => {
  try {
    // Ensure name and signatoryName exist
    const name = req.body.name ? req.body.name.trim() : "";
    const signatoryName = req.body.signatoryName ? req.body.signatoryName.trim() : "";

    if (!name || !signatoryName) {
      return res.status(400).json({ message: "Template name or the signatory name required" });
    }

    // designUrl is optional
    const designUrl = req.body.designUrl ? req.body.designUrl.trim() : "";

    // Handle fields array safely
    let fields = ["studentName", "courseId", "score"];
    if (req.body.fields) {
      try {
        // Try parsing JSON array
        fields = JSON.parse(req.body.fields);
        if (!Array.isArray(fields)) fields = ["studentName", "courseId", "score"];
      } catch {
        // If not JSON, treat as comma-separated string
        fields = req.body.fields.split(",").map(f => f.trim());
      }
    }

    // Optional file upload
    let signatoryFilePath = "";
    if (req.files && req.files.signatoryFile) {
      const file = req.files.signatoryFile;
      const uploadPath = path.join("src", "uploads", "signatories", Date.now() + "-" + file.name);
      await file.mv(uploadPath);
      signatoryFilePath = "/" + uploadPath.replace(/\\/g, "/");
    }

    const tpl = await CertificateTemplate.create({
      name,
      designUrl,
      signatory: {
        name: signatoryName,
        imageUrl: signatoryFilePath,
      },
      fields,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Template created", template: tpl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const listTemplates = async (_req, res) => {
  try {
    const tpls = await CertificateTemplate.find().populate("createdBy", "name role");
    res.json(tpls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await CertificateTemplate.findByIdAndDelete(id);
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * ISSUE CERTIFICATE (Teacher/University/SuperAdmin)
 * - If universityId is provided, status = pending
 * - If independent teacher, status = issued directly
 * ==========================
 */
export const issueCertificate = async (req, res) => {
  try {
    const { studentId, courseId, templateId, score, filledData, universityId } = req.body;

    if (!studentId || !courseId || !templateId || typeof score !== "number") {
      return res.status(400).json({ message: "studentId, courseId, templateId, score required" });
    }

    if (score < 33) {
      return res.status(400).json({ message: "Minimum passing score is 33%" });
    }

    const [student, course, template] = await Promise.all([
      User.findById(studentId),
      Course.findById(courseId),
      CertificateTemplate.findById(templateId),
    ]);

    if (!student || student.role !== "student")
      return res.status(404).json({ message: "Student not found" });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!template) return res.status(404).json({ message: "Template not found" });

    // unique cert id
    const certificateId = `CERT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const issued = await IssuedCertificate.create({
      certificateId,
      student: student._id,
      course: course._id,
      template: template._id,
      university: universityId || null,
      score,
      filledData,
      status: universityId ? "pending" : "issued",
      isValid: true,
    });

    res.status(201).json({ message: "Certificate created", certificate: issued });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * UNIVERSITY APPROVES CERTIFICATE
 * ==========================
 */
export const approveCertificate = async (req, res) => {
  try {
    const { id } = req.params; // cert id
    const cert = await IssuedCertificate.findById(id);

    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    if (!cert.university || cert.university.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to approve this certificate" });
    }

    cert.status = "issued";
    await cert.save();

    res.json({ message: "Certificate approved & issued", certificate: cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * VERIFY CERTIFICATE (Public)
 * ==========================
 */
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await IssuedCertificate.findOne({ certificateId })
      .populate("student", "name email")
      .populate("course", "title")
      .populate("template", "name signatory");
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    res.json({ valid: cert.isValid, status: cert.status, details: cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * STUDENT: list own certificates
 * ==========================
 */
export const myCertificates = async (req, res) => {
  try {
    const list = await IssuedCertificate.find({
      student: req.user.id,
      status: "issued",
    })
      .populate("course", "title")
      .populate("template", "name signatory");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};