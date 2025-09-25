//  import express from "express";
// const router = express.Router();
// import {
//   // createTemplate,
//   // listTemplates,
//   // updateTemplate,
//   // deleteTemplate,
//   issueCertificate,
//   getCertificatesByStudent,
//   validateCertificate,
//   approveCertificate,
//   uploadSignature,
//   downloadCertificate,
//   getTemplateById
// } from "../../src/controllers/certificateController.js";

// import { allowRoles } from "../middleware/rbac.js";
// import { uploadSign } from "../utils/upload.js";
// import { authMiddleware } from "../middleware/auth.js";
// import { IssuedCertificate } from "../models/certificate.js";

// /**
//  * ==========================
//  * TEMPLATE ROUTES
//  * ==========================
//  */
// // router.post(
// //   "/templates",
// //   authMiddleware,
// //   allowRoles("superadmin", "university"),
// //   createTemplate
// // );

// // router.get("/templates", authMiddleware, allowRoles("superadmin","teacher" ,"university"), listTemplates);
// // router.put("/templates/:id", authMiddleware, allowRoles("superadmin"), updateTemplate);
// // router.delete("/templates/:id", authMiddleware, allowRoles("superadmin"), deleteTemplate);

// /**
//  * ==========================
//  * UPLOAD SIGNATURES
//  * ==========================
//  */
// router.post(
//   "/signatures",
//   authMiddleware,
//   allowRoles("superadmin", "university"),
//   uploadSign.single("signature"),
//   uploadSignature
// );

// /**
//  * ==========================
//  * ISSUE CERTIFICATES
//  * ==========================
//  * - Superadmin → auto issues
//  * - Teacher / University → goes for approval
//  */
// router.post(
//   "/issue",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   issueCertificate
// );

// /**
//  * ==========================
//  * APPROVE CERTIFICATES
//  * ==========================
//  * - Only superadmin can approve
//  */
// router.patch(
//   "/approve/:id",
//   authMiddleware,
//   allowRoles("superadmin"),
//   approveCertificate
// );

// /**
//  * ==========================
//  * STUDENT VIEW CERTIFICATES
//  * ==========================
//  */
// router.get("/my", authMiddleware,allowRoles("student"),getCertificatesByStudent);


// router.get("/my/download/:id", authMiddleware,allowRoles("student"), downloadCertificate);

// router.get("/templates/:id", authMiddleware,allowRoles("teacher", "university","superadmin"),  getTemplateById);
 


// /**
//  * ==========================
//  * VALIDATE CERTIFICATES (Public)
//  * ==========================
//  */
// router.get("/validate/:uniqueId", validateCertificate);

// export default router;


// routes/certificateRoutes.js
import express from "express";
import {
 // listTemplates,
  //getTemplateById,
  updateTemplate,      // 👈 superadmin only, for signatories updates
  issueCertificate,
  approveCertificate,
  rejectCertificate,   // 👈 new for rejection
 // getCertificate,
  getCertificatesByStudent,
  validateCertificate,
  downloadCertificate,
  getPendingCertificates,
  getDefaultTemplate,
} from "../controllers/certificatecontroller.js";

import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();

/**
 * ==========================
 * Certificate Templates
 * ==========================
 */
// router.get("/templates", authMiddleware, listTemplates);
// router.get("/templates/:id", authMiddleware, getTemplateById);
router.put(
  "/templates/:id",
  authMiddleware,
  allowRoles("superadmin"), // 👈 only superadmin can update template
  updateTemplate
);

/**
 * ==========================
 * Certificate Issue & Approvals
 * ==========================
 */
router.post(
  "/issue",
  authMiddleware,
  allowRoles("teacher", "university"), // 👈 superadmin cannot issue
  issueCertificate
);

router.patch( 
  "/approve/:id",
  authMiddleware,
  allowRoles("university", "superadmin"), // 👈 only approvers
  approveCertificate
);

router.patch(
  "/reject/:id",
  authMiddleware,
  allowRoles("university", "superadmin"),
  rejectCertificate
);

/**
 * ==========================
 * Student & Public Access
 * ==========================
 */
router.get("/my", authMiddleware,allowRoles("student"),getCertificatesByStudent); // student’s certificates
router.get("/validate/:uniqueId", validateCertificate);      // anyone can validate
router.get("/download/:id", authMiddleware,allowRoles("student") , downloadCertificate);
// router.get("/:id", authMiddleware, getCertificate);
router.get("/pending", authMiddleware, getPendingCertificates);
router.get("/default", authMiddleware, getDefaultTemplate);
export default router;
