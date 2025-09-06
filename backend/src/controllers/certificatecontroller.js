 import {
  //  CertificateTemplate, 
  IssuedCertificate } from "../models/certificate.js";
import crypto from "crypto";
import path from "path";
import { createCertificatePDF } from "../utils/pdfGenerator.js";

/**
 * ==========================
 * CREATE A CERTIFICATE TEMPLATE
 * POST /api/certificates/templates
 * ==========================
 */
// export async function createTemplate(req, res) {
//   try {
//     const ownerId = req.user?.id || null;
//     const { name, logoUrl, backgroundUrl, signatories = [], layout = {}, fields = [] } = req.body;

//     const defaultFields = fields.length > 0 ? fields : ["studentName", "courseTitle", "uniqueId"];

//     const template = new CertificateTemplate({
//       name,
//       ownerId,
//       logoUrl,
//       backgroundUrl,
//       signatories,
//       layout,
//       fields: defaultFields,
//     });

//     await template.save();

//     return res.status(201).json({
//       success: true,
//       message: "Template created successfully",
//       template,
//     });
//   } catch (err) {
//     console.error("createTemplate error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while creating template",
//     });
//   }
// }

/**
 * ==========================
 * LIST CERTIFICATE TEMPLATES
 * GET /api/certificates/templates
 * ==========================
 */
export async function listTemplates(req, res) {
  try {
    const ownerId = req.query.ownerId || null;
    const filter = ownerId ? { ownerId } : {};
    const templates = await CertificateTemplate.find(filter).sort({ createdAt: -1 });

    return res.json({ success: true, templates });
  } catch (err) {
    console.error("listTemplates error:", err);
    return res.status(500).json({ success: false });
  }
}

/**
 * ==========================
 * ISSUE A CERTIFICATE
 * POST /api/certificates/issue
 
 * ==========================
 * ISSUE A CERTIFICATE
 * POST /api/certificates/issue
 * ==========================
 */ 
