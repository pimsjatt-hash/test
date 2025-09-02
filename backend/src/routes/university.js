 // src/routes/universityRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";
import {
  getProfile,
  updateProfile,
  getMyCourses,
  reviewTeacherCourse,
  myRevenue,
  enrolledStudents,
  myCertificates,
} from "../controllers/universitycontroller.js";

const router = express.Router();

// --- University Profile ---
router.get("/profile", authMiddleware, allowRoles("university"), getProfile);
router.put("/profile", authMiddleware, allowRoles("university"), updateProfile);

// --- University Courses ---
router.get("/my-courses", authMiddleware, allowRoles("university"), getMyCourses);

// --- Review Teacher Courses ---
router.put("/review-course/:courseId", authMiddleware, allowRoles("university"), reviewTeacherCourse);

// --- Revenue ---
router.get("/revenue", authMiddleware, allowRoles("university"), myRevenue);

// --- Enrolled Students ---
router.get("/students/:courseId", authMiddleware, allowRoles("university"), enrolledStudents);

// --- Certificates ---
router.get("/certificates", authMiddleware, allowRoles("university"), myCertificates);

export default router;
