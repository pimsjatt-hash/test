 // routes/governanceRoutes.js
import express from "express";
import {
  uploadMou,
  validateMou,
  listMous,
  validateCertificate,
  invalidateCertificate,
  mouUpload,
} from "../controllers/governancecontroller.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();

// MoUs
router.post("/mou/upload", authMiddleware, allowRoles("governancemanager"), mouUpload.single("mou"), uploadMou);
router.put("/mou/validate/:id", authMiddleware, allowRoles("governancemanager"), validateMou);
router.get("/mou", authMiddleware, allowRoles("governancemanager"), listMous);

// Certificates
router.put("/certificate/validate/:certificateId", authMiddleware, allowRoles("governancemanager"), validateCertificate);
router.put("/certificate/invalidate/:certificateId", authMiddleware, allowRoles("governancemanager"), invalidateCertificate);

export default router;