export async function issueCertificate(req, res) {
  try {
    // Log the incoming body for debugging
    console.log(req.body, "help");

    let { studentEmail, studentName, courseuniqueId, courseTitle, score = 0 } = req.body;

    // Validate required fields
    if (!studentEmail || !studentName || !courseuniqueId || !courseTitle ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    score = Number(score) || 0;

    // Generate unique IDs
    const uniqueId = `CERT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const certificateId = crypto.randomUUID(); // internal unique ID

    // Fetch template
    // const template = await CertificateTemplate.findById(templateId);
    // if (!template) {
    //   return res.status(404).json({ success: false, message: "Template not found" });
    // }

    // Create new issued certificate
    const issued = new IssuedCertificate({
      certificateId,  // internal ID required by schema
      uniqueId,       // public ID for validation
      studentEmail,
      studentName,
      courseuniqueId,
      courseTitle,
      
      score,
      issuedAt: new Date(),
      status: req.user?.role === "superadmin" ? "approved" : "pending",
      issuedBy: req.user?.id || null,
    });

    // Generate PDF immediately if superadmin
    if (req.user?.role === "superadmin") {
      const pdfData = {
        studentName,
        courseTitle,
        uniqueId,
        issuedAt: issued.issuedAt,
        logoUrl: template.logoUrl,
        backgroundUrl: template.backgroundUrl,
        signatories: template.signatories || [],
        templateLayout: template.layout || {},
        certificateId: issued._id.toString(),
      };

      const { filePath, qrUrl } = await createCertificatePDF(pdfData);

      issued.pdfUrl = `/certificates/${path.basename(filePath)}`;
      issued.qrUrl = qrUrl;
      issued.validated = true;
    }

    await issued.save();

    return res.status(201).json({
      success: true,
      message:
        issued.status === "approved"
          ? "Certificate issued successfully"
          : "Certificate request submitted for superadmin approval",
      issued,
    });
  } catch (err) {
    console.error("issueCertificate error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while issuing certificate",
    });
  }
}

/**
 * ==========================
 * GET CERTIFICATES FOR LOGGED-IN STUDENT
 * GET /api/certificates/my
 * ==========================
 */
export async function downloadCertificate(req, res) {
    try {
    const cert = await IssuedCertificate.findById(req.params.id);

    if (!cert) return res.status(404).send("Certificate not found");
    console.log(cert, "cert");
    

    // Only allow the student who owns it or admin
    if (cert.studentEmail.toString() !== req.user.email && req.user.role !== "superadmin") {
      return res.status(403).send("Access denied");
    }

    const filePath = path.join(process.cwd(), "public", "certificates", `${cert._id}.pdf`);
    res.download(filePath); // forces download
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
// export async function getCertificatesByStudent(req, res) {
//   try {
//     const studentEmail = req.user?.id;
//     if (!studentEmail)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     const certs = await IssuedCertificate.find({ studentEmail, status: "approved" }).sort({ issuedAt: -1 });

//     return res.json({ success: true, certificates: certs });
//   } catch (err) {
//     console.error("getCertificatesByStudent error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// }
export async function getCertificatesByStudent(req, res) {
  try {
    const studentEmail = req.user?.email;
    if (!studentEmail)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const certs = await IssuedCertificate.find({ studentEmail, status: "approved" })
      .sort({ issuedAt: -1 });

    return res.json({ success: true, certificates: certs });
  } catch (err) {
    console.error("getCertificatesByStudent error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * ==========================
 * VALIDATE CERTIFICATE BY UNIQUE ID
 * GET /api/certificates/validate/:uniqueId
 * ==========================
 */
export async function validateCertificate(req, res) {
  try {
    const { uniqueId } = req.params;

    // ✅ Only approved certificates are valid
    const cert = await IssuedCertificate.findOne({ uniqueId, status: "approved" });

    if (!cert)
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Certificate not found or not yet approved",
      });

    return res.json({
      success: true,
      valid: true,
      certificate: {
        uniqueId: cert.uniqueId,
        studentName: cert.studentName,
        courseTitle: cert.courseTitle,
        issuedAt: cert.issuedAt,
        pdfUrl: cert.pdfUrl,
        score: cert.score,
        validated: cert.validated,
      },
    });
  } catch (err) {
    console.error("validateCertificate error:", err);
    return res.status(500).json({ success: false });
  }
}

 //approve certificate
 /**
 * ==========================
 * APPROVE CERTIFICATE
 * PATCH /api/certificates/approve/:id
 * ==========================
 */
export async function approveCertificate(req, res) {
  try {
    const { id } = req.params;

    // Find certificate by _id (MongoDB) or uniqueId (legacy support)
    const cert =
      (await IssuedCertificate.findById(id)) ||
      (await IssuedCertificate.findOne({ uniqueId: id }));

    if (!cert)
      return res.status(404).json({ success: false, message: "Certificate not found" });

    if (cert.status === "approved")
      return res.status(400).json({ success: false, message: "Certificate already approved" });

    // const template = await CertificateTemplate.findById(cert.templateId);
    // if (!template)
    //   return res.status(404).json({ success: false, message: "Template not found" });

    // Prepare PDF data
    const pdfData = {
      studentName: cert.studentName,
      courseTitle: cert.courseTitle,
      issuedAt: cert.issuedAt,
      // logoUrl: template?.logoUrl,
      // backgroundUrl: template?.backgroundUrl,
      // signatories: template?.signatories || [],
      // templateLayout: template?.layout || {},
      certificateId: cert._id.toString(), // Use MongoDB _id for PDF filename & QR
    };

    const { filePath, qrUrl } = await createCertificatePDF(pdfData);

    // Update certificate
    cert.status = "approved";
    cert.pdfUrl = `/certificates/${path.basename(filePath)}`;
    cert.qrUrl = qrUrl;
    cert.validated = true;

    await cert.save();

    return res.json({ success: true, message: "Certificate approved", certificate: cert });
  } catch (err) {
    console.error("approveCertificate error:", err);
    return res.status(500).json({ success: false, message: "Server error while approving certificate" });
  }
}


/**
 * ==========================
 * UPDATE TEMPLATE
 * PUT /api/certificates/templates/:id
 * ==========================
 */
// export async function updateTemplate(req, res) {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedAt = new Date();

//     const template = await CertificateTemplate.findByIdAndUpdate(id, updates, { new: true });
//     if (!template)
//       return res.status(404).json({ success: false, message: "Template not found" });

//     return res.json({ success: true, template });
//   } catch (err) {
//     console.error("updateTemplate error:", err);
//     return res.status(500).json({ success: false });
//   }
// }

/**
 * ==========================
 * DELETE TEMPLATE
 * DELETE /api/certificates/templates/:id
 * ==========================
 */
// export async function deleteTemplate(req, res) {
//   try {
//     const { id } = req.params;
//     const template = await CertificateTemplate.findByIdAndDelete(id);
//     if (!template)
//       return res.status(404).json({ success: false, message: "Template not found" });

//     return res.json({ success: true, message: "Template deleted" });
//   } catch (err) {
//     console.error("deleteTemplate error:", err);
//     return res.status(500).json({ success: false });
//   }
// }

/**
 * ==========================
 * UPLOAD SIGNATURE
 * POST /api/certificates/signatures/:templateId
 * ==========================
 */
export async function uploadSignature(req, res) {
  try {
    // const { templateId } = req.params;
    // const template = await CertificateTemplate.findById(templateId);
    // if (!template)
    //   return res.status(404).json({ message: "Template not found" });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    if (template.signatories.length >= 5)
      return res.status(400).json({ message: "Maximum 5 signatures allowed" });

    const { name, title } = req.body;

    template.signatories.push({
      name: name || "Signatory",
      title: title || "",
      signatureUrl: `/signatures/${req.file.filename}`,
    });

    await template.save();
    return res.json({ success: true, signatories: template.signatories });
  } catch (err) {
    console.error("uploadSignature error:", err);
    return res.status(500).json({ success: false });
  }
}
