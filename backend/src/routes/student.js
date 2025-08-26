// routes/studentRoutes.js
import express from "express";
import {
  getCourses,
  enrollCourse,
  myCourses,
  reviewCourse,
} from "../controllers/studentcontroller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All student routes are protected
router.get("/courses", authMiddleware, getCourses);
router.post("/enroll", authMiddleware, enrollCourse);
router.get("/my-courses", authMiddleware, myCourses);
router.post("/review", authMiddleware, reviewCourse);

export default router;
