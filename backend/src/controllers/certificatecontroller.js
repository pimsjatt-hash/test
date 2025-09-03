 // src/controllers/certificateController.js
import { CertificateTemplate, IssuedCertificate } from "../models/certificate.js";
import Course from "../models/course.js";
import User from "../models/user.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

/**
 * ==========================
 * TEMPLATE MANAGEMENT (SuperAdmin Only)
 * ==========================
 */
export const createTemplate = async (req, res) => {
  try {
    // Parse fields
    let fields = [];
    if (req.body.fields) {
      if (typeof req.body.fields === "string") {
        try {
          fields = JSON.parse(req.body.fields);
        } catch {
          return res.status(400).json({ message: "Invalid fields format" });
        }
      } else if (Array.isArray(req.body.fields)) {
        fields = req.body.fields;
      }
    } else {
      fields = [
        { name: "studentName", rolesAllowed: ["superadmin", "teacher"] },
        { name: "courseScore", rolesAllowed: ["teacher"] },
      ];
    }

    // Parse signatories (array)
    let signatories = [];
    if (req.body.signatories) {
      let parsed;
      try {
        parsed = typeof req.body.signatories === "string"
          ? JSON.parse(req.body.signatories)
          : req.body.signatories;
      } catch {
        return res.status(400).json({ message: "Invalid signatories format" });
      }

      for (let i = 0; i < parsed.length; i++) {
        const sig = parsed[i];
        let imageUrl = "";
        const fieldKey = `signatoryFile${i}`;
        if (req.files?.[fieldKey]) {
          const file = req.files[fieldKey];
          const dir = path.join("src", "uploads", "signatories");
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const uploadPath = path.join(dir, Date.now() + "-" + file.name);
          await file.mv(uploadPath);
          imageUrl = "/" + uploadPath.replace(/\\/g, "/");
        }
        signatories.push({
          name: sig.name?.trim() || "",
          role: sig.role?.trim() || "",
          imageUrl,
        });
      }
    }

    if (signatories.length === 0) {
      return res.status(400).json({ message: "At least one signatory is required" });
    }

    const tpl = await CertificateTemplate.create({
      signatories,
      fields,
    });

    return res.status(201).json({
      message: "Template created successfully",
      template: tpl,
    });
  } catch (err) {
    console.error("Error in createTemplate:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listTemplates = async (_req, res) => {
  try {
    const tpls = await CertificateTemplate.find();
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
    const { studentId, courseId, templateId, score, filledData } = req.body;

    if (!studentId || !courseId || !templateId || typeof score !== "number") {
      return res.status(400).json({
        message: "studentId, courseId, templateId and score are required",
      });
    }
    if (score < 33)
      return res.status(400).json({ message: "Minimum passing score is 33%" });

    const [student, course, template] = await Promise.all([
      User.findById(studentId),
      Course.findById(courseId),
      CertificateTemplate.findById(templateId),
    ]);

    if (!student || student.role !== "student")
      return res.status(404).json({ message: "Valid student not found" });
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!template) return res.status(404).json({ message: "Template not found" });

    // Filter fields according to logged-in user's role
    const allowedFields = template.fields
      .filter((f) => f.rolesAllowed.includes(req.user.role))
      .map((f) => f.name);

    const filteredData = {};
    allowedFields.forEach((field) => {
      if (filledData?.[field] !== undefined) filteredData[field] = filledData[field];
    });

    // University approval check
    let requiresUniversityApproval = false;
    if (course.affiliatedUniversity && req.user.role !== "university") {
      requiresUniversityApproval = true;
    }

    const certificateId = `CERT-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    const issued = await IssuedCertificate.create({
      certificateId,
      student: student._id,
      course: course._id,
      template: template._id,
      university: requiresUniversityApproval ? course.affiliatedUniversity : null,
      score,
      filledData: filteredData,
      status: requiresUniversityApproval ? "pending" : "issued",
      isValid: true,
    });

    // Auto-generate PDF
    const pdfDir = path.join("src", "uploads", "certificates");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfPath = path.join(pdfDir, `${certificateId}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Title
    doc.fontSize(22).text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);

    // Main details
    doc.fontSize(14).text(`Student: ${filteredData.studentName || student.name}`);
    doc.text(`Course: ${course.title}`);
    doc.text(`Score: ${score}%`);
    doc.text(`Certificate ID: ${certificateId}`);
    doc.moveDown(4);

    // Signatories
    if (template.signatories?.length > 0) {
      const sectionY = doc.y;
      const signWidth = 150;
      const gap = 40;
      const startX = 70;

      template.signatories.forEach((sig, index) => {
        const x = startX + index * (signWidth + gap);
        let y = sectionY;

        if (sig.imageUrl) {
          const imgPath = path.join("src", sig.imageUrl.replace("/", ""));
          if (fs.existsSync(imgPath)) {
            doc.image(imgPath, x, y, { width: 100, height: 50 });
            y += 60;
          }
        }

        doc.fontSize(12).text(sig.name, x, y, { width: signWidth, align: "center" });
        if (sig.role) {
          doc.fontSize(10).text(sig.role, x, y + 15, { width: signWidth, align: "center" });
        }
      });
    }

    doc.end();

    issued.pdfUrl = "/" + pdfPath.replace(/\\/g, "/");
    await issued.save();

    return res.status(201).json({
      message: "Certificate issued successfully",
      certificate: issued,
    });
  } catch (err) {
    console.error("Error in issueCertificate:", err);
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
      .populate("template", "signatories fields");

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
      .populate("template", "signatories fields");

    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * ==========================
 * STUDENT: Download own certificate (Secure)
 * ==========================
 */
export const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (req.user.role !== "student")
      return res.status(403).json({ message: "Only students can download certificates" });

    const cert = await IssuedCertificate.findOne({
      certificateId,
      student: req.user.id,
      status: "issued",
    });

    if (!cert)
      return res.status(404).json({ message: "Certificate not found or not issued yet" });

    const filePath = path.join("src", cert.pdfUrl.replace("/", ""));
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "Certificate file not found" });

    res.download(filePath, `${certificateId}.pdf`);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
