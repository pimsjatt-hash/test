 // src/routes/teacherRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";
import {
  getProfile,
  updateProfile,
  myCourses,
  myEarnings,
} from "../controllers/teachercontroller.js";

const router = express.Router();

// --- Teacher Profile ---
router.get("/profile", authMiddleware, allowRoles("teacher"), getProfile);
router.put("/profile", authMiddleware, allowRoles("teacher"), updateProfile);

// --- My Courses ---
router.get("/my-courses", authMiddleware, allowRoles("teacher"), myCourses);


// --- Earnings ---
router.get("/earnings", authMiddleware, allowRoles("teacher"), myEarnings);

export default router;
