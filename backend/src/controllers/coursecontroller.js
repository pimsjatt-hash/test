 // src/controllers/courseController.js
import Course from "../models/course.js";
// import { IssuedCertificate, CertificateTemplate } from "../models/certificate.js";
import User from "../models/user.js";
import crypto from "crypto";
import { createCertificatePDF } from "../utils/pdfGenerator.js";


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

export const createCourse = async (req, res) => {
  try {
      console.log("DEBUG req.body:", req.body);
    console.log("DEBUG req.file:", req.file);
    // --- JSON/text fields from form ---
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

    // --- Optional uploaded file ---
    const courseFile = req.file ? req.file.path : null;

    // --- Verify teacher/university ---
    const teacher = await User.findById(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    let isApprovedByUniversity = false;
    if (teacher.role === "university") {
      isApprovedByUniversity = true;
    } else if (teacher.role === "teacher") {
      // If teacher has an affiliated university → needs approval
      isApprovedByUniversity = !!teacher.affiliatedUniversity ? false : false;
    }

    // --- Normalize tags ---
    let normalizedTags = [];
    if (tags) {
      // handle "mern, react, node" → ["mern","react","node"]
      normalizedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // --- Create course ---
    const course = await Course.create({
      category,
      subCategory,
      title,
      description,
      duration,
      targetAudience,
      prerequisites,
      tags: normalizedTags,
      courseFile, // uploaded file path
      createdBy: req.user.id,
      courseuniqueId: crypto.randomBytes(5).toString("hex"),
      isApprovedByUniversity,
      isApprovedBySuperAdmin: false,
    });

    res.status(201).json({
      success: true,
      message: "Course created, pending approval",
      course,
    });
  } catch (e) {
    console.error("Error creating course:", e);
    res.status(500).json({ message: e.message });
  }
};
 
 export const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const userRole = req.user.role; // from authMiddleware

    const course = await Course.findById(id).populate("createdBy university");
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Check if it's a freelancer course (no university assigned)
    const isFreelancerCourse =
      !course.university && course.createdBy.role === "teacher";

    // --- UNIVERSITY APPROVAL ---
    if (userRole === "university") {
      if (isFreelancerCourse) {
        return res.status(403).json({
          message: "University cannot approve freelancer courses",
        });
      }

      if (status === "approved") {
        course.isApprovedByUniversity = true;
        course.rejectionNote = null;
      } else {
        course.isApprovedByUniversity = false;
        course.rejectionNote = note || "Rejected by university";
      }
    }

    // --- SUPERADMIN APPROVAL ---
    if (userRole === "superadmin") {
      if (isFreelancerCourse) {
        // Freelancer: auto-mark university as approved
        course.isApprovedByUniversity = true;
      } else {
        // Affiliated: require university approval first
        if (!course.isApprovedByUniversity) {
          return res.status(400).json({
            message: "University must approve this course first",
          });
        }
      }

      if (status === "approved") {
        course.isApprovedBySuperAdmin = true;
        course.rejectionNote = null;
      } else {
        course.isApprovedBySuperAdmin = false;
        course.rejectionNote = note || "Rejected by superadmin";
      }
    }

    await course.save();

    res.json({
      message: `Course ${status} by ${userRole}`,
      course,
    });
  } catch (error) {
    console.error("Error in approveCourse:", error);
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
// export const submitExam = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { answers, templateId } = req.body;

//     if (!Array.isArray(answers)) return res.status(400).json({ message: "Answers array required" });
//     if (!templateId) return res.status(400).json({ message: "templateId required" });

//     const student = await User.findById(req.user.id);
//     if (!student || student.role !== "student")
//       return res.status(403).json({ message: "Only students can submit exam" });

//     const course = await Course.findById(courseId);
//     if (!course || !course.isApproved)
//       return res.status(404).json({ message: "Course not found or not approved" });

//     if (!course.enrolledStudents.includes(student._id))
//       return res.status(403).json({ message: "Student not enrolled in this course" });

//     // --- scoring ---
//     let total = 0;
//     let correct = 0;
//     const ansMap = new Map();
//     answers.forEach((a) => ansMap.set(`${a.moduleId}:${a.questionIndex}`, (a.answer || "").trim().toLowerCase()));

//     course.modules.forEach((m) => {
//       m.mcqs.forEach((q, i) => {
//         total++;
//         const key = `${m._id}:${i}`;
//         const given = (ansMap.get(key) || "").trim().toLowerCase();
//         if (given && given === (q.correctAnswer || "").trim().toLowerCase()) correct++;
//       });
//     });

//     const scorePercent = total ? Math.round((correct / total) * 100) : 0;
//     if (scorePercent < 33)
//       return res.json({ passed: false, score: scorePercent, message: "Minimum passing 33%" });

//     const template = await CertificateTemplate.findById(templateId);
//     if (!template) return res.status(404).json({ message: "Template not found" });

//     const certificateId = `CERT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

//         const issued = await IssuedCertificate.create({
//           certificateId,
//           student: student._id,
//           course: course._id,
//           template: template._id
//         });
    
//         res.json({
//           passed: true,
//           score: scorePercent,
//           certificateId: issued.certificateId,
//           message: "Exam passed, certificate issued"
//         });
//       } catch (e) {
//         res.status(500).json({ message: e.message });
//       }
//     };

export const submitExam = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers, templateId } = req.body;

    if (!Array.isArray(answers))
      return res.status(400).json({ message: "Answers array required" });
    if (!templateId)
      return res.status(400).json({ message: "templateId required" });

    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student")
      return res.status(403).json({ message: "Only students can submit exam" });

    const course = await Course.findById(courseId);
    if (!course || !course.isApproved)
      return res.status(404).json({ message: "Course not found or not approved" });

    if (!course.enrolledStudents.includes(student._id))
      return res
        .status(403)
        .json({ message: "Student not enrolled in this course" });

    // --- scoring ---
    let total = 0;
    let correct = 0;
    const ansMap = new Map();
    answers.forEach((a) =>
      ansMap.set(
        `${a.moduleId}:${a.questionIndex}`,
        (a.answer || "").trim().toLowerCase()
      )
    );

    course.modules.forEach((m) => {
      m.mcqs.forEach((q, i) => {
        total++;
        const key = `${m._id}:${i}`;
        const given = (ansMap.get(key) || "").trim().toLowerCase();
        if (given && given === (q.correctAnswer || "").trim().toLowerCase())
          correct++;
      });
    });

    const scorePercent = total ? Math.round((correct / total) * 100) : 0;
    if (scorePercent < 33)
      return res.json({
        passed: false,
        score: scorePercent,
        message: "Minimum passing 33%"
      });

    // --- certificate issuance ---
    const template = await CertificateTemplate.findById(templateId);
    if (!template)
      return res.status(404).json({ message: "Template not found" });

    const uniqueId = crypto.randomBytes(8).toString("hex");

    // generate certificate PDF
    const { publicPath, qrUrl } = await createCertificatePDF({
      studentName: student.fullName || student.name || student.email,
      courseTitle: course.title,
      uniqueId,
      issuedAt: new Date(),
      logoUrl: template.logoUrl,
      backgroundUrl: template.backgroundUrl,
      signatories: template.signatories,
      templateLayout: template.layout || {
        validationBaseUrl: process.env.PUBLIC_BASE_URL || ""
      }
    });

    const issued = await IssuedCertificate.create({
      uniqueId,
      studentId: student._id,
      studentName: student.fullName || student.name || student.email,
      courseId: course._id,
      courseTitle: course.title,
      templateId: template._id,
      score: scorePercent,
      issuedAt: new Date(),
      pdfUrl: publicPath,
      qrUrl
    });

    return res.json({
      passed: true,
      score: scorePercent,
      certificate: {
        id: issued._id,
        uniqueId: issued.uniqueId,
        pdfUrl: issued.pdfUrl,
        qrUrl: issued.qrUrl
      },
      message: "Exam passed, certificate issued"
    });
  } catch (e) {
    console.error("submitExam error:", e);
    res.status(500).json({ message: e.message });
  }
};
