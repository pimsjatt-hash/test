 import fs from "fs";
import path from "path";
import mongoose from "mongoose";

import Report from "../models/Report.js";
import User from "../models/user.js";
import Course from "../models/course.js";
import Enrollment from "../models/Enrollment.js"; // ✅ correct

import { generatePDF, generateExcel, generateWord } from "../utils/Report.js";

// Create Report
export const createReport = async (req, res) => {
  try {
    const { title, type, filters, format } = req.body;
    const superAdminId = req.user.id;

    // 1️⃣ Prepare data based on report type
    let data = [];
    if (type === "Revenue") {
      data = await Enrollment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(filters.startDate),
              $lte: new Date(filters.endDate),
            },
          },
        },
        { $group: { _id: "$courseId", totalRevenue: { $sum: "$amount" } } },
      ]);
    } else if (type === "Enrollment") {
      data = await Enrollment.find({
        createdAt: {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        },
      }).populate("courseId userId");
    } else if (type === "Analytics") {
      data = {
        totalUsers: await User.countDocuments(),
        totalCourses: await Course.countDocuments(),
        totalEnrollments: await Enrollment.countDocuments(),
      };
    }

    // 2️⃣ Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "backend", "uploads", "reports");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // 3️⃣ Generate report file
    const safeTitle = title.replace(/\s+/g, "_");
    const fileName = `${safeTitle}-${Date.now()}.${format}`;
    const filePath = path.join(uploadDir, fileName);

    if (format === "pdf") await generatePDF(title, data, filePath);
    else if (format === "excel") await generateExcel(title, data, filePath);
    else await generateWord(title, data, filePath);

    // 4️⃣ Save report in DB
    const report = await Report.create({
      title,
      type,
      filters,
      format,
      fileUrl: filePath, // store local path
      generatedBy: superAdminId, // ✅ required field
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("generatedBy", "name email");
    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download report
export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    if (!fs.existsSync(report.fileUrl)) {
      return res.status(404).json({ success: false, message: "File not found on server" });
    }

    res.download(report.fileUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    // Delete file from server
    if (fs.existsSync(report.fileUrl)) fs.unlinkSync(report.fileUrl);

    res.status(200).json({ success: true, message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
