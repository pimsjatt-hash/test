// controllers/teacherController.js
import User from "../models/user.js";
import Course from "../models/course.js";
import wallet from "../models/wallet.js";
import mongoose from "mongoose";
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
 // Get courses created by the logged-in teacher
export const getMyCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Find courses created by this teacher
    const courses = await Course.find({ createdBy: teacherId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching teacher's courses:", error);
    res.status(500).json({ message: error.message });
  }
};
 

//  export const getCourseReviews = async (req, res) => {
//   try {
//     const teacherId = req.user.id;

//     // Find courses created by this teacher
//     const courses = await Course.find({ createdBy: teacherId }).populate({
//       path: "reviews.student",
//       select: "name email",
//     });

//     const allReviews = courses.map((course) => ({
//       courseId: course._id,
//       courseTitle: course.title,
//       reviews: course.reviews,
//     }));

//     res.json({ success: true, reviews: allReviews });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch reviews", details: err.message });
//   }
// };


export const getCourseReviews = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const courses = await Course.find({ createdBy: teacherId }).populate({
      path: "reviews.student",
      select: "name email",
    });

    const allReviews = courses
      .map(course => ({
        courseId: course._id,
        courseTitle: course.title,
        reviews: course.reviews || [],
      }))
      .filter(course => course.reviews.length > 0);

    res.status(200).json(allReviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews", details: err.message });
  }
};


 
export const myEarnings = async (teacherId) => {
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new Error("Invalid teacher ID");
  }

  // Find teacher's wallet
  const wallet = await Wallet.findOne({ ownerType: "teacher", ownerId: teacherId });
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  // Filter transactions: only approved credits (after university & finance approval)
  const approvedTransactions = wallet.transactions.filter(
    (tx) => tx.type === "credit" && tx.status === "approved"
  );

  // Total approved amount (after split)
  const totalEarnings = approvedTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return {
    balance: wallet.balance,         // current balance in wallet
    onHold: wallet.onHold,           // pending amounts
    totalEarnings,                   // total approved earnings
    transactions: approvedTransactions.map((tx) => ({
      amount: tx.amount,
      description: tx.description,
      createdAt: tx.createdAt,
      metadata: tx.metadata,
    })),
  };
};
