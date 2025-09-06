 import express from "express";
const router = express.Router();
import {
  // createTemplate,
  // listTemplates,
  // updateTemplate,
  // deleteTemplate,
  issueCertificate,
  getCertificatesByStudent,
  validateCertificate,
  approveCertificate,
  uploadSignature,
  downloadCertificate,
} from "../../src/controllers/certificateController.js";

import { allowRoles } from "../middleware/rbac.js";
import { uploadSign } from "../utils/upload.js";
import { authMiddleware } from "../middleware/auth.js";
import { IssuedCertificate } from "../models/certificate.js";

/**
 * ==========================
 * TEMPLATE ROUTES
 * ==========================
 */
// router.post(
//   "/templates",
//   authMiddleware,
//   allowRoles("superadmin", "university"),
//   createTemplate
// );

// router.get("/templates", authMiddleware, allowRoles("superadmin","teacher" ,"university"), listTemplates);
// router.put("/templates/:id", authMiddleware, allowRoles("superadmin"), updateTemplate);
// router.delete("/templates/:id", authMiddleware, allowRoles("superadmin"), deleteTemplate);

/**
 * ==========================
 * UPLOAD SIGNATURES
 * ==========================
 */
router.post(
  "/signatures",
  authMiddleware,
  allowRoles("superadmin", "university"),
  uploadSign.single("signature"),
  uploadSignature
);

/**
 * ==========================
 * ISSUE CERTIFICATES
 * ==========================
 * - Superadmin → auto issues
 * - Teacher / University → goes for approval
 */
router.post(
  "/issue",
  authMiddleware,
  allowRoles("teacher", "university"),
  issueCertificate
);

/**
 * ==========================
 * APPROVE CERTIFICATES
 * ==========================
 * - Only superadmin can approve
 */
router.patch(
  "/approve/:id",
  authMiddleware,
  allowRoles("superadmin"),
  approveCertificate
);

/**
 * ==========================
 * STUDENT VIEW CERTIFICATES
 * ==========================
 */
router.get("/my", authMiddleware, getCertificatesByStudent);


router.get("/my/download/:id", authMiddleware, downloadCertificate);



/**
 * ==========================
 * VALIDATE CERTIFICATES (Public)
 * ==========================
 */
router.get("/validate/:uniqueId", validateCertificate);

export default router;
