 // src/routes/certificate.js
import express from "express";
import {
  createTemplate,
  listTemplates,
  deleteTemplate,
  issueCertificate,
  verifyCertificate,
  myCertificates,
  approveCertificate,
} from "../controllers/certificateController.js"; // fixed capitalization
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();

/**
 * Templates (Super Admin only)
 */
router.post(
  "/templates",
  authMiddleware,
  allowRoles("superadmin"),
  createTemplate
);
router.get(
  "/templates",
  authMiddleware,
  allowRoles("superadmin"),
  listTemplates
);
router.delete(
  "/templates/:id",
  authMiddleware,
  allowRoles("superadmin"),
  deleteTemplate
);

/**
 * Issue Certificate (SuperAdmin, Teacher, University)
 */
router.post(
  "/issue",
  authMiddleware,
  allowRoles("superadmin", "teacher", "university"),
  issueCertificate
);

/**
 * University Approve Certificate
 */
router.patch(
  "/approve/:id",
  authMiddleware,
  allowRoles("university"),
  approveCertificate
);

/**
 * Student: List own certificates
 */
router.get(
  "/mine",
  authMiddleware,
  allowRoles("student"),
  myCertificates
);

/**
 * Public: Verify Certificate
 */
router.get("/verify/:certificateId", verifyCertificate);

export default router;
