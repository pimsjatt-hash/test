 import express from "express";
import {
  //createCourse,
  approveCourse,
  getCourses,
  getApproveCourses,
  //addModule,
  //addVideo,
  //addNotes,
  //addMcqs,
  submitExam,
  deleteCourse,
} from "../controllers/coursecontroller.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";
//import { uploadVideo, uploadNotes } from "../utils/uploadCourse.js";

const router = express.Router();

// CREATE COURSE
// router.post(
//   "/",
//   authMiddleware,
//   allowRoles("teacher", "university", "superadmin"),
//   createCourse
// );

// GET COURSES
router.get("/getCourses", getCourses);
router.get("/getApproveCourses", getApproveCourses);

// APPROVE COURSE
router.patch(
  "/superadmin/approve/course/:id",
  authMiddleware,
  allowRoles("superadmin", "university"),
  approveCourse
);

// // MODULES
// router.post(
//   "/:courseId/module",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   addModule
// );

// // VIDEOS
// router.post(
//   "/:courseId/module/:moduleId/video",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   uploadVideo.single("video"),
//   addVideo
// );

// // NOTES
// router.post(
//   "/:courseId/module/:moduleId/notes",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//   uploadNotes.single("notes"),
//   addNotes
// );

// // MCQS
// router.post(
//   "/:courseId/module/:moduleId/mcqs",
//   authMiddleware,
//   allowRoles("teacher", "university"),
//     // uploadmcqs.single("mcqs"),
//   addMcqs
// );

// EXAM
router.post(
  "/:courseId/exam",
  authMiddleware,
  allowRoles("student"),
  submitExam
);

// DELETE COURSE
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("teacher", "university", "superadmin"),
  deleteCourse
);

export default router;
