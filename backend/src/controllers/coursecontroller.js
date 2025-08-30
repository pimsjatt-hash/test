 // src/controllers/courseController.js
import Course from "../models/course.js";
import { IssuedCertificate, CertificateTemplate } from "../models/certificate.js";
import User from "../models/user.js";
import crypto from "crypto";

// --- permission helper: teacher/university owner or superadmin ---
const canEditCourse = (course, user) => {
  if (!user) return false;
  if (user.role === "superadmin") return true;
  return (
    (user.role === "teacher" || user.role === "university") &&
    String(course.createdBy) === String(user.id)
  );
};

// --- permission helper for delete ---
const canDeleteCourse = (course, user) => {
  if (!user) return false;
  return (
    (user.role === "teacher" && String(course.createdBy) === String(user.id)) ||
    user.role === "university" || user.role === "superadmin"
  );
};

// --- CREATE COURSE ---
export const createCourse = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      title,
      description,
      duration,
      targetAudience,
      prerequisites,
      tags,
    } = req.body;

    const teacher = await User.findById(req.user.id);

    const course = await Course.create({
      category,
      subCategory,
      title,
      description,
      duration,
      targetAudience,
      prerequisites,
      tags,
      createdBy: req.user.id,
      isApprovedByUniversity:
        teacher.role === "university" || !teacher.affiliatedUniversity ? true : false,
      isApprovedBySuperAdmin: false,
    });

    res.status(201).json({ message: "Course created, pending approval", course });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- APPROVE COURSE ---
// export const approveCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { action } = req.body;

//     const course = await Course.findById(courseId).populate("createdBy");
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     if (req.user.role === "university") {
//       if (
//         !course.createdBy.affiliatedUniversity ||
//         String(course.createdBy.affiliatedUniversity) !== String(req.user.id)
//       ) {
//         return res
//           .status(403)
//           .json({ message: "You can only approve courses from your teachers" });
//       }
//       course.isApprovedByUniversity = action === "approve";
//     } else if (req.user.role === "superadmin") {
//       course.isApprovedBySuperAdmin = action === "approve";
//     } else {
//       return res.status(403).json({ message: "Not allowed to approve" });
//     }

//     if (!course.createdBy.affiliatedUniversity) {
//       course.isApproved = course.isApprovedBySuperAdmin;
//     } else {
//       course.isApproved = course.isApprovedByUniversity && course.isApprovedBySuperAdmin;
//     }

//     await course.save();
//     res.json({ message: `Course ${action}d successfully`, course });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

export const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (status === "approved") {
      course.isApprovedBySuperAdmin = true;
      course.rejectionNote = null;
    } else if (status === "rejected") {
      course.isApprovedBySuperAdmin = false;
      course.rejectionNote = note || "Rejected by superadmin";
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    await course.save();

    res.json({ message: `Course ${status} successfully`, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// --- GET All  COURSES ---
export const getCourses = async (_req, res) => {
  try {
    const list = await Course.find({ isApproved: false }).populate("createdBy", "name role");
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- GET APPROVED COURSES ---
export const getApproveCourses = async (_req, res) => {
  try {
    const list = await Course.find({ isApproved: true }).populate("createdBy", "name role");
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- DELETE COURSE ---
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!canDeleteCourse(course, req.user)) {
      return res.status(403).json({ message: "Not allowed to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully", courseId });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- ADD MODULE ---
export const addModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!canEditCourse(course, req.user)) return res.status(403).json({ message: "Not allowed" });

    course.modules.push({ title, videos: [], notes: "", assignment: "", mcqs: [] });
    await course.save();
    res.status(201).json({ message: "Module added", course });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- ADD VIDEO ---
export const addVideo = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!canEditCourse(course, req.user)) return res.status(403).json({ message: "Not allowed" });

    const mod = course.modules.id(moduleId);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    if (!req.file) return res.status(400).json({ message: "Video file required" });

    mod.videos.push({ title, fileUrl: req.file.path, order: Number(order) || mod.videos.length + 1 });
    await course.save();
    res.status(201).json({ message: "Video added", module: mod });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- ADD NOTES ---
export const addNotes = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!canEditCourse(course, req.user)) return res.status(403).json({ message: "Not allowed" });

    const mod = course.modules.id(moduleId);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    if (!req.file) return res.status(400).json({ message: "Notes file required" });

    mod.notes = req.file.path;
    await course.save();
    res.status(201).json({ message: "Notes set", module: mod });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- ADD MCQS ---
export const addMcqs = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { mcqs } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!canEditCourse(course, req.user)) return res.status(403).json({ message: "Not allowed" });

    const mod = course.modules.id(moduleId);
    if (!mod) return res.status(404).json({ message: "Module not found" });
    if (!Array.isArray(mcqs) || mcqs.length === 0)
      return res.status(400).json({ message: "MCQs array required" });

    mcqs.forEach((q) => mod.mcqs.push(q));
    await course.save();
    res.status(201).json({ message: "MCQs added", count: mcqs.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// --- SUBMIT EXAM ---
export const submitExam = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers, templateId } = req.body;

    if (!Array.isArray(answers)) return res.status(400).json({ message: "Answers array required" });
    if (!templateId) return res.status(400).json({ message: "templateId required" });

    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student")
      return res.status(403).json({ message: "Only students can submit exam" });

    const course = await Course.findById(courseId);
    if (!course || !course.isApproved)
      return res.status(404).json({ message: "Course not found or not approved" });

    if (!course.enrolledStudents.includes(student._id))
      return res.status(403).json({ message: "Student not enrolled in this course" });

    // --- scoring ---
    let total = 0;
    let correct = 0;
    const ansMap = new Map();
    answers.forEach((a) => ansMap.set(`${a.moduleId}:${a.questionIndex}`, (a.answer || "").trim().toLowerCase()));

    course.modules.forEach((m) => {
      m.mcqs.forEach((q, i) => {
        total++;
        const key = `${m._id}:${i}`;
        const given = (ansMap.get(key) || "").trim().toLowerCase();
        if (given && given === (q.correctAnswer || "").trim().toLowerCase()) correct++;
      });
    });

    const scorePercent = total ? Math.round((correct / total) * 100) : 0;
    if (scorePercent < 33)
      return res.json({ passed: false, score: scorePercent, message: "Minimum passing 33%" });

    const template = await CertificateTemplate.findById(templateId);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const certificateId = `CERT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

        const issued = await IssuedCertificate.create({
          certificateId,
          student: student._id,
          course: course._id,
          template: template._id
        });
    
        res.json({
          passed: true,
          score: scorePercent,
          certificateId: issued.certificateId,
          message: "Exam passed, certificate issued"
        });
      } catch (e) {
        res.status(500).json({ message: e.message });
      }
    };
