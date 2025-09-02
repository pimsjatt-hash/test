// src/routes/reports.js
import express from "express";
import { getReports } from "../controllers/superAdmincontroller.js"; // import real controller
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();

// GET /api/superadmin/reports
router.get(
  "/reports",
  authMiddleware,           // optional: only if you want auth
  allowRoles("superadmin"), // optional: only superadmin can access
  getReports
);

export default router;
