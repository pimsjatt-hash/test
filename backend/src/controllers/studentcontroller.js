 import Course from "../models/course.js";
import User from "../models/user.js";
import Payment from "../models/payment.js"; // uncomment to use
import {CertificateTemplate } from "../models/certificate.js";

// ✅ Get student profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password");
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Not a student" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student profile" });
  }
};

// ✅ Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const updatedStudent = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", student: updatedStudent });
  } catch (err) {
    res.status(500).json({ error: "Failed to update student profile" });
  }
};

// ✅ Get all available courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: true });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// ✅ Enroll in a course (purchase)
 export const enrollCourse = async (req, res) => {
  console.log("EnrollCourse called");
  
  try {
    const { courseId } = req.body;
    const studentId = req.user?.id;

    console.log("Enroll request:", { courseId, studentId });

    // check course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Option 1: Add student to course.enrolledStudents array (if schema has it)
    if (!course.enrolledStudents) course.enrolledStudents = [];
    if (!course.enrolledStudents.includes(studentId)) {
      course.enrolledStudents.push(studentId);
      await course.save();
    }

    console.log("🎯 Enroll course hit", req.body);


    res.json({ message: "Student enrolled successfully", courseId });
  } catch (err) {
    console.error("❌ EnrollCourse Error:", err);
    res
      .status(500)
      .json({ error: "Failed to enroll in course", details: err.message });
  }
};


// ✅ Get my enrolled courses
  export const myCourses = async (req, res) => {
  try {
    const studentId = req.user._id; // or req.user.id
    const courses = await Course.find({ enrolledStudents: studentId })
      .populate("createdBy", "name email")
      .populate("enrolledStudents", "name email");

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};


// review course

 export const reviewCourse = async (req, res) => {
  try {
    const { courseId, review, rating } = req.body;
    const studentId = req.user.id;

    if (!review || review.trim() === "") {
      return res.status(400).json({ error: "Review text is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Ensure student is enrolled
    if (!course.enrolledStudents.includes(studentId)) {
      return res.status(403).json({ error: "You must be enrolled to review" });
    }

    course.reviews.push({ student: studentId, review: review.trim(), rating });
    await course.save();

    res.json({ message: "Review submitted", reviews: course.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit review", details: err.message });
  }
};
