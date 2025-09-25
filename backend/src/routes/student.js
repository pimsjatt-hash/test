 // routes/studentRoutes.js
import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getCourses,
  enrollCourse,
  myCourses,
  reviewCourse,
} from "../controllers/studentcontroller.js";
import {  allowRoles } from "../middleware/rbac.js"; // ✅ fix

import { authMiddleware } from "../middleware/auth.js";
import { getCertificatesByStudent } from "../controllers/certificatecontroller.js";

const router = express.Router();

// Profile
router.get("/profile", authMiddleware, allowRoles("student"), getStudentProfile);
router.put("/profile", authMiddleware, allowRoles("student"), updateStudentProfile);

router.get(
  "/student/:studentId",
  authMiddleware,
  allowRoles("student", "superadmin", "university"),
  getCertificatesByStudent
);

// Courses
router.get("/courses", authMiddleware, getCourses);
router.post("/enroll", authMiddleware, enrollCourse);
router.get("/my-courses", authMiddleware, myCourses);

// Reviews
router.post("/review", authMiddleware, reviewCourse);
// console.log("✅ studentRoutes loaded");


export default router;
