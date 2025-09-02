 // controllers/universityController.js
import User from "../models/user.js";
import Course from "../models/course.js";
//import Payment from "../models/payment.js";
import { IssuedCertificate } from "../models/certificate.js";

// Helper: ensure user is university
const ensureUniversity = (user) => user && user.role === "university";

// ✅ University profile
export const getProfile = async (req, res) => {
  try {
    const uni = await User.findById(req.user.id).select("-password");
    if (!ensureUniversity(uni)) return res.status(403).json({ message: "Not a university user" });
    res.json(uni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const uni = await User.findById(req.user.id);
    if (!ensureUniversity(uni)) return res.status(403).json({ message: "Not a university user" });

    Object.assign(uni, updates);
    await uni.save();
    res.json({ message: "Profile updated", uni });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all courses created by this university
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Approve / Reject teacher-created courses
export const reviewTeacherCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const course = await Course.findById(courseId).populate("createdBy", "role");
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only review teacher-created courses
    if (course.createdBy.role !== "teacher") {
      return res.status(400).json({ message: "Only teacher-created courses can be reviewed" });
    }

    if (action === "approve") {
      course.isApprovedByUniversity = true; // Multi-step approval flag
      // Final approval only if superadmin already approved (or handle separately)
      course.isApproved = course.isApprovedBySuperAdmin && true;
    } else if (action === "reject") {
      course.isApprovedByUniversity = false;
      course.isApproved = false;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await course.save();
    res.json({ message: `Course ${action}d by university`, course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Revenue summary
export const myRevenue = async (req, res) => {
  try {
    const myCourses = await Course.find({ createdBy: req.user.id }).select("_id");
    const courseIds = myCourses.map(c => c._id);

    const payments = await Payment.find({ course: { $in: courseIds }, status: "success" });
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({ totalRevenue, payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Track students enrolled in university courses
export const enrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, createdBy: req.user.id })
      .populate("enrolledStudents", "name email");

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ students: course.enrolledStudents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Certificates issued under university courses
export const myCertificates = async (req, res) => {
  try {
    const myCourses = await Course.find({ createdBy: req.user.id }).select("_id");
    const courseIds = myCourses.map(c => c._id);

    const certs = await IssuedCertificate.find({ course: { $in: courseIds } })
      .populate("student", "name email");

    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
