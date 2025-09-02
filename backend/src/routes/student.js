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

const router = express.Router();

// Profile
router.get("/profile", authMiddleware, allowRoles("student"), getStudentProfile);
router.put("/profile", authMiddleware, allowRoles("student"), updateStudentProfile);

// Courses
router.get("/courses", authMiddleware, getCourses);
router.post("/enroll", authMiddleware, enrollCourse);
router.get("/my-courses", authMiddleware, myCourses);

// Reviews
router.post("/review", authMiddleware, reviewCourse);
console.log("✅ studentRoutes loaded");


export default router;
