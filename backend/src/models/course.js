 // src/models/Course.js
import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  order: { type: Number, required: true },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videos: [videoSchema],
  notes: { type: String, required: false }, // optional now
  assignment: { type: String, required: false }, // optional
  mcqs: [mcqSchema],
});

const courseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    targetAudience: { type: String, required: false },
    prerequisites: { type: String, required: false },
    tags: [{ type: String }],

    modules: [moduleSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher/university who created
      required: true,
    },

    // Multi-level approval
    isApprovedByUniversity: { type: Boolean, default: false },
    isApprovedBySuperAdmin: { type: Boolean, default: false },
    isApproved: {
      type: Boolean,
      default: false,
    },

    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Pre-save hook to automatically compute final approval
courseSchema.pre("save", function (next) {
  this.isApproved = this.isApprovedByUniversity && this.isApprovedBySuperAdmin;
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
