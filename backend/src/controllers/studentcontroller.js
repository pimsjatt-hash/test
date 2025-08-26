// controllers/studentController.js
import Course from "../models/course.js";
//import Payment from "../models/payment.js";
import Certificate, { IssuedCertificate } from "../models/certificate.js";

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
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    // check course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // create payment record (actual Razorpay integration commented)
    const payment = new Payment({
      student: studentId,
      course: courseId,
      amount: course.price || 0,
      status: "pending",
    });
    await payment.save();

    res.json({ message: "Enrollment initiated", paymentId: payment._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to enroll in course" });
  }
};

// ✅ Get my enrolled courses
export const myCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const payments = await Payment.find({ student: studentId, status: "success" }).populate("course");
    res.json(payments.map(p => p.course));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
};

// ✅ Submit review for a course
export const reviewCourse = async (req, res) => {
  try {
    const { courseId, review } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (!course.reviews) course.reviews = [];
    course.reviews.push({ student: studentId, review });
    await course.save();

    res.json({ message: "Review submitted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review" });
  }
};
