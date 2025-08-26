 // src/routes/courseRoutes.js
import express from "express";
import multer from "multer";
import {
  createCourse,
  approveCourse,
  getCourses,
  addModule,
  addVideo,
  addNotes,
  addMcqs,
  submitExam,
  deleteCourse,
  getApproveCourses,
} from "../controllers/courseController.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// --- CREATE COURSE ---
// Teachers and Universities can create courses
router.post("/", authMiddleware, allowRoles("teacher", "university", "superadmin"), createCourse);

// --- GET APPROVED COURSES ---
router.get("/getCourses", getCourses);
router.get("/getApproveCourses", getApproveCourses);

// --- APPROVE COURSE ---
// Superadmin can approve any course
// University can approve only their affiliated teacher courses
router.put("/approve/:courseId", authMiddleware, allowRoles("university", "superadmin"), approveCourse);

// --- MODULES ---
// Teacher/university can add modules
router.post("/:courseId/module", authMiddleware, allowRoles("teacher", "university"), addModule);

// --- VIDEOS ---
router.post(
  "/:courseId/module/:moduleId/video",
  authMiddleware,
  allowRoles("teacher", "university"),
  upload.single("video"),
  addVideo
);

// --- NOTES ---
router.post(
  "/:courseId/module/:moduleId/notes",
  authMiddleware,
  allowRoles("teacher", "university"),
  upload.single("notes"),
  addNotes
);

// --- MCQs ---
router.post("/:courseId/module/:moduleId/mcqs", authMiddleware, allowRoles("teacher", "university"), addMcqs);

// --- EXAM SUBMIT ---
// Only students can submit exams
router.post("/:courseId/exam", authMiddleware, allowRoles("student"), submitExam);

// --- DELETE COURSE ---
router.delete("/:courseId", authMiddleware, allowRoles("teacher", "university" , "superadmin"), deleteCourse);

export default router;
