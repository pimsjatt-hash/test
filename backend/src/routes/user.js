 import { Router } from "express";
import {
  getAllUsers,
  getStudents,
  getTeachers,
  getUniversity,
  getReferral,
  getPartners,
  getSubAdmins,
  updateUserStatus,
  approveUserStatus,
  updateSubRole,
  addUser,
  deleteUser,
} from "../controllers/usercontroller.js";

import { allowRoles, requireSubAdminRole } from "../middleware/rbac.js";
import { authMiddleware } from "../middleware/auth.js"; // make sure this matches your export in auth.js

const router = Router();

// Base: all users
router.get("/", authMiddleware, allowRoles("superadmin", "sub-admin"), getAllUsers);

// Filtered users
router.get("/students", authMiddleware, getStudents);
router.get("/teachers", authMiddleware, getTeachers);
router.get("/university", authMiddleware, getUniversity);
router.get("/referral", authMiddleware, getReferral);
router.get("/partners", authMiddleware, getPartners);
router.get("/subadmin", authMiddleware, allowRoles("superadmin"), getSubAdmins);

// Update status / approve
router.put("/", authMiddleware, allowRoles("superadmin", "sub-admin"), updateUserStatus);
router.put("/approve", authMiddleware, allowRoles("superadmin", "sub-admin"), approveUserStatus);

// Sub-role management (only sub-admin with role_manager subRole can do this)
router.put("/subrole/:id", authMiddleware, requireSubAdminRole("role_manager"), updateSubRole);

// Admin adds a user
router.post("/add", authMiddleware, allowRoles("superadmin"), addUser);

// Delete a user
router.delete("/:id", authMiddleware, allowRoles("superadmin"), deleteUser);

export default router;
