 // src/routes/courseRoutes.js
import express from "express";
import multer from "multer";
import upload from "../middleware/upload.js";
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
} from "../controllers/coursecontroller.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();
const uploadMulter = multer({ dest: "uploads/" });

// --- CREATE COURSE ---
// Teachers and Universities can create courses
router.post("/", authMiddleware, allowRoles("teacher", "university", "superadmin"), createCourse);

// --- GET APPROVED COURSES ---
router.get("/getCourses", getCourses);
router.get("/getApproveCourses", getApproveCourses);

// --- APPROVE COURSE ---
// Superadmin can approve any course
// University can approve only their affiliated teacher courses
// router.put("/approve/:courseId", authMiddleware, allowRoles("university", "superadmin"), approveCourse);
// router.put("/:id/approve", authMiddleware, allowRoles("university","superadmin"), approveCourse);
router.patch(
  "/superadmin/approve/course/:id",
  authMiddleware,
  allowRoles("superadmin","university"),
  approveCourse
);

// --- MODULES ---
// Teacher/university can add modules
router.post("/:courseId/module", authMiddleware, allowRoles("teacher", "university"), addModule);

// --- VIDEOS ---
router.post("/:courseId/module/:moduleId/video",
  authMiddleware,
  allowRoles("teacher", "university"),
  uploadMulter.single("video"),
  addVideo
);

// --- NOTES ---
router.post("/:courseId/module/:moduleId/notes",
  authMiddleware,
  allowRoles("teacher", "university"),
  uploadMulter.single("notes"),
  addNotes
);

// --- MCQs ---
router.post("/:courseId/module/:moduleId/mcqs", authMiddleware, allowRoles("teacher", "university"), addMcqs);

// --- EXAM SUBMIT ---
// Only students can submit exams
router.post("/:courseId/exam", authMiddleware, allowRoles("student"), submitExam);

// --- DELETE COURSE ---
// router.delete("/:courseId", authMiddleware, allowRoles("teacher", "university" , "superadmin"), deleteCourse);
router.delete("/:id", authMiddleware, allowRoles("teacher","university","superadmin"), deleteCourse);


export default router;


// src/routes/courseRoutes.js
// import express from "express";
// import { authMiddleware } from "../middleware/auth.js";
// import { allowRoles } from "../middleware/rbac.js";
// import upload from "../middleware/upload.js";

// import {
//   createCourse,
//   approveCourse,
//   getCourses,
//   getApproveCourses,
//   deleteCourse,
//   addModule,
//   addVideo,
//   addNotes,
//   addMcqs,
//   submitExam,
// } from "../controllers/courseController.js";

// const router = express.Router();

// // --- Create Course ---
// router.post(
//   "/",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   createCourse
// );

// // --- Approve Course ---
// router.put(
//   "/:courseId/approve",
//   authMiddleware,
//   allowRoles("university", "superadmin"),
//   approveCourse
// );

// // --- Get Pending Courses (for approval) ---
// router.get(
//   "/pending",
//   authMiddleware,
//   allowRoles("superadmin", "university"),
//   getCourses
// );

// // --- Get Approved Courses (students) ---
// router.get("/approved", getApproveCourses);

// // --- Delete Course ---
// router.delete(
//   "/:courseId",
//   authMiddleware,
//   allowRoles("teacher", "university", "superadmin"),
//   deleteCourse
// );

// // --- Add Module ---
// router.post(
//   "/:courseId/module",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   addModule
// );

// // --- Add Video (file upload required) ---
// router.post(
//   "/:courseId/module/:moduleId/video",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   upload.single("video"),
//   addVideo
// );

// // --- Add Notes (file upload required) ---
// router.post(
//   "/:courseId/module/:moduleId/notes",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   upload.single("notes"),
//   addNotes
// );

// // --- Add MCQs ---
// router.post(
//   "/:courseId/module/:moduleId/mcqs",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   addMcqs
// );

// // --- Submit Exam ---
// router.post(
//   "/:courseId/exam",
//   authMiddleware,
//   allowRoles("student"),
//   submitExam
// );

// export default router;
