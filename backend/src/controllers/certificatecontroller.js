 // src/controllers/certificateController.js
import { CertificateTemplate, IssuedCertificate } from "../models/certificate.js";
import Course from "../models/course.js";
import User from "../models/user.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";







/**
 * ==========================
 * TEMPLATE MANAGEMENT (SuperAdmin Only)
 * ==========================
 */
export const createTemplate = async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const signatoryName = req.body?.signatoryName?.trim();

    if (!name || !signatoryName) {
      return res.status(400).json({ message: "Template name and signatory name are required" });
    }

    const designUrl = req.body?.designUrl?.trim() || "";

    // Handle fields
    let fields = ["studentName", "courseId", "score"];
    if (req.body.fields) {
      if (Array.isArray(req.body.fields)) {
        fields = req.body.fields;
      } else if (typeof req.body.fields === "string") {
        try {
          fields = JSON.parse(req.body.fields);
          if (!Array.isArray(fields)) {
            fields = req.body.fields.split(",").map(f => f.trim());
          }
        } catch {
          fields = req.body.fields.split(",").map(f => f.trim());
        }
      }
    }

    // Handle file upload (signatory image)
    let signatoryFilePath = "";
    if (req.files?.signatoryFile) {
      const file = req.files.signatoryFile;

      const dir = path.join("src", "uploads", "signatories");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const uploadPath = path.join(dir, Date.now() + "-" + file.name);
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

    return res.status(201).json({ message: "Template created successfully", template: tpl });
  } catch (err) {
    console.error("Error in createTemplate:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listTemplates = async (_req, res) => {
  try {
    const tpls = await CertificateTemplate.find().populate("createdBy", "name role");
    return res.json(tpls);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const tpl = await CertificateTemplate.findByIdAndDelete(id);
    if (!tpl) return res.status(404).json({ message: "Template not found" });

    return res.json({ message: "Template deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * ISSUE CERTIFICATE (Teacher/University/SuperAdmin)
 * ==========================
 */
export const issueCertificate = async (req, res) => {
  try {
    const { studentId, courseId, templateId, score, filledData, universityId } = req.body;

    if (!studentId || !courseId || !templateId || typeof score !== "number") {
      return res.status(400).json({ message: "studentId, courseId, templateId and score are required" });
    }

    if (score < 33) {
      return res.status(400).json({ message: "Minimum passing score is 33%" });
    }

    const [student, course, template] = await Promise.all([
      User.findById(studentId),
      Course.findById(courseId),
      CertificateTemplate.findById(templateId),
    ]);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Valid student not found" });
    }
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!template) return res.status(404).json({ message: "Template not found" });

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

    return res.status(201).json({ message: "Certificate issued successfully", certificate: issued });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * UNIVERSITY APPROVES CERTIFICATE
 * ==========================
 */
export const approveCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await IssuedCertificate.findById(id);

    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    if (!cert.university || cert.university.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to approve this certificate" });
    }

    cert.status = "issued";
    await cert.save();

    return res.json({ message: "Certificate approved & issued", certificate: cert });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

    return res.json({ valid: cert.isValid, status: cert.status, details: cert });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * STUDENT: List own certificates
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

    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


 