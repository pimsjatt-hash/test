



// src/routes/teacherRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";
import {
  getProfile,
  updateProfile,
  getMyCourses,
  myEarnings,
  getCourseReviews
} from "../controllers/teachercontroller.js";

import {
  createCourse,
  
  getCourses,
  getApproveCourses,
  addModule,
  addVideo,
  addNotes,
  addMcqs,
  
  deleteCourse,
} from "../controllers/coursecontroller.js";

import { uploadVideo, uploadNotes,uploadAny } from "../utils/uploadCourse.js";

import{
  issueCertificate
}from "../controllers/certificatecontroller.js";


// Configure Multer
 

const router = express.Router();

// --- Teacher Profile ---
router.get("/profile", authMiddleware, allowRoles("teacher"), getProfile);
router.put("/profile", authMiddleware, allowRoles("teacher"), updateProfile);

// --- My Courses ---
router.get("/my-courses", authMiddleware, allowRoles("teacher"),  getMyCourses);


// --- Earnings ---
router.get("/earnings", authMiddleware, allowRoles("teacher"), myEarnings);

router.get("/reviews", authMiddleware, allowRoles("teacher"), getCourseReviews);
//CREATE COURSE
// router.post(
//   "/",
//   authMiddleware,
//   allowRoles("teacher", "university", "superadmin"),
//   createCourse
// );
router.post(
  "/",
  authMiddleware,
  allowRoles("teacher", "university"),
  uploadAny("courses", []).single("file"), // ensure multer middleware is correct
  createCourse
);

// GET COURSES
router.get("/getCourses", getCourses);
router.get("/getApproveCourses", getApproveCourses);


// MODULES
router.post(
  "/:courseId/module",
  authMiddleware,
  allowRoles("teacher", "university"),
  addModule
);

// VIDEOS
router.post(
  "/:courseId/module/:moduleId/video",
  authMiddleware,
  allowRoles("teacher", "university"),
  uploadVideo.single("video"),
  addVideo
);

// NOTES
router.post(
  "/:courseId/module/:moduleId/notes",
  authMiddleware,
  allowRoles("teacher", "university"),
  uploadNotes.single("notes"),
  addNotes
);

// MCQS
router.post(
  "/:courseId/module/:moduleId/mcqs",
  authMiddleware,
  allowRoles("teacher", "university"),
    // uploadmcqs.single("mcqs"),
  addMcqs
);
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("teacher", "university", "superadmin"),
  deleteCourse
);


router.post(
  "/issue",
  authMiddleware,
  allowRoles("teacher", "university"), // 👈 superadmin cannot issue
  issueCertificate
);


export default router;
