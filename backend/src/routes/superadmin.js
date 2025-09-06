 // src/routes/superAdmin.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles, requireApproved } from "../middleware/rbac.js";
import {
  createManager,
  getUsersByRole,
  approveUser,
  approveCourse,
  approveUniversity,
  deleteUser, updateSubRole
  , getReports
} from "../controllers/superAdminController.js";
const router = express.Router();

// 1️⃣ Create fixed sub-admin (blog_manager, finance_manager, governance, role_manager)
router.post(
  "/create-manager",
  authMiddleware,
  allowRoles("superadmin"),
  requireApproved(),
  createManager
);

// GET /api/superadmin/reports
router.get(
  "/reports",
  authMiddleware,           // optional: only if you want auth
  allowRoles("superadmin"), // optional: only superadmin can access
  getReports
);

// 2️⃣ Fetch users by role
router.get(
  "/users/:role",
  authMiddleware,
  allowRoles("superadmin"),
  requireApproved(),
  getUsersByRole
);

// 3️⃣ Approvals
router.patch(
  "/approve/user/:id",
  authMiddleware,
  allowRoles("superadmin"),
  requireApproved(),
  approveUser
);

router.patch(
  "/approve/course/:id",
  authMiddleware,
  allowRoles("superadmin"),
  requireApproved(),
  approveCourse
);

router.patch(
  "/approve/university/:id",
  authMiddleware,
  allowRoles("superadmin"),
  requireApproved(),
  approveUniversity
);



// inside router.get("/reports")
// router.get("/reports", (req, res, next) => {
//   console.log("📊 Reports route triggered");
//   next();
// }, authMiddleware, allowRoles("superadmin"), getReports);
 



router.delete("/delete-user/:id", deleteUser);       // DELETE /api/users/:id
router.put("/:id/role", updateSubRole); // PATCH /api/users/:id/role


export default router;
