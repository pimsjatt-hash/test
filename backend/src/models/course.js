 // src/models/Course.js
import mongoose from "mongoose";
import crypto from "crypto";

// MCQ Schema
const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

// Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  order: { type: Number, required: true },
});

// Module Schema
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videos: [videoSchema],
  notes: { type: String },
  assignment: { type: String },
  mcqs: [mcqSchema],
});

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

// // Course Schema
// const courseSchema = new mongoose.Schema(
//   {
//     category: { type: String, required: true },
//     subCategory: { type: String, required: true },
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     duration: { type: String, required: true },
//     targetAudience: { type: String },
//     prerequisites: { type: String },
//     enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     tags: [{ type: String }],
//     modules: [moduleSchema],
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     reviews: [reviewSchema],
//     // Multi-level approval
//     isApprovedByUniversity: { type: Boolean, default: false },
//     isApprovedBySuperAdmin: { type: Boolean, default: false },
//     isApproved: { type: Boolean, default: false },
//     price: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );
const courseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    targetAudience: { type: String },
    prerequisites: { type: String },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    modules: [moduleSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviews: [reviewSchema],
    courseuniqueId: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(6).toString("hex"), // e.g. "a3f2b9c4e1"
    },
    // Approval
    isApprovedByUniversity: { type: Boolean, default: false },
    isApprovedBySuperAdmin: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },

    // Certificate
    certificateTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateTemplate" },
    passingScore: { type: Number, default: 33 },

    // Optional university owner
    university: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);


// Virtual for total enrolled students
courseSchema.virtual("totalEnrolledStudents").get(function () {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Ensure virtuals are included in JSON / Object responses
courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

// Pre-save hook for final approval
courseSchema.pre("save", function (next) {
  this.isApproved = this.isApprovedByUniversity && this.isApprovedBySuperAdmin;
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
