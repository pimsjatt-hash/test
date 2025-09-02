// controllers/teacherController.js
import User from "../models/user.js";
import Course from "../models/course.js";
//import Payment from "../models/payment.js";

// ✅ Get my teacher profile
export const getProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select("-password");
    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ message: "Not a teacher" });
    }
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update teacher profile (ID, bank, UPI, photo, etc.)
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const teacher = await User.findById(req.user.id);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ message: "Not a teacher" });
    }

    Object.assign(teacher, updates);
    await teacher.save();
    res.json({ message: "Profile updated", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get my uploaded courses
export const myCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get earnings summary
export const myEarnings = async (req, res) => {
  try {
    // total successful payments where course createdBy = me
    const myCourses = await Course.find({ createdBy: req.user.id }).select("_id");
    const ids = myCourses.map(c => c._id);

    const payments = await Payment.find({ course: { $in: ids }, status: "success" });

    const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({ totalEarnings, payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
